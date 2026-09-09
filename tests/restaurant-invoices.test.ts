import { describe, expect, it } from "vitest";

import {
  compareSupplierItemPrice,
  detectInvoiceTotalAnomalies,
  matchSupplier,
  matchSupplierItem,
  normalizeInvoiceExtraction,
  normalizeSupplierItemName,
  normalizeSupplierName,
  parseManualInvoiceItems,
  validateInvoiceFile,
} from "@/lib/restaurant/invoices";
import { calculateDailyManagerBrief } from "@/lib/restaurant/summary";
import type {
  ManagerAttentionItemRow,
  RestaurantEventRow,
  RestaurantSupplierInvoiceItemRow,
  RestaurantSupplierInvoiceRow,
} from "@/lib/supabase/database.types";

const organizationId = "10000000-0000-4000-8000-000000000001";
const branchId = "20000000-0000-4000-8000-000000000001";

function extraction(overrides: Record<string, unknown> = {}) {
  return normalizeInvoiceExtraction({
    supplierName: "ABC Foods L.L.C.",
    invoiceNumber: "INV-1002",
    invoiceDate: "2026-09-09",
    currency: "aed",
    subtotal: 180,
    taxTotal: 9,
    total: 189,
    confidence: 0.96,
    lineItems: [{
      rawDescription: "Chicken Breast 5KG",
      quantity: 10,
      unit: "kilograms",
      unitPrice: 18,
      lineTotal: 180,
      extractionConfidence: 0.98,
    }],
    ...overrides,
  });
}

function invoice(overrides: Partial<RestaurantSupplierInvoiceRow> = {}): RestaurantSupplierInvoiceRow {
  return {
    id: crypto.randomUUID(), organization_id: organizationId, branch_id: branchId,
    supplier_id: crypto.randomUUID(), event_id: crypto.randomUUID(), supplier_name: "ABC Foods",
    supplier_normalized_name: "abc foods", invoice_number: "INV-1002", invoice_date: "2026-09-09",
    currency: "AED", subtotal: 200, tax_total: 10, total: 210,
    extraction_status: "processed", review_status: "pending", source_type: "manual_upload",
    extractor: "manual_structured_v1", original_filename: "invoice.pdf",
    storage_path: `${organizationId}/invoice.pdf`, file_hash: "a".repeat(64), raw_extraction: {},
    confidence: 1, supplier_match_confidence: 1, supplier_requires_review: false,
    anomalies: [], reviewed_at: null, reviewed_by: null,
    created_at: "2026-09-09T08:00:00.000Z", updated_at: "2026-09-09T08:00:00.000Z",
    ...overrides,
  };
}

function invoiceItem(
  invoiceId: string,
  overrides: Partial<RestaurantSupplierInvoiceItemRow> = {},
): RestaurantSupplierInvoiceItemRow {
  return {
    id: crypto.randomUUID(), organization_id: organizationId, invoice_id: invoiceId,
    matched_supplier_item_id: crypto.randomUUID(), raw_description: "Chicken Breast 5KG",
    normalized_name: "chicken breast 5 kg", quantity: 10, unit: "kg", unit_price: 21.6,
    line_total: 216, extraction_confidence: 1, match_confidence: 1, requires_review: true,
    previous_unit_price: 18, absolute_change: 3.6, percentage_change: 20,
    anomalies: ["price_increase"], created_at: "2026-09-09T08:00:00.000Z",
    ...overrides,
  };
}

