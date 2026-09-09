import "server-only";

import { createHash, randomUUID } from "node:crypto";

import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { requireRestaurantAccess } from "@/lib/restaurant/auth";
import {
  filterRestaurantBranch,
  throwRestaurantDatabaseError,
} from "@/lib/restaurant/core/data-access";
import {
  compareSupplierItemPrice,
  detectInvoiceTotalAnomalies,
  ManualSupplierInvoiceExtractor,
  matchSupplier,
  matchSupplierItem,
  normalizeInvoiceUnit,
  normalizeSupplierItemName,
  normalizeSupplierName,
  SUPPLIER_INVOICE_BUCKET,
  type NormalizedInvoiceExtraction,
  type SupplierInvoiceExtractor,
  validateInvoiceFile,
} from "@/lib/restaurant/invoices";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Database,
  Json,
  RestaurantSupplierInvoiceItemRow,
  RestaurantSupplierInvoiceRow,
} from "@/lib/supabase/database.types";

const processInvoiceSchema = z.object({
  organizationId: z.uuid(),
  branchId: z.uuid().nullable().optional().default(null),
  file: z.custom<File>((value) => value instanceof File, "An invoice file is required."),
  manualExtraction: z.unknown().optional(),
  languageHint: z.enum(["auto", "en", "ar", "mixed"]).optional().default("auto"),
  defaultCurrency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/).optional(),
});

const reviewInvoiceSchema = z.object({
  organizationId: z.uuid(),
  invoiceId: z.uuid(),
  decision: z.enum(["reviewed", "dismissed"]),
});

function jsonValue(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}

function safeFilename(value: string) {
  const normalized = value.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-");
  return normalized.slice(-180) || "invoice";
}

function itemLineMismatch(item: NormalizedInvoiceExtraction["lineItems"][number]) {
  const expected = item.quantity * item.unitPrice;
  return Math.abs(expected - item.lineTotal) > Math.max(0.05, item.lineTotal * 0.02);
}

