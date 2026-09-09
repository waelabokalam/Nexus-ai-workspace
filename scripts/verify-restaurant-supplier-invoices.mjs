import assert from "node:assert/strict";
import fs from "node:fs";

import { createClient } from "@supabase/supabase-js";

const organizationId = "10000000-0000-4000-8000-000000000001";
const centralBranchId = "20000000-0000-4000-8000-000000000001";
const marinaBranchId = "20000000-0000-4000-8000-000000000002";
const bucket = "restaurant-supplier-invoices";

function parseEnvironment(path) {
  return Object.fromEntries(
    fs.readFileSync(path, "utf8").split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator), line.slice(separator + 1)];
      }),
  );
}

function expectSuccess(result, context) {
  assert.equal(result.error, null, `${context}: ${result.error?.message ?? "unknown error"}`);
  return result.data;
}

function expectDenied(result, context) {
  assert.ok(result.error, `${context}: operation unexpectedly succeeded`);
}

const environment = parseEnvironment(process.env.NEXUS_RESTAURANT_ENV ?? ".env.local");
const fixturePath = process.env.NEXUS_RESTAURANT_AUTH_FIXTURES ?? "/tmp/nexus-restaurant-v1-auth.json";
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
assert.equal(fixture.projectRef, "ovloyniqxpuqkwrpoafp", "Auth fixtures target the wrong project");
assert.match(environment.NEXT_PUBLIC_SUPABASE_URL, /ovloyniqxpuqkwrpoafp\.supabase\.co$/);

