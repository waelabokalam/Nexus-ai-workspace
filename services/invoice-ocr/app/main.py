from __future__ import annotations

import hmac
import os
import tempfile
from pathlib import Path
from urllib.parse import unquote

from fastapi import FastAPI, Header, HTTPException, Request
from starlette.concurrency import run_in_threadpool

from .contracts import OcrDocument
from .engine import PaddleStructureEngine

MAX_FILE_BYTES = 10 * 1024 * 1024
MAX_PDF_PAGES = 20
SUPPORTED_TYPES = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

app = FastAPI(title="Nexus Invoice OCR", version="1.0.0", docs_url=None, redoc_url=None)
engine = PaddleStructureEngine()


def _authorize(value: str | None) -> None:
    configured = os.getenv("NEXUS_OCR_TOKEN")
    if not configured:
        raise HTTPException(status_code=503, detail="OCR service authentication is not configured")
    expected = f"Bearer {configured}"
    if value is None or not hmac.compare_digest(value, expected):
        raise HTTPException(status_code=401, detail="Unauthorized")


def _validate_pdf_pages(data: bytes) -> None:
    try:
        import pypdfium2

        document = pypdfium2.PdfDocument(data)
        try:
            if len(document) > MAX_PDF_PAGES:
                raise HTTPException(status_code=413, detail=f"PDF invoices may contain at most {MAX_PDF_PAGES} pages")
        finally:
            document.close()
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=422, detail="The uploaded PDF is malformed") from error


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "engine": "PP-StructureV3"}


@app.post("/v1/extract", response_model=OcrDocument, response_model_by_alias=True)
async def extract(
    request: Request,
    authorization: str | None = Header(default=None),
    x_file_name: str = Header(default="invoice"),
    x_ocr_language: str = Header(default="auto"),
) -> OcrDocument:
    _authorize(authorization)
    content_type = request.headers.get("content-type", "").split(";", 1)[0].lower()
    suffix = SUPPORTED_TYPES.get(content_type)
    if suffix is None:
        raise HTTPException(status_code=415, detail="Invoice must be PDF, JPEG, PNG, or WebP")
    data = await request.body()
    if not data:
        raise HTTPException(status_code=422, detail="Invoice file is empty")
    if len(data) > MAX_FILE_BYTES:
        raise HTTPException(status_code=413, detail="Invoice file exceeds 10 MB")
    if content_type == "application/pdf":
        _validate_pdf_pages(data)
    if x_ocr_language not in {"auto", "en", "ar", "mixed"}:
        raise HTTPException(status_code=422, detail="Unsupported OCR language hint")

    safe_stem = "".join(character for character in unquote(x_file_name)[:160] if character.isalnum() or character in "-_") or "invoice"
    with tempfile.TemporaryDirectory(prefix="nexus-invoice-") as directory:
        path = Path(directory) / f"{safe_stem}{suffix}"
        path.write_bytes(data)
        try:
            return await run_in_threadpool(engine.extract, path, x_ocr_language)
        except HTTPException:
            raise
        except Exception as error:
            raise HTTPException(status_code=422, detail=f"PP-StructureV3 could not extract this invoice: {error}") from error