export async function processSupplierInvoice(
  value: unknown,
  options?: {
    user?: SupabaseClient<Database>;
    service?: SupabaseClient<Database>;
    extractor?: SupplierInvoiceExtractor;
  },
) {
  const input = processInvoiceSchema.parse(value);
  validateInvoiceFile(input.file);
  const userDatabase = options?.user ?? (await createSupabaseServerClient());
  const { user } = await requireRestaurantAccess(
    input.organizationId,
    ["owner", "manager"],
    userDatabase,
  );
  if (input.branchId) {
    const { data: branch, error } = await userDatabase
      .from("restaurant_branches")
      .select("id")
      .eq("id", input.branchId)
      .eq("organization_id", input.organizationId)
      .eq("is_active", true)
      .maybeSingle();
    throwRestaurantDatabaseError("Could not validate invoice branch", error);
    if (!branch) throw new Error("The selected invoice branch is not active in this restaurant.");
  }

  const bytes = new Uint8Array(await input.file.arrayBuffer());
  const fileHash = createHash("sha256").update(bytes).digest("hex");
  const { data: existing, error: existingError } = await userDatabase
    .from("restaurant_supplier_invoices")
    .select("id, event_id, supplier_id, review_status")
    .eq("organization_id", input.organizationId)
    .eq("file_hash", fileHash)
    .maybeSingle();
  throwRestaurantDatabaseError("Could not check invoice duplicate", existingError);
  if (existing) return { ...existing, created: false };

  const service = options?.service ?? createSupabaseServiceRoleClient();
  const storagePath = `${input.organizationId}/${randomUUID()}/${safeFilename(input.file.name)}`;
  const uploaded = await service.storage
    .from(SUPPLIER_INVOICE_BUCKET)
    .upload(storagePath, bytes, {
      contentType: input.file.type,
      upsert: false,
      cacheControl: "private, max-age=0, no-store",
    });
  throwRestaurantDatabaseError("Could not upload the private invoice file", uploaded.error);

  try {
    const extractor = options?.extractor ?? new ManualSupplierInvoiceExtractor();
    const extraction = await extractor.extract({
      filename: input.file.name,
      mimeType: input.file.type,
      bytes,
      manualExtraction: input.manualExtraction,
      languageHint: input.languageHint,
      defaultCurrency: input.defaultCurrency,
    });
    const { data: suppliers, error: suppliersError } = await service
      .from("restaurant_suppliers")
      .select("*")
      .eq("organization_id", input.organizationId);
    throwRestaurantDatabaseError("Could not load suppliers for matching", suppliersError);
    const supplierMatch = matchSupplier(
      extraction.supplierName,
      (suppliers ?? []).map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
        normalizedName: supplier.normalized_name,
      })),
    );

    const supplierId = supplierMatch.matchedId;
    const { data: supplierItems, error: supplierItemsError } = supplierId
      ? await service
          .from("restaurant_supplier_items")
          .select("*")
          .eq("organization_id", input.organizationId)
          .eq("supplier_id", supplierId)
      : { data: [], error: null };
    throwRestaurantDatabaseError("Could not load supplier items for matching", supplierItemsError);
    const itemCandidates = (supplierItems ?? []).map((item) => ({
      id: item.id,
      normalizedName: item.normalized_name,
      unit: normalizeInvoiceUnit(item.unit),
    }));
    const candidateIds = itemCandidates.map((item) => item.id);
    const { data: historicalItems, error: historyItemsError } = candidateIds.length
      ? await service
          .from("restaurant_supplier_invoice_items")
          .select("*")
          .eq("organization_id", input.organizationId)
          .in("matched_supplier_item_id", candidateIds)
          .order("created_at", { ascending: false })
          .limit(500)
      : { data: [], error: null };
    throwRestaurantDatabaseError("Could not load supplier price history", historyItemsError);
    const historicalInvoiceIds = Array.from(
      new Set((historicalItems ?? []).map((item) => item.invoice_id)),
    );
    const { data: historicalInvoices, error: historyInvoicesError } = historicalInvoiceIds.length
      ? await service
          .from("restaurant_supplier_invoices")
          .select("*")
          .eq("organization_id", input.organizationId)
          .eq("review_status", "reviewed")
          .in("id", historicalInvoiceIds)
      : { data: [], error: null };
    throwRestaurantDatabaseError("Could not load historical invoices", historyInvoicesError);
    const invoiceById = new Map(
      (historicalInvoices ?? []).map((invoice) => [invoice.id, invoice]),
    );

    const invoiceAnomalies = detectInvoiceTotalAnomalies(extraction);
    if (supplierMatch.requiresReview) invoiceAnomalies.push("uncertain_supplier_match");
    const latestSupplierInvoice = (historicalInvoices ?? [])
      .filter((invoice) => invoice.supplier_id === supplierId && invoice.invoice_date < extraction.invoiceDate)
      .sort((left, right) => right.invoice_date.localeCompare(left.invoice_date))[0];
    if (latestSupplierInvoice && latestSupplierInvoice.currency !== extraction.currency) {
      invoiceAnomalies.push("currency_change");
    }

    const itemPayload = extraction.lineItems.map((item) => {
      const unit = normalizeInvoiceUnit(item.unit);
      const normalizedName = normalizeSupplierItemName(item.rawDescription);
      const itemMatch = matchSupplierItem(item.rawDescription, unit, itemCandidates);
      const comparisonItemId = itemMatch.matchedId ?? itemCandidates.find(
        (candidate) => candidate.normalizedName === normalizedName,
      )?.id ?? null;
      const history = (historicalItems ?? [])
        .filter((row) => row.matched_supplier_item_id === comparisonItemId)
        .map((row) => ({ row, invoice: invoiceById.get(row.invoice_id) }))
        .filter((entry): entry is { row: RestaurantSupplierInvoiceItemRow; invoice: RestaurantSupplierInvoiceRow } =>
          Boolean(entry.invoice && entry.invoice.invoice_date < extraction.invoiceDate),
        )
        .sort((left, right) => right.invoice.invoice_date.localeCompare(left.invoice.invoice_date))[0];
      const comparison = compareSupplierItemPrice({
        currentUnitPrice: item.unitPrice,
        currentUnit: unit,
        currentCurrency: extraction.currency,
        previousUnitPrice: history?.row.unit_price,
        previousUnit: history ? normalizeInvoiceUnit(history.row.unit) : null,
        previousCurrency: history?.invoice.currency,
      });
      const anomalies: string[] = [];
      if (itemLineMismatch(item)) anomalies.push("line_total_mismatch");
      if (item.extractionConfidence < 0.8) anomalies.push("low_extraction_confidence");
      if (itemMatch.reason === "uncertain") anomalies.push("uncertain_item_match");
      if (itemMatch.reason === "unit_mismatch") anomalies.push("unit_mismatch");
      if (comparison.anomaly) anomalies.push(comparison.anomaly);
      return {
        raw_description: item.rawDescription,
        normalized_name: normalizedName,
        quantity: item.quantity,
        unit,
        unit_price: item.unitPrice,
        line_total: item.lineTotal,
        extraction_confidence: item.extractionConfidence,
        matched_supplier_item_id: itemMatch.matchedId,
        match_confidence: itemMatch.confidence,
        requires_review: itemMatch.requiresReview || anomalies.length > 0,
        previous_unit_price: comparison.previousUnitPrice,
        absolute_change: comparison.absoluteChange,
        percentage_change: comparison.percentageChange,
        severity: comparison.severity,
        anomaly: comparison.anomaly,
        anomalies: [...new Set(anomalies)],
      };
    });

    const invoicePayload = {
      supplier_name: extraction.supplierName,
      supplier_normalized_name: normalizeSupplierName(extraction.supplierName),
      tax_identifier: extraction.taxIdentifier,
      supplier_id: supplierId,
      supplier_match_confidence: supplierMatch.confidence,
      supplier_requires_review: supplierMatch.requiresReview,
      invoice_number: extraction.invoiceNumber,
      invoice_date: extraction.invoiceDate,
      currency: extraction.currency,
      subtotal: extraction.subtotal,
      tax_total: extraction.taxTotal,
      total: extraction.total,
      source_type: "manual_upload",
      extractor: extractor.name,
      original_filename: input.file.name,
      storage_path: storagePath,
      file_hash: fileHash,
      raw_extraction: jsonValue(extraction.rawExtraction),
      confidence: extraction.confidence,
      anomalies: [...new Set(invoiceAnomalies)],
    };
    const { data, error } = await service.rpc("ingest_supplier_invoice", {
      p_actor_id: user.id,
      p_organization_id: input.organizationId,
      p_branch_id: input.branchId,
      p_invoice: jsonValue(invoicePayload),
      p_items: jsonValue(itemPayload),
    });
    throwRestaurantDatabaseError("Could not process supplier invoice", error);
    const result = data && typeof data === "object" && !Array.isArray(data) ? data : {};
    if (result.created === false) {
      await service.storage.from(SUPPLIER_INVOICE_BUCKET).remove([storagePath]);
    }
    return data;
  } catch (error) {
    await service.storage.from(SUPPLIER_INVOICE_BUCKET).remove([storagePath]);
    throw error;
  }
}