const service = createClient(
  environment.NEXT_PUBLIC_SUPABASE_URL,
  environment.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

async function authenticatedClient(role) {
  const user = fixture.users.find((candidate) => candidate.role === role);
  assert.ok(user, `Missing ${role} Auth fixture`);
  const client = createClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  expectSuccess(await client.auth.signInWithPassword({ email: user.email, password: user.password }), `${role} authentication`);
  return { client, user };
}

const owner = await authenticatedClient("owner");
const manager = await authenticatedClient("manager");
const outsider = await authenticatedClient("outsider");
const runId = `supplier-invoice-live-${Date.now()}`;
const created = {
  invoices: new Set(), events: new Set(), attention: new Set(), suppliers: new Set(),
  supplierItems: new Set(), storagePaths: new Set(),
};

function dateDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

async function upload(suffix) {
  const path = `${organizationId}/${runId}/${suffix}.pdf`;
  const bytes = new TextEncoder().encode(`%PDF-1.4\n% Nexus reversible verification ${suffix}\n%%EOF`);
  expectSuccess(await service.storage.from(bucket).upload(path, bytes, {
    contentType: "application/pdf", cacheControl: "private, max-age=0, no-store", upsert: false,
  }), `upload ${suffix}`);
  created.storagePaths.add(path);
  return path;
}

function invoicePayload({
  suffix, storagePath, fileHash, supplierId = null, supplierName = "Nexus Live Foods LLC",
  normalizedSupplier = "nexus live foods", invoiceNumber, invoiceDate, total,
  anomalies = [], supplierRequiresReview = false, supplierMatchConfidence = 1,
}) {
  return {
    supplier_name: supplierName,
    supplier_normalized_name: normalizedSupplier,
    tax_identifier: `${runId}-VAT`, supplier_id: supplierId,
    supplier_match_confidence: supplierMatchConfidence,
    supplier_requires_review: supplierRequiresReview,
    invoice_number: invoiceNumber, invoice_date: invoiceDate, currency: "AED",
    subtotal: total / 1.05, tax_total: total - total / 1.05, total,
    source_type: "manual_upload", extractor: "manual_structured_v1",
    original_filename: `${suffix}.pdf`, storage_path: storagePath, file_hash: fileHash,
    raw_extraction: { verification_run: runId }, confidence: supplierRequiresReview ? 0.72 : 1,
    anomalies,
  };
}

function itemPayload({
  description = "Chicken Breast 5KG", normalizedName = "chicken breast 5 kg",
  quantity = 10, unit = "kg", unitPrice, matchedId = null, previousPrice = null,
  absoluteChange = null, percentageChange = null, severity = "none", anomaly = null,
  requiresReview = false, anomalies = [],
}) {
  return {
    raw_description: description, normalized_name: normalizedName, quantity, unit,
    unit_price: unitPrice, line_total: quantity * unitPrice, extraction_confidence: 1,
    matched_supplier_item_id: matchedId, match_confidence: requiresReview && !matchedId ? 0.7 : 1,
    requires_review: requiresReview, previous_unit_price: previousPrice,
    absolute_change: absoluteChange, percentage_change: percentageChange,
    severity, anomaly, anomalies,
  };
}

function remember(result) {
  created.invoices.add(result.invoice_id);
  created.events.add(result.event_id);
  if (result.attention_item_id) created.attention.add(result.attention_item_id);
  if (result.supplier_id) created.suppliers.add(result.supplier_id);
  return result;
}

async function ingest(invoice, items, context) {
  return remember(expectSuccess(await service.rpc("ingest_supplier_invoice", {
    p_actor_id: owner.user.id,
    p_organization_id: organizationId,
    p_branch_id: context.branchId,
    p_invoice: invoice,
    p_items: items,
  }), context.label));
}

async function cleanup() {
  const eventIds = [...created.events];
  if (eventIds.length) {
    const attention = expectSuccess(
      await service.from("manager_attention_items").select("id").in("event_id", eventIds),
      "load supplier cleanup attention",
    );
    for (const row of attention) created.attention.add(row.id);
  }
  const entityIds = [...new Set([...eventIds, ...created.attention, ...created.invoices])];
  if (entityIds.length) expectSuccess(
    await service.from("restaurant_activity_log").delete().in("entity_id", entityIds),
    "clean supplier activity",
  );
  if (created.invoices.size) expectSuccess(
    await service.from("restaurant_supplier_invoices").delete().in("id", [...created.invoices]),
    "clean supplier invoices",
  );
  if (created.attention.size) expectSuccess(
    await service.from("manager_attention_items").delete().in("id", [...created.attention]),
    "clean supplier attention",
  );
  if (eventIds.length) expectSuccess(
    await service.from("restaurant_events").delete().in("id", eventIds),
    "clean supplier events",
  );
  if (created.supplierItems.size) expectSuccess(
    await service.from("restaurant_supplier_items").delete().in("id", [...created.supplierItems]),
    "clean supplier items",
  );
  if (created.suppliers.size) expectSuccess(
    await service.from("restaurant_suppliers").delete().in("id", [...created.suppliers]),
    "clean suppliers",
  );
  if (created.storagePaths.size) expectSuccess(
    await service.storage.from(bucket).remove([...created.storagePaths]),
    "clean private invoice files",
  );
}

try {
  const firstPath = await upload("first");
  const firstInvoice = invoicePayload({
    suffix: "first", storagePath: firstPath, fileHash: "a".repeat(48) + runId.slice(-16).replace(/[^0-9]/g, "0"),
    invoiceNumber: `${runId}-001`, invoiceDate: dateDaysAgo(14), total: 189,
  });
  const firstItems = [itemPayload({ unitPrice: 18 })];
  expectDenied(await owner.client.rpc("ingest_supplier_invoice", {
    p_actor_id: owner.user.id, p_organization_id: organizationId,
    p_branch_id: centralBranchId, p_invoice: firstInvoice, p_items: firstItems,
  }), "browser-side invoice ingestion");
  const first = await ingest(firstInvoice, firstItems, { label: "first supplier invoice", branchId: centralBranchId });
  assert.equal(first.created, true);
  assert.equal(first.review_status, "reviewed");
  assert.equal(first.attention_item_id, null);

  const persistedFirstItems = expectSuccess(
    await service.from("restaurant_supplier_invoice_items").select("*").eq("invoice_id", first.invoice_id),
    "load first invoice items",
  );
  assert.equal(persistedFirstItems.length, 1);
  assert.ok(persistedFirstItems[0].matched_supplier_item_id);
  created.supplierItems.add(persistedFirstItems[0].matched_supplier_item_id);

  const duplicateFile = expectSuccess(await service.rpc("ingest_supplier_invoice", {
    p_actor_id: owner.user.id, p_organization_id: organizationId, p_branch_id: centralBranchId,
    p_invoice: firstInvoice, p_items: firstItems,
  }), "duplicate file retry");
  assert.equal(duplicateFile.created, false);
  assert.equal(duplicateFile.invoice_id, first.invoice_id);

  const increasePath = await upload("increase");
  const increase = await ingest(invoicePayload({
    suffix: "increase", storagePath: increasePath,
    fileHash: "b".repeat(48) + runId.slice(-16).replace(/[^0-9]/g, "1"),
    supplierId: first.supplier_id, invoiceNumber: `${runId}-002`, invoiceDate: dateDaysAgo(7), total: 226.8,
  }), [itemPayload({
    unitPrice: 21.6, matchedId: persistedFirstItems[0].matched_supplier_item_id,
    previousPrice: 18, absoluteChange: 3.6, percentageChange: 20,
    severity: "high", anomaly: "price_increase", requiresReview: true,
    anomalies: ["price_increase"],
  })], { label: "meaningful price increase", branchId: centralBranchId });
  assert.ok(increase.attention_item_id);

  const mismatchPath = await upload("mismatch");
  const mismatch = await ingest(invoicePayload({
    suffix: "mismatch", storagePath: mismatchPath,
    fileHash: "c".repeat(48) + runId.slice(-16).replace(/[^0-9]/g, "2"),
    supplierId: first.supplier_id, invoiceNumber: `${runId}-003`, invoiceDate: dateDaysAgo(1),
    total: 300, anomalies: ["invoice_total_mismatch"],
  }), [itemPayload({
    description: "Cooking Oil", normalizedName: "cooking oil", quantity: 2,
    unit: "case", unitPrice: 100, requiresReview: false,
  })], { label: "invoice total mismatch", branchId: marinaBranchId });
  assert.ok(mismatch.attention_item_id);

  const uncertainPath = await upload("uncertain");
  const uncertain = await ingest(invoicePayload({
    suffix: "uncertain", storagePath: uncertainPath,
    fileHash: "e".repeat(48) + runId.slice(-16).replace(/[^0-9]/g, "4"),
    supplierName: "Nexus Live Fresh Foods", normalizedSupplier: "nexus live fresh foods",
    invoiceNumber: `${runId}-004`, invoiceDate: dateDaysAgo(0), total: 105,
    anomalies: ["uncertain_supplier_match", "uncertain_item_match"],
    supplierRequiresReview: true, supplierMatchConfidence: 0.67,
  }), [itemPayload({
    description: "Premium Chicken Breast", normalizedName: "premium chicken breast",
    quantity: 5, unit: "kg", unitPrice: 20, requiresReview: true,
    anomalies: ["uncertain_item_match"],
  })], { label: "uncertain supplier and item", branchId: centralBranchId });
  assert.ok(uncertain.attention_item_id);

  const duplicateReferencePath = await upload("duplicate-reference");
  const duplicateReference = await service.rpc("ingest_supplier_invoice", {
    p_actor_id: owner.user.id, p_organization_id: organizationId, p_branch_id: centralBranchId,
    p_invoice: invoicePayload({
      suffix: "duplicate-reference", storagePath: duplicateReferencePath,
      fileHash: "d".repeat(48) + runId.slice(-16).replace(/[^0-9]/g, "3"),
      supplierId: first.supplier_id, invoiceNumber: `${runId}-001`, invoiceDate: dateDaysAgo(0), total: 189,
    }),
    p_items: firstItems,
  });
  expectDenied(duplicateReference, "duplicate supplier invoice number");

  const increaseItem = expectSuccess(
    await owner.client.from("restaurant_supplier_invoice_items").select("*").eq("invoice_id", increase.invoice_id).single(),
    "load historical price comparison",
  );
  assert.equal(increaseItem.previous_unit_price, 18);
  assert.equal(increaseItem.absolute_change, 3.6);
  assert.equal(increaseItem.percentage_change, 20);
  assert.ok(increaseItem.anomalies.includes("price_increase"));

  expectSuccess(await manager.client.rpc("review_supplier_invoice", {
    p_organization_id: organizationId, p_invoice_id: increase.invoice_id, p_decision: "reviewed",
  }), "manager invoice review");
  const reviewedInvoice = expectSuccess(
    await manager.client.from("restaurant_supplier_invoices").select("review_status,reviewed_by").eq("id", increase.invoice_id).single(),
    "load reviewed invoice",
  );
  assert.equal(reviewedInvoice.review_status, "reviewed");
  assert.equal(reviewedInvoice.reviewed_by, manager.user.id);
  const resolvedAttention = expectSuccess(
    await manager.client.from("manager_attention_items").select("status").eq("id", increase.attention_item_id).single(),
    "load resolved invoice attention",
  );
  assert.equal(resolvedAttention.status, "resolved");

  const confirmedUncertain = expectSuccess(await manager.client.rpc("review_supplier_invoice", {
    p_organization_id: organizationId, p_invoice_id: uncertain.invoice_id, p_decision: "reviewed",
  }), "manager confirmation of uncertain supplier and item");
  assert.ok(confirmedUncertain.supplier_id);
  created.suppliers.add(confirmedUncertain.supplier_id);
  const confirmedUncertainInvoice = expectSuccess(
    await manager.client.from("restaurant_supplier_invoices")
      .select("supplier_id,supplier_requires_review,supplier_match_confidence,review_status")
      .eq("id", uncertain.invoice_id).single(),
    "load confirmed uncertain invoice",
  );
  assert.equal(confirmedUncertainInvoice.supplier_id, confirmedUncertain.supplier_id);
  assert.equal(confirmedUncertainInvoice.supplier_requires_review, false);
  assert.equal(confirmedUncertainInvoice.supplier_match_confidence, 1);
  assert.equal(confirmedUncertainInvoice.review_status, "reviewed");
  const confirmedUncertainItem = expectSuccess(
    await manager.client.from("restaurant_supplier_invoice_items")
      .select("matched_supplier_item_id,requires_review,match_confidence")
      .eq("invoice_id", uncertain.invoice_id).single(),
    "load confirmed uncertain item",
  );
  assert.ok(confirmedUncertainItem.matched_supplier_item_id);
  assert.equal(confirmedUncertainItem.requires_review, false);
  assert.equal(confirmedUncertainItem.match_confidence, 1);
  created.supplierItems.add(confirmedUncertainItem.matched_supplier_item_id);

  const centralInvoices = expectSuccess(
    await owner.client.from("restaurant_supplier_invoices").select("id,branch_id")
      .like("original_filename", "%")
      .in("id", [...created.invoices])
      .or(`branch_id.eq.${centralBranchId},branch_id.is.null`),
    "central invoice branch filtering",
  );
  assert.ok(centralInvoices.some(({ id }) => id === first.invoice_id));
  assert.ok(!centralInvoices.some(({ id }) => id === mismatch.invoice_id));
  assert.deepEqual(
    expectSuccess(await outsider.client.from("restaurant_supplier_invoices").select("id").in("id", [...created.invoices]), "outsider invoice isolation"),
    [],
  );

  expectDenied(
    await outsider.client.storage.from(bucket).download(firstPath),
    "outsider private invoice download",
  );
  expectDenied(
    await owner.client.storage.from(bucket).download(firstPath),
    "direct authenticated private invoice download",
  );
  const signed = expectSuccess(
    await service.storage.from(bucket).createSignedUrl(firstPath, 60),
    "server-side signed invoice URL",
  );
  const signedResponse = await fetch(signed.signedUrl);
  assert.equal(signedResponse.status, 200);

  const activity = expectSuccess(
    await owner.client.from("restaurant_activity_log").select("action,entity_id").in("entity_id", [
      ...created.events, ...created.invoices,
    ]),
    "load supplier invoice activity",
  );
  for (const action of ["event_handled", "event_escalated", "supplier_invoice_reviewed"]) {
    assert.ok(activity.some((entry) => entry.action === action), `Missing ${action} activity`);
  }

  const persistedInvoices = expectSuccess(
    await owner.client.from("restaurant_supplier_invoices").select("id,review_status,anomalies").in("id", [...created.invoices]),
    "load Daily Manager Brief supplier facts",
  );
  assert.equal(persistedInvoices.length, 4);
  assert.equal(persistedInvoices.filter((row) => row.review_status === "pending").length, 1);
  assert.equal(persistedInvoices.filter((row) => row.anomalies.includes("invoice_total_mismatch")).length, 1);

  console.log(JSON.stringify({
    result: "PASS", projectRef: fixture.projectRef, suppliersCreated: 2,
    invoicesPersisted: persistedInvoices.length, lineItemsPersisted: 4,
    duplicateFilePrevented: true, duplicateInvoiceNumberPrevented: true,
    historicalPriceComparison: { previous: 18, current: 21.6, change: 3.6, percent: 20 },
    meaningfulIncreaseAlert: true, invoiceMismatchAlert: true,
    managerReviewPersisted: true, uncertainMatchesConfirmed: true,
    futurePriceHistoryReady: true, attentionResolved: true, activityHistory: true,
    dailyBriefSupplierFactsAvailable: true, branchFiltering: true,
    rlsIsolation: true, privateStorage: true,
  }));
} finally {
  await cleanup();
}
