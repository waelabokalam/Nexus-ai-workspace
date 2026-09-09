import "server-only";

import { z } from "zod";

import {
  normalizeInvoiceExtraction,
  type InvoiceExtractorInput,
  type NormalizedInvoiceExtraction,
  type SupplierInvoiceExtractor,
} from "@/lib/restaurant/invoices";

export const PADDLE_INVOICE_EXTRACTOR_NAME = "paddle_pp_structure_v3_3_7_0";
export const PADDLE_INVOICE_CONFIDENCE_THRESHOLD = 0.8;

const ocrBlockSchema = z.object({
  text: z.string().max(10_000),
  confidence: z.number().min(0).max(1).nullable().default(null),
  label: z.string().max(80).default("text"),
  order: z.number().int().nonnegative().nullable().default(null),
  bbox: z.array(z.number().finite()).max(8).nullable().default(null),
});

const ocrTableSchema = z.object({
  rows: z.array(z.array(z.string().max(2_000)).max(30)).max(300),
  confidence: z.number().min(0).max(1).nullable().default(null),
  bbox: z.array(z.number().finite()).max(8).nullable().default(null),
});

export const paddleDocumentSchema = z.object({
  engine: z.object({
    name: z.literal("PP-StructureV3"),
    paddleocrVersion: z.string().min(1).max(30),
    recognitionModel: z.string().min(1).max(100),
    language: z.enum(["auto", "en", "ar", "mixed"]),
  }),
  durationMs: z.number().finite().nonnegative(),
  pages: z.array(z.object({
    pageIndex: z.number().int().nonnegative(),
    pageCount: z.number().int().positive().nullable().default(null),
    blocks: z.array(ocrBlockSchema).max(1_000),
    tables: z.array(ocrTableSchema).max(100),
  })).min(1).max(50),
  warnings: z.array(z.string().max(500)).max(50).default([]),
});

export type PaddleDocument = z.infer<typeof paddleDocumentSchema>;

export interface InvoiceSemanticFallback {
  extract(document: PaddleDocument, input: InvoiceExtractorInput): Promise<NormalizedInvoiceExtraction>;
}

export class PaddleInvoiceExtractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaddleInvoiceExtractionError";
  }
}

type TextEvidence = { text: string; confidence: number; pageIndex: number };

const digitMap: Record<string, string> = {
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
  "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
};

export function normalizeOcrDigits(value: string) {
  return value.replace(/[٠-٩۰-۹]/g, (digit) => digitMap[digit] ?? digit)
    .replaceAll("٫", ".")
    .replaceAll("٬", ",")
    .replaceAll("،", ",");
}

