import { readFileSync } from "node:fs";

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { ManualSupplierInvoiceExtractor } from "@/lib/restaurant/invoices";
import {
  PaddleInvoiceExtractionError,
  PaddleSupplierInvoiceExtractor,
  ReviewedPaddleDraftSupplierInvoiceExtractor,
  normalizeOcrDigits,
  parseOcrNumber,
  parsePaddleInvoiceDocument,
  type PaddleDocument,
} from "@/lib/restaurant/paddle-invoice";

function documentFixture(overrides: Partial<PaddleDocument> = {}): PaddleDocument {
  return {
    engine: {
      name: "PP-StructureV3",
      paddleocrVersion: "3.7.0",
      recognitionModel: "en_PP-OCRv5_mobile_rec",
      language: "en",
    },
    durationMs: 812,
    pages: [{
      pageIndex: 0,
      pageCount: 1,
      blocks: [
        { text: "Acme Foods LLC", confidence: 0.96, label: "text", order: 0, bbox: [10, 10, 200, 30] },
        { text: "Invoice No: INV-2048", confidence: 0.94, label: "text", order: 1, bbox: null },
        { text: "Invoice Date: 09/09/2026", confidence: 0.93, label: "text", order: 2, bbox: null },
        { text: "Subtotal: AED 180.00", confidence: 0.95, label: "text", order: 3, bbox: null },
        { text: "VAT: AED 9.00", confidence: 0.95, label: "text", order: 4, bbox: null },
        { text: "Grand Total: AED 189.00", confidence: 0.97, label: "text", order: 5, bbox: null },
      ],
      tables: [{
        rows: [
          ["Description", "Qty", "Unit", "Unit Price", "Line Total"],
          ["Chicken Breast 5KG", "10", "kg", "18.00", "180.00"],
        ],
        confidence: 0.92,
        bbox: [10, 100, 700, 500],
      }],
    }],
    warnings: [],
    ...overrides,
  };
}

describe("PaddleOCR invoice semantics", () => {
  it.runIf(Boolean(process.env.NEXUS_LIVE_OCR_RESULT))(
    "maps a real PaddleOCR result into the downstream invoice schema",
    () => {
      const document = JSON.parse(readFileSync(process.env.NEXUS_LIVE_OCR_RESULT!, "utf8"));
      const result = parsePaddleInvoiceDocument(document);
      expect(result).toMatchObject({
        supplierName: "Synthetic Gulf Foods LLC",
        invoiceNumber: "SYN-EN-1001",
        invoiceDate: "2026-09-09",
        currency: "AED",
        subtotal: 220,
        taxTotal: 11,
        total: 231,
      });
      expect(result.lineItems).toHaveLength(2);
    },
  );

  it("maps English PP-StructureV3 headers and tables into the Phase 2.3 schema", () => {
    const result = parsePaddleInvoiceDocument(documentFixture());
    expect(result).toMatchObject({
      supplierName: "Acme Foods LLC",
      invoiceNumber: "INV-2048",
      invoiceDate: "2026-09-09",
      currency: "AED",
      subtotal: 180,
      taxTotal: 9,
      total: 189,
      confidence: 0.864,
    });
    expect(result.lineItems[0]).toMatchObject({ quantity: 10, unit: "kg", unitPrice: 18, lineTotal: 180 });
  });

  it("handles Arabic labels, Arabic-Indic digits, currency, units, and mixed descriptions", () => {
    const fixture = documentFixture({
      engine: { name: "PP-StructureV3", paddleocrVersion: "3.7.0", recognitionModel: "arabic_PP-OCRv5_mobile_rec", language: "mixed" },
      pages: [{
        pageIndex: 0,
        pageCount: 1,
        blocks: [
          { text: "اسم المورد: أغذية الخليج Gulf Foods", confidence: 0.9, label: "text", order: 0, bbox: null },
          { text: "رقم الفاتورة: ١٢٣٤", confidence: 0.91, label: "text", order: 1, bbox: null },
          { text: "تاريخ الفاتورة: ٠٩/٠٩/٢٠٢٦", confidence: 0.92, label: "text", order: 2, bbox: null },
          { text: "الإجمالي النهائي: ١٨٩٫٠٠ د.إ", confidence: 0.94, label: "text", order: 3, bbox: null },
        ],
        tables: [{ rows: [
          ["الوصف", "الكمية", "الوحدة", "سعر الوحدة", "المبلغ"],
          ["Chicken دجاج", "١٠", "كجم", "١٨٫٠٠", "١٨٠٫٠٠"],
        ], confidence: 0.88, bbox: null }],
      }],
      warnings: [],
    });
    const result = parsePaddleInvoiceDocument(fixture);
    expect(result).toMatchObject({ invoiceNumber: "١٢٣٤", invoiceDate: "2026-09-09", currency: "AED", total: 189 });
    expect(result.lineItems[0]).toMatchObject({ rawDescription: "Chicken دجاج", quantity: 10, unit: "kg", unitPrice: 18 });
  });

  it("deduplicates repeated table rows while preserving multi-page order", () => {
    const first = documentFixture().pages[0];
    const result = parsePaddleInvoiceDocument(documentFixture({
      pages: [
        { ...first, pageIndex: 1, pageCount: 2 },
        { ...first, pageIndex: 0, pageCount: 2 },
      ],
    }));
    expect(result.lineItems).toHaveLength(1);
  });

  it("supports photographed/low-quality output but lowers confidence for review", () => {
    const fixture = documentFixture();
    fixture.pages[0].blocks = fixture.pages[0].blocks.map((block) => ({ ...block, confidence: 0.61 }));
    fixture.pages[0].tables[0].confidence = 0.58;
    expect(parsePaddleInvoiceDocument(fixture).confidence).toBe(0.549);
  });

  it("recognizes unusual but supported table aliases", () => {
    const fixture = documentFixture();
    fixture.pages[0].tables[0].rows[0] = ["Product", "Quantity", "UOM", "Rate", "Net Amount"];
    expect(parsePaddleInvoiceDocument(fixture).lineItems).toHaveLength(1);
  });

  it("fails safely when required OCR semantics are missing", () => {
    const fixture = documentFixture();
    fixture.pages[0].tables = [];
    expect(() => parsePaddleInvoiceDocument(fixture)).toThrow(PaddleInvoiceExtractionError);
  });

  it("normalizes international number formats deterministically", () => {
    expect(normalizeOcrDigits("١٬٢٣٤٫٥٠")).toBe("1,234.50");
    expect(parseOcrNumber("AED 1,234.50")).toBe(1234.5);
    expect(parseOcrNumber("١٬٢٣٤٫٥٠ د.إ")).toBe(1234.5);
    expect(parseOcrNumber("١٨٠،٥٠")).toBe(180.5);
  });

  it("accepts unambiguous US dates without changing international dates", () => {
    const us = documentFixture();
    us.pages[0].blocks[2].text = "Invoice Date: 12/31/2026";
    expect(parsePaddleInvoiceDocument(us).invoiceDate).toBe("2026-12-31");
    const international = documentFixture();
    international.pages[0].blocks[2].text = "Invoice Date: 31/12/2026";
    expect(parsePaddleInvoiceDocument(international).invoiceDate).toBe("2026-12-31");
  });
});

