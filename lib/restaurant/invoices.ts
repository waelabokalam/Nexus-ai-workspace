import { z } from "zod";

export const SUPPLIER_INVOICE_BUCKET = "restaurant-supplier-invoices";
export const MAX_INVOICE_FILE_BYTES = 10 * 1024 * 1024;
export const SUPPORTED_INVOICE_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const PRICE_CHANGE_THRESHOLDS = {
  roundingPercent: 5,
  minimumAbsolute: 1,
  meaningfulIncreasePercent: 10,
  highIncreasePercent: 20,
  highIncreaseAbsolute: 3,
  suspiciousDecreasePercent: -20,
  suspiciousDecreaseAbsolute: 3,
} as const;

export const supplierInvoiceUnitSchema = z.enum([
  "kg",
  "g",
  "l",
  "ml",
  "unit",
  "box",
  "case",
  "pack",
]);

export type SupplierInvoiceUnit = z.infer<typeof supplierInvoiceUnitSchema>;

const optionalMoney = z.number().finite().nonnegative().max(100_000_000).nullable().optional();

export const extractedInvoiceItemSchema = z.object({
  rawDescription: z.string().trim().min(1).max(500),
  quantity: z.number().finite().positive().max(1_000_000),
  unit: z.string().trim().min(1).max(40),
  unitPrice: z.number().finite().nonnegative().max(10_000_000),
  lineTotal: z.number().finite().nonnegative().max(100_000_000),
  extractionConfidence: z.number().finite().min(0).max(1),
});

export const normalizedInvoiceExtractionSchema = z.object({
  supplierName: z.string().trim().min(2).max(160),
  taxIdentifier: z.string().trim().min(2).max(80).nullable().optional().default(null),
  invoiceNumber: z.string().trim().min(1).max(120).nullable().optional().default(null),
  invoiceDate: z.iso.date(),
  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/),
  subtotal: optionalMoney.default(null),
  taxTotal: optionalMoney.default(null),
  total: z.number().finite().positive().max(100_000_000),
  confidence: z.number().finite().min(0).max(1),
  lineItems: z.array(extractedInvoiceItemSchema).min(1).max(250),
  rawExtraction: z.record(z.string(), z.unknown()).optional().default({}),
});

export type NormalizedInvoiceExtraction = z.infer<
  typeof normalizedInvoiceExtractionSchema
>;

export type InvoiceExtractorInput = {
  filename: string;
  mimeType: string;
  bytes: Uint8Array;
  manualExtraction?: unknown;
  languageHint?: "auto" | "en" | "ar" | "mixed";
  defaultCurrency?: string;
};

export interface SupplierInvoiceExtractor {
  readonly name: string;
  extract(input: InvoiceExtractorInput): Promise<NormalizedInvoiceExtraction>;
}

export class ManualSupplierInvoiceExtractor implements SupplierInvoiceExtractor {
  readonly name = "manual_structured_v1";

  async extract(input: InvoiceExtractorInput) {
    if (!input.manualExtraction) {
      throw new Error("Structured invoice details are required for manual extraction.");
    }
    return normalizeInvoiceExtraction(input.manualExtraction);
  }
}

const unitAliases: Record<string, SupplierInvoiceUnit> = {
  kg: "kg",
  kgs: "kg",
  kilogram: "kg",
  kilograms: "kg",
  g: "g",
  gram: "g",
  grams: "g",
  l: "l",
  litre: "l",
  litres: "l",
  liter: "l",
  liters: "l",
  ml: "ml",
  unit: "unit",
  units: "unit",
  each: "unit",
  ea: "unit",
  pc: "unit",
  pcs: "unit",
  piece: "unit",
  pieces: "unit",
  box: "box",
  boxes: "box",
  case: "case",
  cases: "case",
  pack: "pack",
  packs: "pack",
  packet: "pack",
  packets: "pack",
};

