from app.contracts import OcrDocument, OcrEngineInfo, OcrPage
from app.main import app, engine
from fastapi.testclient import TestClient

client = TestClient(app)


def test_rejects_unauthenticated_requests(monkeypatch):
    monkeypatch.setenv("NEXUS_OCR_TOKEN", "test-secret")
    response = client.post("/v1/extract", content=b"image", headers={"content-type": "image/png"})
    assert response.status_code == 401


def test_extracts_supported_image_with_injected_engine(monkeypatch):
    monkeypatch.setenv("NEXUS_OCR_TOKEN", "test-secret")
    monkeypatch.setattr(engine, "extract", lambda path, language: OcrDocument(
        engine=OcrEngineInfo(
            paddleocrVersion="3.7.0",
            recognitionModel="en_PP-OCRv5_mobile_rec",
            language=language,
        ),
        durationMs=20,
        pages=[OcrPage(pageIndex=0, pageCount=None, blocks=[], tables=[])],
    ))
    response = client.post(
        "/v1/extract",
        content=b"synthetic-image",
        headers={
            "authorization": "Bearer test-secret",
            "content-type": "image/png",
            "x-ocr-language": "en",
        },
    )
    assert response.status_code == 200
    assert response.json()["engine"]["name"] == "PP-StructureV3"


def test_rejects_unsupported_media(monkeypatch):
    monkeypatch.setenv("NEXUS_OCR_TOKEN", "test-secret")
    response = client.post(
        "/v1/extract",
        content=b"text",
        headers={"authorization": "Bearer test-secret", "content-type": "text/plain"},
    )
    assert response.status_code == 415


def test_accepts_a_small_well_formed_pdf(monkeypatch):
    from io import BytesIO

    from PIL import Image

    output = BytesIO()
    Image.new("RGB", (32, 32), "white").save(output, "PDF")
    monkeypatch.setenv("NEXUS_OCR_TOKEN", "test-secret")
    monkeypatch.setattr(engine, "extract", lambda path, language: OcrDocument(
        engine=OcrEngineInfo(
            paddleocrVersion="3.7.0",
            recognitionModel="en_PP-OCRv5_mobile_rec",
            language=language,
        ),
        durationMs=20,
        pages=[OcrPage(pageIndex=0, pageCount=1, blocks=[], tables=[])],
    ))
    response = client.post(
        "/v1/extract",
        content=output.getvalue(),
        headers={
            "authorization": "Bearer test-secret",
            "content-type": "application/pdf",
            "x-ocr-language": "en",
        },
    )
    assert response.status_code == 200