describe("supplier invoice validation and normalization", () => {
  it("validates and normalizes a complete invoice", () => {
    const value = extraction();
    expect(value.currency).toBe("AED");
    expect(value.lineItems[0].unit).toBe("kg");
  });

  it.each([
    { total: 0 },
    { total: Number.NaN },
    { invoiceDate: "09/09/2026" },
    { currency: "$" },
  ])("rejects malformed invoice values: %o", (override) => {
    expect(() => extraction(override)).toThrow();
  });

  it("rejects invalid quantities, prices, and unsupported units", () => {
    expect(() => extraction({ lineItems: [{ rawDescription: "Oil", quantity: -1, unit: "case", unitPrice: 20, lineTotal: 20, extractionConfidence: 1 }] })).toThrow();
    expect(() => extraction({ lineItems: [{ rawDescription: "Oil", quantity: 1, unit: "case", unitPrice: -20, lineTotal: 20, extractionConfidence: 1 }] })).toThrow();
    expect(() => extraction({ lineItems: [{ rawDescription: "Oil", quantity: 1, unit: "pallet", unitPrice: 20, lineTotal: 20, extractionConfidence: 1 }] })).toThrow("Unsupported invoice unit");
  });

  it("enforces private-upload file type and size boundaries", () => {
    expect(() => validateInvoiceFile({ name: "invoice.pdf", size: 1_000, type: "application/pdf" })).not.toThrow();
    expect(() => validateInvoiceFile({ name: "invoice.svg", size: 1_000, type: "image/svg+xml" })).toThrow();
    expect(() => validateInvoiceFile({ name: "huge.pdf", size: 11 * 1024 * 1024, type: "application/pdf" })).toThrow();
  });

  it("parses the deterministic manual extraction format", () => {
    expect(parseManualInvoiceItems("Cooking Oil | 4 | case | 92 | 368")).toEqual([{
      rawDescription: "Cooking Oil", quantity: 4, unit: "case", unitPrice: 92,
      lineTotal: 368, extractionConfidence: 1,
    }]);
    expect(() => parseManualInvoiceItems("Cooking Oil, 4 cases")).toThrow();
  });
});

describe("conservative supplier and item matching", () => {
  it("normalizes deterministic legal-suffix and packaging variants", () => {
    expect(normalizeSupplierName("ABC Foods LLC")).toBe(normalizeSupplierName("ABC Foods L.L.C."));
    expect(normalizeSupplierItemName("Chicken Breast 5KG")).toBe(normalizeSupplierItemName("Chicken Breast - 5 kg"));
  });

  it("automatically matches only exact normalized suppliers", () => {
    const exact = matchSupplier("ABC Foods L.L.C.", [{ id: "supplier-1", name: "ABC Foods", normalizedName: "abc foods" }]);
    expect(exact).toMatchObject({ matchedId: "supplier-1", confidence: 1, requiresReview: false, reason: "exact" });
    const uncertain = matchSupplier("ABC Fresh Foods", [{ id: "supplier-1", name: "ABC Foods", normalizedName: "abc foods" }]);
    expect(uncertain).toMatchObject({ matchedId: null, requiresReview: true, reason: "uncertain" });
  });

  it("does not silently merge uncertain items or mismatched units", () => {
    const candidates = [{ id: "item-1", normalizedName: "chicken breast 5 kg", unit: "kg" as const }];
    expect(matchSupplierItem("Chicken Breast - 5 kg", "kg", candidates)).toMatchObject({ matchedId: "item-1", reason: "exact" });
    expect(matchSupplierItem("Chicken Breast 5KG", "box", candidates)).toMatchObject({ matchedId: null, requiresReview: true, reason: "unit_mismatch" });
    expect(matchSupplierItem("Fresh Chicken Breast 5KG", "kg", candidates)).toMatchObject({ matchedId: null, requiresReview: true, reason: "uncertain" });
  });

  it("treats genuinely new suppliers and items as new records", () => {
    expect(matchSupplier("New Market Foods", [])).toMatchObject({ reason: "new", requiresReview: false });
    expect(matchSupplierItem("Mozzarella 2KG", "kg", [])).toMatchObject({ reason: "new", requiresReview: false });
  });
});