export function parseOcrNumber(value: string): number | null {
  const numericToken = normalizeOcrDigits(value).match(/[+\-]?\d[\d.,]*/)?.[0] ?? "";
  const cleaned = numericToken.replace(/^\+/, "");
  if (!cleaned || !/\d/.test(cleaned)) return null;
  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  const decimalIndex = Math.max(lastComma, lastDot);
  let normalized = cleaned;
  if (decimalIndex >= 0) {
    const decimalDigits = cleaned.length - decimalIndex - 1;
    const separator = cleaned[decimalIndex];
    const separatorCount = cleaned.split(separator).length - 1;
    if (separator === "," && separatorCount === 1 && decimalDigits === 3) {
      normalized = cleaned.replaceAll(",", "");
    } else if (decimalDigits > 0 && decimalDigits <= 4) {
      normalized = cleaned.slice(0, decimalIndex).replace(/[.,]/g, "")
        + "." + cleaned.slice(decimalIndex + 1).replace(/[.,]/g, "");
    } else {
      normalized = cleaned.replaceAll(separator, "").replace(/[.,]/g, "");
    }
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseOcrDate(value: string): string | null {
  const normalized = normalizeOcrDigits(value).replace(/[.]/g, "/").trim();
  const yearFirst = normalized.match(/(20\d{2})[-/](\d{1,2})[-/](\d{1,2})/);
  const local = normalized.match(/(\d{1,2})[-/](\d{1,2})[-/](20\d{2})/);
  if (!yearFirst && !local) return null;
  const year = Number(yearFirst?.[1] ?? local?.[3]);
  let month = Number(yearFirst?.[2]);
  let day = Number(yearFirst?.[3]);
  if (local) {
    const first = Number(local[1]);
    const second = Number(local[2]);
    // Prefer the international day/month convention when ambiguous, while
    // accepting unambiguous US month/day dates such as 12/31/2026.
    [day, month] = second > 12 && first <= 12 ? [second, first] : [first, second];
  }
  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (candidate.getUTCFullYear() !== year || candidate.getUTCMonth() !== month - 1 || candidate.getUTCDate() !== day) return null;
  return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

const currencyMarkers: [RegExp, string][] = [
  [/\bAED\b|د\.?\s?إ|درهم/i, "AED"],
  [/\bSAR\b|ر\.?\s?س|ريال\s+سعودي/i, "SAR"],
  [/\bQAR\b|ر\.?\s?ق/i, "QAR"],
  [/\bKWD\b|د\.?\s?ك/i, "KWD"],
  [/\bBHD\b|د\.?\s?ب/i, "BHD"],
  [/\bOMR\b|ر\.?\s?ع/i, "OMR"],
  [/\bUSD\b|US\$|\$/i, "USD"],
  [/\bEUR\b|€/i, "EUR"],
  [/\bTRY\b|₺|TL\b/i, "TRY"],
];

function detectCurrency(text: string, fallback?: string) {
  return currencyMarkers.find(([pattern]) => pattern.test(text))?.[1] ?? fallback?.toUpperCase() ?? null;
}

function cleanLabeledValue(value: string, pattern: RegExp) {
  return value.replace(pattern, "").replace(/^[\s:#№-]+/, "").trim();
}

function findLabeledText(lines: TextEvidence[], patterns: RegExp[]) {
  for (const line of lines) {
    for (const pattern of patterns) {
      if (!pattern.test(line.text)) continue;
      const value = cleanLabeledValue(line.text, pattern);
      if (value) return { value, confidence: line.confidence };
    }
  }
  return null;
}

function findLabeledNumber(lines: TextEvidence[], patterns: RegExp[]) {
  for (const line of lines) {
    for (const pattern of patterns) {
      if (!pattern.test(line.text)) continue;
      const value = parseOcrNumber(cleanLabeledValue(line.text, pattern));
      if (value !== null) return { value, confidence: line.confidence };
    }
  }
  return null;
}

function normalizeHeader(value: string) {
  return normalizeOcrDigits(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

const headerAliases = {
  description: ["item", "description", "product", "details", "الصنف", "البيان", "الوصف", "المنتج"],
  quantity: ["qty", "quantity", "الكمية", "عدد"],
  unit: ["unit", "uom", "وحدة", "الوحدة"],
  unitPrice: ["unit price", "price", "rate", "سعر الوحدة", "السعر"],
  lineTotal: ["line total", "amount", "net amount", "total", "المبلغ", "الإجمالي", "المجموع"],
} as const;

function headerColumn(headers: string[], aliases: readonly string[]) {
  return headers.findIndex((header) => aliases.some((alias) => header === alias || header.includes(alias)));
}

function normalizeParsedUnit(value: string | undefined) {
  const unit = normalizeHeader(value ?? "unit");
  if (/^(kg|kgs|kilogram|kilograms|كجم|كغ|كيلو|كيلوغرام)$/.test(unit)) return "kg";
  if (/^(g|gram|grams|جم|غرام)$/.test(unit)) return "g";
  if (/^(l|litre|liter|litres|liters|لتر)$/.test(unit)) return "l";
  if (/^(ml|millilitre|milliliter|مل)$/.test(unit)) return "ml";
  if (/^(box|boxes|صندوق)$/.test(unit)) return "box";
  if (/^(case|cases|carton|كرتون)$/.test(unit)) return "case";
  if (/^(pack|packs|packet|عبوة|حزمة)$/.test(unit)) return "pack";
  if (/^(unit|units|each|ea|pc|pcs|piece|pieces|حبة|وحدة)$/.test(unit)) return "unit";
  return null;
}

function tableItems(document: PaddleDocument) {
  const items: NormalizedInvoiceExtraction["lineItems"] = [];
  const seen = new Set<string>();
  for (const page of document.pages.sort((left, right) => left.pageIndex - right.pageIndex)) {
    for (const table of page.tables) {
      if (table.rows.length < 2) continue;
      const headers = table.rows[0].map(normalizeHeader);
      const descriptionIndex = headerColumn(headers, headerAliases.description);
      const quantityIndex = headerColumn(headers, headerAliases.quantity);
      const unitIndex = headerColumn(headers, headerAliases.unit);
      const unitPriceIndex = headerColumn(headers, headerAliases.unitPrice);
      const lineTotalIndex = headerColumn(headers, headerAliases.lineTotal);
      if ([descriptionIndex, quantityIndex, unitPriceIndex, lineTotalIndex].some((index) => index < 0)) continue;
      for (const row of table.rows.slice(1)) {
        const description = row[descriptionIndex]?.trim();
        const quantity = parseOcrNumber(row[quantityIndex] ?? "");
        const unitPrice = parseOcrNumber(row[unitPriceIndex] ?? "");
        const lineTotal = parseOcrNumber(row[lineTotalIndex] ?? "");
        const unit = normalizeParsedUnit(unitIndex >= 0 ? row[unitIndex] : "unit");
        if (!description || quantity === null || quantity <= 0 || unitPrice === null || unitPrice < 0 || lineTotal === null || lineTotal < 0 || !unit) continue;
        const signature = `${normalizeHeader(description)}|${quantity}|${unit}|${unitPrice}|${lineTotal}`;
        if (seen.has(signature)) continue;
        seen.add(signature);
        items.push({
          rawDescription: description,
          quantity,
          unit,
          unitPrice,
          lineTotal,
          extractionConfidence: table.confidence ?? 0.75,
        });
      }
    }
  }
  return items;
}

function boundedEvidence(document: PaddleDocument) {
  let remaining = 36_000;
  const pages: { pageIndex: number; text: string; tables: string[][][] }[] = [];
  for (const page of document.pages.slice(0, 20)) {
    if (remaining <= 0) break;
    const text = page.blocks.map((block) => block.text).join("\n").slice(0, remaining);
    remaining -= text.length;
    const tables: string[][][] = [];
    for (const table of page.tables.slice(0, 10)) {
      if (remaining <= 0) break;
      const rows = table.rows.slice(0, 80).map((row) => row.map((cell) => cell.slice(0, 300)));
      const serialized = JSON.stringify(rows);
      if (serialized.length > remaining) break;
      remaining -= serialized.length;
      tables.push(rows);
    }
    pages.push({ pageIndex: page.pageIndex, text, tables });
  }
  return pages;
}

export function parsePaddleInvoiceDocument(
  value: unknown,
  options: { defaultCurrency?: string } = {},
): NormalizedInvoiceExtraction {
  const document = paddleDocumentSchema.parse(value);
  const lines: TextEvidence[] = document.pages
    .sort((left, right) => left.pageIndex - right.pageIndex)
    .flatMap((page) => page.blocks.map((block) => ({
      text: block.text.trim(), confidence: block.confidence ?? 0.65, pageIndex: page.pageIndex,
    })))
    .filter((line) => line.text);
  const fullText = lines.map((line) => line.text).join("\n");

  const supplierLabel = findLabeledText(lines, [/^(?:supplier name|vendor name|supplier|vendor)\b/i, /^(?:اسم المورد|المورد)/u]);
  const supplierFallback = lines.find((line) =>
    line.pageIndex === 0 && line.text.length >= 2 && /\p{L}/u.test(line.text)
      && !/(invoice|tax invoice|فاتورة|date|تاريخ|vat|ضريبة|total|إجمالي|phone|هاتف|address|عنوان)/iu.test(line.text),
  );
  const supplier = supplierLabel ?? (supplierFallback ? { value: supplierFallback.text, confidence: supplierFallback.confidence * 0.9 } : null);
  const invoiceNumber = findLabeledText(lines, [
    /^(?:invoice(?:\s*(?:no|number|#|ref(?:erence)?))?|inv(?:\s*(?:no|#))?)\b/i,
    /^(?:رقم\s*الفاتورة|فاتورة\s*رقم)/u,
  ]);
  const dateLine = lines.find((line) => /(?:invoice\s+date|\bdate\b|تاريخ\s*الفاتورة|التاريخ)/iu.test(line.text) && parseOcrDate(line.text));
  const invoiceDate = dateLine ? parseOcrDate(dateLine.text) : lines.map((line) => ({ line, date: parseOcrDate(line.text) })).find(({ date }) => date)?.date ?? null;
  const subtotal = findLabeledNumber(lines, [/^(?:subtotal|net total)\b/i, /^(?:المجموع الفرعي|الإجمالي قبل الضريبة)/u]);
  const tax = findLabeledNumber(lines, [/^(?:tax total|vat|tax)\b/i, /^(?:ضريبة القيمة المضافة|الضريبة|ضريبة)/u]);
  const total = findLabeledNumber(lines, [/^(?:grand total|invoice total|amount due|total due)\b/i, /^(?:الإجمالي النهائي|الإجمالي|المجموع الكلي|المبلغ المستحق)/u])
    ?? [...lines].reverse().map((line) => ({ value: parseOcrNumber(line.text), confidence: line.confidence })).find(({ value }) => value !== null && value > 0) ?? null;
  const currency = detectCurrency(fullText, options.defaultCurrency);
  const items = tableItems(document);

  const missing = [!supplier && "supplier", !invoiceDate && "invoice date", !currency && "currency", !total && "total", !items.length && "line items"].filter(Boolean);
  if (missing.length) {
    throw new PaddleInvoiceExtractionError(`Automatic extraction is incomplete: missing ${missing.join(", ")}.`);
  }
  const fieldConfidence = {
    supplier: supplier!.confidence,
    invoiceNumber: invoiceNumber?.confidence ?? 0,
    invoiceDate: dateLine?.confidence ?? 0.65,
    currency: detectCurrency(fullText) ? 0.9 : 0.55,
    subtotal: subtotal?.confidence ?? 0,
    taxTotal: tax?.confidence ?? 0,
    total: total!.confidence,
    lineItems: items.reduce((sum, item) => sum + item.extractionConfidence, 0) / items.length,
  };
  const confidence = Number(Math.min(
    fieldConfidence.supplier,
    fieldConfidence.invoiceDate,
    fieldConfidence.currency,
    fieldConfidence.total,
    fieldConfidence.lineItems,
  ).toFixed(4));

  return normalizeInvoiceExtraction({
    supplierName: supplier!.value,
    invoiceNumber: invoiceNumber?.value ?? null,
    invoiceDate,
    currency,
    subtotal: subtotal?.value ?? null,
    taxTotal: tax?.value ?? null,
    total: total!.value,
    confidence,
    lineItems: items,
    rawExtraction: {
      mode: "paddle_pp_structure_v3",
      engine: document.engine,
      durationMs: document.durationMs,
      warnings: document.warnings,
      fieldConfidence,
      evidence: boundedEvidence(document),
    },
  });
}

export class PaddleSupplierInvoiceExtractor implements SupplierInvoiceExtractor {
  readonly name = PADDLE_INVOICE_EXTRACTOR_NAME;

  constructor(
    private readonly options: {
      endpoint?: string;
      token?: string;
      timeoutMs?: number;
      semanticFallback?: InvoiceSemanticFallback;
      fetch?: typeof fetch;
    } = {},
  ) {}

  async extract(input: InvoiceExtractorInput) {
    const endpoint = this.options.endpoint ?? process.env.NEXUS_INVOICE_OCR_URL;
    const token = this.options.token ?? process.env.NEXUS_INVOICE_OCR_TOKEN;
    if (!endpoint || !token) {
      throw new PaddleInvoiceExtractionError("Automatic invoice extraction is not configured.");
    }
    const request = this.options.fetch ?? fetch;
    let response: Response;
    try {
      response = await request(new URL("/v1/extract", endpoint), {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": input.mimeType,
          "x-file-name": encodeURIComponent(input.filename),
          "x-ocr-language": input.languageHint ?? "auto",
        },
        body: Buffer.from(input.bytes),
        cache: "no-store",
        signal: AbortSignal.timeout(this.options.timeoutMs ?? 120_000),
      });
    } catch (error) {
      throw new PaddleInvoiceExtractionError(`Automatic extraction service is unavailable: ${error instanceof Error ? error.message : "request failed"}`);
    }
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 500);
      throw new PaddleInvoiceExtractionError(`Automatic extraction failed (${response.status}): ${detail || "OCR service error"}`);
    }
    const document = paddleDocumentSchema.parse(await response.json());
    try {
      return parsePaddleInvoiceDocument(document, { defaultCurrency: input.defaultCurrency });
    } catch (error) {
      if (this.options.semanticFallback && error instanceof PaddleInvoiceExtractionError) {
        return this.options.semanticFallback.extract(document, input);
      }
      throw error;
    }
  }
}

export class ReviewedPaddleDraftSupplierInvoiceExtractor implements SupplierInvoiceExtractor {
  readonly name = PADDLE_INVOICE_EXTRACTOR_NAME;

  async extract(input: InvoiceExtractorInput) {
    if (!input.manualExtraction) {
      throw new PaddleInvoiceExtractionError("A reviewed automatic extraction draft is required.");
    }
    const reviewed = normalizeInvoiceExtraction(input.manualExtraction);
    return {
      ...reviewed,
      rawExtraction: {
        ...reviewed.rawExtraction,
        managerCorrectionFlow: "reviewed_automatic_draft_v1",
      },
    };
  }
}
