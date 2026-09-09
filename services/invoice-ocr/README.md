# Nexus invoice OCR service

This is an isolated, internal-only document worker for Restaurant V1. It uses the
official PaddleOCR 3.7.0 `PPStructureV3` pipeline and returns bounded document,
table, text, and confidence evidence. Invoice semantics remain in the Next.js
`PaddleSupplierInvoiceExtractor`; this service does not access Supabase.

## Runtime

- Python 3.11
- `paddlepaddle==3.3.1`
- `paddleocr[doc-parser]==3.7.0`
- one Uvicorn worker so downloaded models and in-memory pipelines are reused
- CPU by default; set `NEXUS_OCR_DEVICE` for a supported accelerator

The configuration keeps table parsing, the smaller official `PP-DocLayout-S`
layout model, orientation detection, and document unwarping. Formula, chart,
seal, and secondary region-detection models are disabled because invoices do not
need them. Both wired and wireless table paths use the official `SLANet_plus`
structure model to avoid the substantially larger default wired model.
`en_PP-OCRv5_mobile_rec` handles English; the official
`arabic_PP-OCRv5_mobile_rec` handles Arabic. Mixed mode currently uses the Arabic
model and should be treated as review-sensitive until measured on representative
bilingual supplier formats.

## Local start

Create `services/invoice-ocr/.venv`, install `requirements-dev.txt`, set a strong
`NEXUS_OCR_TOKEN`, then run:

```sh
uvicorn app.main:app --app-dir services/invoice-ocr --host 127.0.0.1 --port 8080
```

Configure the Next.js service with the same token and
`NEXUS_INVOICE_OCR_URL=http://127.0.0.1:8080`.

To keep model downloads inside a writable service volume, set
`PADDLE_PDX_CACHE_HOME` (for example, to `/service/.paddlex`).

## Synthetic evaluation set

Generate the eight non-private evaluation cases in a temporary directory:

```sh
python services/invoice-ocr/scripts/generate_synthetic_invoices.py /tmp/nexus-invoice-fixtures
```

The generator covers clean English, photographed, table-heavy, two-page PDF,
Arabic, mixed Arabic/English, degraded low-quality, and unusual-column-order
invoices. Generated binaries are intentionally not stored in Git.

The first extraction downloads and initializes official models. For production,
use a separate Railway service with persistent model cache or bake warmed models
into its image. Do not add these Python dependencies to the Next.js service.