describe("PaddleSupplierInvoiceExtractor adapter", () => {
  it.runIf(Boolean(
    process.env.NEXUS_LIVE_OCR_URL
    && process.env.NEXUS_LIVE_OCR_TOKEN
    && process.env.NEXUS_LIVE_INVOICE_FILE,
  ))("calls the live isolated OCR service with a real invoice file", async () => {
    const bytes = readFileSync(process.env.NEXUS_LIVE_INVOICE_FILE!);
    const extractor = new PaddleSupplierInvoiceExtractor({
      endpoint: process.env.NEXUS_LIVE_OCR_URL,
      token: process.env.NEXUS_LIVE_OCR_TOKEN,
      timeoutMs: 180_000,
    });
    const result = await extractor.extract({
      filename: "synthetic-clean-english.png",
      mimeType: "image/png",
      bytes,
      languageHint: "en",
    });
    expect(result).toMatchObject({
      supplierName: "Synthetic Gulf Foods LLC",
      invoiceNumber: "SYN-EN-1001",
      currency: "AED",
      total: 231,
    });
    expect(result.lineItems).toHaveLength(2);
  }, 180_000);

  it("calls the isolated service and remains downstream-schema compatible", async () => {
    const request = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      void input;
      void init;
      return new Response(JSON.stringify(documentFixture()), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
    const extractor = new PaddleSupplierInvoiceExtractor({ endpoint: "http://ocr.internal", token: "secret", fetch: request as typeof fetch });
    const result = await extractor.extract({
      filename: "invoice.pdf",
      mimeType: "application/pdf",
      bytes: new Uint8Array([1, 2, 3]),
      languageHint: "en",
      defaultCurrency: "AED",
    });
    expect(result.total).toBe(189);
    expect(request).toHaveBeenCalledOnce();
    expect(request.mock.calls[0][1]?.headers).toMatchObject({ authorization: "Bearer secret", "x-ocr-language": "en" });
  });

  it("reports service failures and leaves the manual extractor usable", async () => {
    const extractor = new PaddleSupplierInvoiceExtractor({
      endpoint: "http://ocr.internal",
      token: "secret",
      fetch: async () => new Response("model unavailable", { status: 503 }),
    });
    await expect(extractor.extract({ filename: "invoice.png", mimeType: "image/png", bytes: new Uint8Array([1]) }))
      .rejects.toThrow("Automatic extraction failed");
    const manual = await new ManualSupplierInvoiceExtractor().extract({
      filename: "invoice.png",
      mimeType: "image/png",
      bytes: new Uint8Array([1]),
      manualExtraction: {
        supplierName: "Fallback Foods", invoiceNumber: null, invoiceDate: "2026-09-09",
        currency: "AED", subtotal: 10, taxTotal: 0.5, total: 10.5, confidence: 1,
        lineItems: [{ rawDescription: "Oil", quantity: 1, unit: "case", unitPrice: 10, lineTotal: 10, extractionConfidence: 1 }],
      },
    });
    expect(manual.supplierName).toBe("Fallback Foods");
  });

  it("preserves reviewed automatic evidence through the stable extractor boundary", async () => {
    const automatic = parsePaddleInvoiceDocument(documentFixture());
    const reviewed = await new ReviewedPaddleDraftSupplierInvoiceExtractor().extract({
      filename: "invoice.png",
      mimeType: "image/png",
      bytes: new Uint8Array([1]),
      manualExtraction: {
        ...automatic,
        supplierName: "Corrected Acme Foods LLC",
      },
    });
    expect(reviewed.supplierName).toBe("Corrected Acme Foods LLC");
    expect(reviewed.confidence).toBe(automatic.confidence);
    expect(reviewed.rawExtraction).toMatchObject({
      mode: "paddle_pp_structure_v3",
      managerCorrectionFlow: "reviewed_automatic_draft_v1",
    });
  });
});