export async function getSupplierInvoiceCommandCenterData(
  organizationId: string,
  branchId: string | null,
  database: SupabaseClient<Database>,
) {
  const invoiceQuery = filterRestaurantBranch(
    database
      .from("restaurant_supplier_invoices")
      .select("*")
      .eq("organization_id", organizationId),
    branchId,
  );
  const invoicesResult = await invoiceQuery
    .order("invoice_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(30);
  throwRestaurantDatabaseError("Could not load supplier invoices", invoicesResult.error);
  const invoices = invoicesResult.data ?? [];
  const invoiceIds = invoices.map((invoice) => invoice.id);
  const itemsResult = invoiceIds.length
    ? await database
        .from("restaurant_supplier_invoice_items")
        .select("*")
        .eq("organization_id", organizationId)
        .in("invoice_id", invoiceIds)
        .order("created_at", { ascending: true })
    : { data: [], error: null };
  throwRestaurantDatabaseError("Could not load supplier invoice items", itemsResult.error);
  return { invoices, invoiceItems: itemsResult.data ?? [] };
}

export async function reviewSupplierInvoice(
  value: unknown,
  client?: SupabaseClient<Database>,
) {
  const input = reviewInvoiceSchema.parse(value);
  const database = client ?? (await createSupabaseServerClient());
  await requireRestaurantAccess(input.organizationId, ["owner", "manager"], database);
  const { data, error } = await database.rpc("review_supplier_invoice", {
    p_organization_id: input.organizationId,
    p_invoice_id: input.invoiceId,
    p_decision: input.decision,
  });
  throwRestaurantDatabaseError("Could not review supplier invoice", error);
  return data;
}

export async function createSupplierInvoiceDownloadUrl(
  invoiceId: string,
  client?: SupabaseClient<Database>,
) {
  const id = z.uuid().parse(invoiceId);
  const database = client ?? (await createSupabaseServerClient());
  const { data: invoice, error } = await database
    .from("restaurant_supplier_invoices")
    .select("organization_id, storage_path")
    .eq("id", id)
    .single();
  throwRestaurantDatabaseError("Could not load supplier invoice file", error);
  if (!invoice) throw new Error("Supplier invoice was not found.");
  await requireRestaurantAccess(invoice.organization_id, undefined, database);
  const service = createSupabaseServiceRoleClient();
  const signed = await service.storage
    .from(SUPPLIER_INVOICE_BUCKET)
    .createSignedUrl(invoice.storage_path, 60);
  throwRestaurantDatabaseError("Could not authorize supplier invoice download", signed.error);
  if (!signed.data?.signedUrl) throw new Error("Supplier invoice download is unavailable.");
  return signed.data.signedUrl;
}