function compactWords(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function normalizeSupplierName(value: string) {
  return compactWords(value)
    .replace(/\b(limited liability company|limited|llc|l l c|ltd|co|company)\b/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function normalizeSupplierItemName(value: string) {
  return compactWords(value)
    .replace(/(\d)\s*(kg|g|ml|l)\b/g, "$1 $2")
    .trim();
}

export function normalizeInvoiceUnit(value: string): SupplierInvoiceUnit {
  const normalized = compactWords(value);
  const unit = unitAliases[normalized];
  if (!unit) throw new Error(`Unsupported invoice unit: ${value}`);
  return unit;
}

export function normalizeInvoiceExtraction(value: unknown): NormalizedInvoiceExtraction {
  const parsed = normalizedInvoiceExtractionSchema.parse(value);
  return {
    ...parsed,
    supplierName: parsed.supplierName.trim(),
    invoiceNumber: parsed.invoiceNumber?.trim() || null,
    taxIdentifier: parsed.taxIdentifier?.trim() || null,
    currency: parsed.currency.toUpperCase(),
    lineItems: parsed.lineItems.map((item) => ({
      ...item,
      rawDescription: item.rawDescription.trim(),
      unit: normalizeInvoiceUnit(item.unit),
    })),
  };
}

function tokenSimilarity(left: string, right: string) {
  const leftTokens = new Set(left.split(" ").filter(Boolean));
  const rightTokens = new Set(right.split(" ").filter(Boolean));
  const union = new Set([...leftTokens, ...rightTokens]);
  if (!union.size) return 0;
  const intersection = [...leftTokens].filter((token) => rightTokens.has(token));
  return intersection.length / union.size;
}

export type SupplierMatchCandidate = {
  id: string;
  name: string;
  normalizedName: string;
};

export type MatchDecision = {
  matchedId: string | null;
  confidence: number;
  requiresReview: boolean;
  reason: "exact" | "new" | "uncertain" | "unit_mismatch";
};

export function matchSupplier(
  supplierName: string,
  candidates: SupplierMatchCandidate[],
): MatchDecision {
  const normalized = normalizeSupplierName(supplierName);
  const exact = candidates.find((candidate) => candidate.normalizedName === normalized);
  if (exact) return { matchedId: exact.id, confidence: 1, requiresReview: false, reason: "exact" };

  const similar = candidates
    .map((candidate) => ({ candidate, score: tokenSimilarity(normalized, candidate.normalizedName) }))
    .sort((left, right) => right.score - left.score)[0];
  if (similar && similar.score >= 0.5) {
    return {
      matchedId: null,
      confidence: Number(similar.score.toFixed(4)),
      requiresReview: true,
      reason: "uncertain",
    };
  }
  return { matchedId: null, confidence: 1, requiresReview: false, reason: "new" };
}

export type SupplierItemMatchCandidate = {
  id: string;
  normalizedName: string;
  unit: SupplierInvoiceUnit;
};

export function matchSupplierItem(
  rawDescription: string,
  unit: SupplierInvoiceUnit,
  candidates: SupplierItemMatchCandidate[],
): MatchDecision {
  const normalized = normalizeSupplierItemName(rawDescription);
  const exact = candidates.find(
    (candidate) => candidate.normalizedName === normalized && candidate.unit === unit,
  );
  if (exact) return { matchedId: exact.id, confidence: 1, requiresReview: false, reason: "exact" };
  if (candidates.some((candidate) => candidate.normalizedName === normalized)) {
    return { matchedId: null, confidence: 0, requiresReview: true, reason: "unit_mismatch" };
  }
  const similar = candidates
    .filter((candidate) => candidate.unit === unit)
    .map((candidate) => ({ candidate, score: tokenSimilarity(normalized, candidate.normalizedName) }))
    .sort((left, right) => right.score - left.score)[0];
  if (similar && similar.score >= 0.65) {
    return {
      matchedId: null,
      confidence: Number(similar.score.toFixed(4)),
      requiresReview: true,
      reason: "uncertain",
    };
  }
  return { matchedId: null, confidence: 1, requiresReview: false, reason: "new" };
}

export type PriceComparison = {
  comparable: boolean;
  previousUnitPrice: number | null;
  absoluteChange: number | null;
  percentageChange: number | null;
  severity: "none" | "medium" | "high";
  anomaly: "price_increase" | "suspicious_price_decrease" | "unit_mismatch" | "currency_change" | null;
};

export function compareSupplierItemPrice(input: {
  currentUnitPrice: number;
  currentUnit: SupplierInvoiceUnit;
  currentCurrency: string;
  previousUnitPrice?: number | null;
  previousUnit?: SupplierInvoiceUnit | null;
  previousCurrency?: string | null;
}): PriceComparison {
  if (input.previousUnitPrice === null || input.previousUnitPrice === undefined) {
    return { comparable: false, previousUnitPrice: null, absoluteChange: null, percentageChange: null, severity: "none", anomaly: null };
  }
  if (input.previousUnit !== input.currentUnit) {
    return { comparable: false, previousUnitPrice: input.previousUnitPrice, absoluteChange: null, percentageChange: null, severity: "medium", anomaly: "unit_mismatch" };
  }
  if (input.previousCurrency !== input.currentCurrency) {
    return { comparable: false, previousUnitPrice: input.previousUnitPrice, absoluteChange: null, percentageChange: null, severity: "medium", anomaly: "currency_change" };
  }
  const absoluteChange = Number((input.currentUnitPrice - input.previousUnitPrice).toFixed(4));
  const percentageChange = input.previousUnitPrice === 0
    ? null
    : Number(((absoluteChange / input.previousUnitPrice) * 100).toFixed(2));
  if (percentageChange === null) {
    return { comparable: true, previousUnitPrice: input.previousUnitPrice, absoluteChange, percentageChange, severity: "none", anomaly: null };
  }
  if (
    percentageChange >= PRICE_CHANGE_THRESHOLDS.highIncreasePercent &&
    absoluteChange >= PRICE_CHANGE_THRESHOLDS.highIncreaseAbsolute
  ) {
    return { comparable: true, previousUnitPrice: input.previousUnitPrice, absoluteChange, percentageChange, severity: "high", anomaly: "price_increase" };
  }
  if (
    percentageChange >= PRICE_CHANGE_THRESHOLDS.meaningfulIncreasePercent &&
    absoluteChange >= PRICE_CHANGE_THRESHOLDS.minimumAbsolute
  ) {
    return { comparable: true, previousUnitPrice: input.previousUnitPrice, absoluteChange, percentageChange, severity: "medium", anomaly: "price_increase" };
  }
  if (
    percentageChange <= PRICE_CHANGE_THRESHOLDS.suspiciousDecreasePercent &&
    Math.abs(absoluteChange) >= PRICE_CHANGE_THRESHOLDS.suspiciousDecreaseAbsolute
  ) {
    return { comparable: true, previousUnitPrice: input.previousUnitPrice, absoluteChange, percentageChange, severity: "medium", anomaly: "suspicious_price_decrease" };
  }
  return { comparable: true, previousUnitPrice: input.previousUnitPrice, absoluteChange, percentageChange, severity: "none", anomaly: null };
}

export function detectInvoiceTotalAnomalies(invoice: NormalizedInvoiceExtraction) {
  const anomalies: string[] = [];
  for (const item of invoice.lineItems) {
    const calculated = item.quantity * item.unitPrice;
    const tolerance = Math.max(0.05, item.lineTotal * 0.02);
    if (Math.abs(calculated - item.lineTotal) > tolerance) anomalies.push("line_total_mismatch");
  }
  const expected = invoice.subtotal !== null && invoice.taxTotal !== null
    ? invoice.subtotal + invoice.taxTotal
    : invoice.lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalTolerance = Math.max(1, invoice.total * 0.01);
  if (Math.abs(expected - invoice.total) > totalTolerance) anomalies.push("invoice_total_mismatch");
  if (!invoice.invoiceNumber) anomalies.push("missing_invoice_number");
  if (invoice.confidence < 0.8) anomalies.push("low_extraction_confidence");
  return [...new Set(anomalies)];
}

export function validateInvoiceFile(file: Pick<File, "name" | "size" | "type">) {
  if (!file.name || file.size <= 0) throw new Error("Select a non-empty invoice file.");
  if (file.size > MAX_INVOICE_FILE_BYTES) throw new Error("Invoice files must be 10 MB or smaller.");
  if (!SUPPORTED_INVOICE_MIME_TYPES.has(file.type)) {
    throw new Error("Invoice files must be PDF, JPEG, PNG, or WebP.");
  }
}

export function parseManualInvoiceItems(value: string) {
  const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines.map((line, index) => {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length !== 5 && parts.length !== 6) {
      throw new Error(`Invoice line ${index + 1} must contain description, quantity, unit, unit price, and line total.`);
    }
    return {
      rawDescription: parts[0],
      quantity: Number(parts[1]),
      unit: parts[2],
      unitPrice: Number(parts[3]),
      lineTotal: Number(parts[4]),
      extractionConfidence: parts[5] === undefined ? 1 : Number(parts[5]),
    };
  });
}