describe("cost comparison and anomaly detection", () => {
  it("calculates absolute and percentage price changes", () => {
    expect(compareSupplierItemPrice({ currentUnitPrice: 21.6, currentUnit: "kg", currentCurrency: "AED", previousUnitPrice: 18, previousUnit: "kg", previousCurrency: "AED" })).toMatchObject({
      comparable: true, previousUnitPrice: 18, absoluteChange: 3.6, percentageChange: 20,
      severity: "high", anomaly: "price_increase",
    });
  });

  it("ignores small rounding changes but flags meaningful increases", () => {
    expect(compareSupplierItemPrice({ currentUnitPrice: 18.2, currentUnit: "kg", currentCurrency: "AED", previousUnitPrice: 18, previousUnit: "kg", previousCurrency: "AED" }).anomaly).toBeNull();
    expect(compareSupplierItemPrice({ currentUnitPrice: 20, currentUnit: "kg", currentCurrency: "AED", previousUnitPrice: 18, previousUnit: "kg", previousCurrency: "AED" })).toMatchObject({ severity: "medium", anomaly: "price_increase" });
  });

  it("does not compare incompatible units or currencies", () => {
    expect(compareSupplierItemPrice({ currentUnitPrice: 50, currentUnit: "box", currentCurrency: "AED", previousUnitPrice: 18, previousUnit: "kg", previousCurrency: "AED" })).toMatchObject({ comparable: false, anomaly: "unit_mismatch" });
    expect(compareSupplierItemPrice({ currentUnitPrice: 18, currentUnit: "kg", currentCurrency: "USD", previousUnitPrice: 18, previousUnit: "kg", previousCurrency: "AED" })).toMatchObject({ comparable: false, anomaly: "currency_change" });
  });

  it("flags suspicious large decreases", () => {
    expect(compareSupplierItemPrice({ currentUnitPrice: 70, currentUnit: "case", currentCurrency: "AED", previousUnitPrice: 100, previousUnit: "case", previousCurrency: "AED" })).toMatchObject({ percentageChange: -30, severity: "medium", anomaly: "suspicious_price_decrease" });
  });

  it("detects line and invoice total mismatches without correcting them", () => {
    const value = extraction({
      subtotal: null,
      taxTotal: null,
      total: 250,
      lineItems: [{ rawDescription: "Oil", quantity: 2, unit: "case", unitPrice: 90, lineTotal: 200, extractionConfidence: 1 }],
    });
    expect(detectInvoiceTotalAnomalies(value)).toEqual(expect.arrayContaining(["line_total_mismatch", "invoice_total_mismatch"]));
  });
});

describe("Daily Manager Brief supplier-cost facts", () => {
  it("surfaces review volume, total mismatches, and material price increases", () => {
    const currentInvoice = invoice({ anomalies: ["invoice_total_mismatch"] });
    const event: RestaurantEventRow = {
      id: currentInvoice.event_id, organization_id: organizationId, branch_id: branchId,
      created_at: currentInvoice.created_at, occurred_at: currentInvoice.created_at,
      source: "supplier_invoice", event_type: "supplier_invoice_anomaly", category: "operations",
      title: "Supplier invoice needs review", summary: "Invoice mismatch", severity: "high",
      handling_mode: "human", status: "escalated", source_reference: currentInvoice.file_hash,
      subject_type: "supplier_invoice", subject_id: currentInvoice.id, structured_data: {},
      confidence: 1, requires_attention: true, dedupe_key: `supplier_invoice:${currentInvoice.file_hash}`,
      updated_at: currentInvoice.updated_at,
    };
    const attention: ManagerAttentionItemRow = {
      id: crypto.randomUUID(), organization_id: organizationId, branch_id: branchId,
      event_id: event.id, title: event.title, summary: event.summary, priority: "high",
      category: "operations", status: "open", assigned_to: null, due_at: null,
      created_at: event.created_at, resolved_at: null, updated_at: event.updated_at,
    };
    const brief = calculateDailyManagerBrief({
      organizationId, generatedForDate: "2026-09-09", startsAt: "2026-09-09T00:00:00.000Z",
      endsAt: "2026-09-10T00:00:00.000Z", branchId: null,
      branches: [{ id: branchId, name: "Central" }], events: [event], attentionItems: [attention],
      approvals: [], activity: [], reviews: [], invoices: [currentInvoice],
      invoiceItems: [invoiceItem(currentInvoice.id)],
    });
    expect(brief).toMatchObject({ supplierInvoiceReviewCount: 1, supplierInvoiceMismatchCount: 1, materialSupplierIncreaseCount: 1 });
    expect(brief.priorityItems.map((item) => item.kind)).toEqual(expect.arrayContaining([
      "supplier_invoices_need_review", "supplier_price_increases", "supplier_invoice_mismatches",
    ]));
  });
});
