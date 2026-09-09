import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";

import type { Database } from "@/lib/supabase/database.types";

vi.mock("server-only", () => ({}));

const runLive = process.env.NEXUS_RUN_LIVE_SUPABASE === "1";
const organizationId = "10000000-0000-4000-8000-000000000001";
const branchId = "20000000-0000-4000-8000-000000000001";
const bucket = "restaurant-supplier-invoices";

function environment(path: string) {
  return Object.fromEntries(
    readFileSync(path, "utf8").split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator), line.slice(separator + 1)];
      }),
  );
}

function requireData<T>(result: { data: T; error: unknown }, context: string): NonNullable<T> {
  const message = result.error instanceof Error ? result.error.message : String(result.error ?? "");
  expect(result.error, `${context}: ${message}`).toBeNull();
  expect(result.data, `${context}: response data is missing`).not.toBeNull();
  return result.data as NonNullable<T>;
}

function requireSuccess(result: { error: unknown }, context: string) {
  const message = result.error instanceof Error ? result.error.message : String(result.error ?? "");
  expect(result.error, `${context}: ${message}`).toBeNull();
}

async function cleanupStalePaddleFixtures(database: SupabaseClient<Database>) {
  const invoices = requireData(
    await database.from("restaurant_supplier_invoices")
      .select("id,event_id,supplier_id,storage_path")
      .eq("organization_id", organizationId)
      .eq("supplier_normalized_name", "synthetic gulf foods"),
    "load stale Paddle verifier invoices",
  );
  if (!invoices.length) return;
  const invoiceIds = invoices.map((invoice) => invoice.id);
  const eventIds = invoices.map((invoice) => invoice.event_id);
  const supplierIds = [...new Set(invoices.flatMap((invoice) => invoice.supplier_id ? [invoice.supplier_id] : []))];
  const items = requireData(
    await database.from("restaurant_supplier_invoice_items")
      .select("matched_supplier_item_id").in("invoice_id", invoiceIds),
    "load stale Paddle verifier items",
  );
  const supplierItemIds = [...new Set(items.flatMap((item) =>
    item.matched_supplier_item_id ? [item.matched_supplier_item_id] : []))];
  const attention = requireData(
    await database.from("manager_attention_items").select("id").in("event_id", eventIds),
    "load stale Paddle verifier attention",
  );
  const attentionIds = attention.map((item) => item.id);
  requireSuccess(
    await database.from("restaurant_activity_log").delete().in("entity_id", [
      ...invoiceIds, ...eventIds, ...attentionIds,
    ]),
    "delete stale Paddle verifier activity",
  );
  requireSuccess(
    await database.from("restaurant_supplier_invoices").delete().in("id", invoiceIds),
    "delete stale Paddle verifier invoices",
  );
  if (attentionIds.length) requireSuccess(
    await database.from("manager_attention_items").delete().in("id", attentionIds),
    "delete stale Paddle verifier attention",
  );
  requireSuccess(
    await database.from("restaurant_events").delete().in("id", eventIds),
    "delete stale Paddle verifier events",
  );
  if (supplierItemIds.length) requireSuccess(
    await database.from("restaurant_supplier_items").delete().in("id", supplierItemIds),
    "delete stale Paddle verifier supplier items",
  );
  if (supplierIds.length) requireSuccess(
    await database.from("restaurant_suppliers").delete().in("id", supplierIds),
    "delete stale Paddle verifier suppliers",
  );
  requireSuccess(
    await database.storage.from(bucket).remove(invoices.map((invoice) => invoice.storage_path)),
    "delete stale Paddle verifier files",
  );
}

describe.runIf(runLive)("PaddleOCR to development Supabase", () => {
  it("extracts, matches history, persists, reviews, and cleans a real invoice", async () => {
    const env = environment(process.env.NEXUS_RESTAURANT_ENV ?? ".env.local");
    const authFixture = JSON.parse(readFileSync(
      process.env.NEXUS_RESTAURANT_AUTH_FIXTURES ?? "/tmp/nexus-restaurant-v1-auth.json",
      "utf8",
    )) as { projectRef: string; users: { role: string; email: string; password: string }[] };
    expect(authFixture.projectRef).toBe("ovloyniqxpuqkwrpoafp");
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toMatch(/ovloyniqxpuqkwrpoafp\.supabase\.co$/);
    expect(process.env.NEXUS_LIVE_OCR_URL).toMatch(/^http:\/\/127\.0\.0\.1:/);

    const service = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    await cleanupStalePaddleFixtures(service);
    async function signedIn(role: string) {
      const fixture = authFixture.users.find((candidate) => candidate.role === role);
      expect(fixture).toBeTruthy();
      const client = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const signedInResult = await client.auth.signInWithPassword({
        email: fixture!.email,
        password: fixture!.password,
      });
      expect(signedInResult.error, `${role} sign-in`).toBeNull();
      expect(signedInResult.data.user, `${role} user`).toBeTruthy();
      return client;
    }
    const owner = await signedIn("owner");
    const manager = await signedIn("manager");
    const ownerUserResult = await owner.auth.getUser();
    expect(ownerUserResult.error, "owner user").toBeNull();
    const ownerUser = ownerUserResult.data.user;
    if (!ownerUser) throw new Error("Owner fixture authentication returned no user");
    const runId = `paddle-live-${Date.now()}`;
    const baselinePath = `${organizationId}/${runId}/baseline.pdf`;
    const created = {
      invoiceIds: new Set<string>(),
      eventIds: new Set<string>(),
      attentionIds: new Set<string>(),
      supplierIds: new Set<string>(),
      supplierItemIds: new Set<string>(),
      storagePaths: new Set<string>([baselinePath]),
    };

    async function cleanup(database: SupabaseClient<Database>) {
      if (created.eventIds.size) {
        const rows = requireData(
          await database.from("manager_attention_items").select("id").in("event_id", [...created.eventIds]),
          "load cleanup attention",
        );
        rows.forEach((row) => created.attentionIds.add(row.id));
      }
      const activityEntities = [...new Set([
        ...created.invoiceIds, ...created.eventIds, ...created.attentionIds,
      ])];
      if (activityEntities.length) requireSuccess(
        await database.from("restaurant_activity_log").delete().in("entity_id", activityEntities),
        "delete live activity",
      );
      if (created.invoiceIds.size) requireSuccess(
        await database.from("restaurant_supplier_invoices").delete().in("id", [...created.invoiceIds]),
        "delete live invoices",
      );
      if (created.attentionIds.size) requireSuccess(
        await database.from("manager_attention_items").delete().in("id", [...created.attentionIds]),
        "delete live attention",
      );
      if (created.eventIds.size) requireSuccess(
        await database.from("restaurant_events").delete().in("id", [...created.eventIds]),
        "delete live events",
      );
      if (created.supplierItemIds.size) requireSuccess(
        await database.from("restaurant_supplier_items").delete().in("id", [...created.supplierItemIds]),
        "delete live supplier items",
      );
      if (created.supplierIds.size) requireSuccess(
        await database.from("restaurant_suppliers").delete().in("id", [...created.supplierIds]),
        "delete live suppliers",
      );
      if (created.storagePaths.size) requireSuccess(
        await database.storage.from(bucket).remove([...created.storagePaths]),
        "delete live files",
      );
    }

    try {
      requireData(await service.storage.from(bucket).upload(
        baselinePath,
        new TextEncoder().encode("%PDF-1.4\n% synthetic baseline\n%%EOF"),
        { contentType: "application/pdf", upsert: false },
      ), "upload baseline");
      const baselineHash = createHash("sha256").update(runId).digest("hex");
      const baseline = requireData(await service.rpc("ingest_supplier_invoice", {
        p_actor_id: ownerUser.id,
        p_organization_id: organizationId,
        p_branch_id: branchId,
        p_invoice: {
          supplier_name: "Synthetic Gulf Foods LLC",
          supplier_normalized_name: "synthetic gulf foods",
          tax_identifier: null,
          supplier_id: null,
          supplier_match_confidence: 1,
          supplier_requires_review: false,
          invoice_number: `${runId}-baseline`,
          invoice_date: "2026-09-08",
          currency: "AED",
          subtotal: 190,
          tax_total: 9.5,
          total: 199.5,
          source_type: "manual_upload",
          extractor: "manual_structured_v1",
          original_filename: "baseline.pdf",
          storage_path: baselinePath,
          file_hash: baselineHash,
          raw_extraction: { verification: runId },
          confidence: 1,
          anomalies: [],
        },
        p_items: [
          {
            raw_description: "Chicken Breast",
            normalized_name: "chicken breast",
            quantity: 10,
            unit: "kg",
            unit_price: 15,
            line_total: 150,
            extraction_confidence: 1,
            matched_supplier_item_id: null,
            match_confidence: 1,
            requires_review: false,
            previous_unit_price: null,
            absolute_change: null,
            percentage_change: null,
            severity: "none",
            anomaly: null,
            anomalies: [],
          },
          {
            raw_description: "Olive Oil",
            normalized_name: "olive oil",
            quantity: 2,
            unit: "unit",
            unit_price: 20,
            line_total: 40,
            extraction_confidence: 1,
            matched_supplier_item_id: null,
            match_confidence: 1,
            requires_review: false,
            previous_unit_price: null,
            absolute_change: null,
            percentage_change: null,
            severity: "none",
            anomaly: null,
            anomalies: [],
          },
        ],
      }), "ingest baseline") as unknown as {
        invoice_id: string; event_id: string; supplier_id: string; attention_item_id: string | null;
      };
      created.invoiceIds.add(baseline.invoice_id);
      created.eventIds.add(baseline.event_id);
      created.supplierIds.add(baseline.supplier_id);
      const baselineItems = requireData(
        await service.from("restaurant_supplier_invoice_items")
          .select("matched_supplier_item_id").eq("invoice_id", baseline.invoice_id),
        "load baseline items",
      );
      baselineItems.forEach((item) => created.supplierItemIds.add(item.matched_supplier_item_id!));

      const {
        PaddleSupplierInvoiceExtractor,
        ReviewedPaddleDraftSupplierInvoiceExtractor,
      } = await import("@/lib/restaurant/paddle-invoice");
      const { processSupplierInvoice, reviewSupplierInvoice } = await import("@/lib/restaurant/invoice-services");
      const invoiceBytes = readFileSync(process.env.NEXUS_LIVE_INVOICE_FILE!);
      const draft = await new PaddleSupplierInvoiceExtractor({
        endpoint: process.env.NEXUS_LIVE_OCR_URL,
        token: process.env.NEXUS_LIVE_OCR_TOKEN,
        timeoutMs: 180_000,
      }).extract({
        filename: `${runId}.png`,
        mimeType: "image/png",
        bytes: invoiceBytes,
        languageHint: "en",
      });
      const automatic = await processSupplierInvoice({
        organizationId,
        branchId,
        file: new File([invoiceBytes], `${runId}.png`, { type: "image/png" }),
        manualExtraction: draft,
        languageHint: "en",
      }, {
        user: owner,
        service,
        extractor: new ReviewedPaddleDraftSupplierInvoiceExtractor(),
      }) as {
        invoice_id: string; event_id: string; attention_item_id: string; supplier_id: string; created: boolean;
      };
      expect(automatic.created).toBe(true);
      created.invoiceIds.add(automatic.invoice_id);
      created.eventIds.add(automatic.event_id);
      created.attentionIds.add(automatic.attention_item_id);
      const persisted = requireData(
        await service.from("restaurant_supplier_invoices")
          .select("extractor,review_status,storage_path,supplier_id,raw_extraction")
          .eq("id", automatic.invoice_id).single(),
        "load automatic invoice",
      );
      created.storagePaths.add(persisted.storage_path);
      expect(persisted.extractor).toBe("paddle_pp_structure_v3_3_7_0");
      expect(persisted.review_status).toBe("pending");
      expect(persisted.supplier_id).toBe(baseline.supplier_id);
      expect(persisted.raw_extraction).toMatchObject({ mode: "paddle_pp_structure_v3" });
      const items = requireData(
        await service.from("restaurant_supplier_invoice_items")
          .select("raw_description,previous_unit_price,unit_price,percentage_change,anomalies")
          .eq("invoice_id", automatic.invoice_id),
        "load automatic items",
      );
      const changed = items.find((item) => item.raw_description === "Chicken Breast");
      expect(changed).toMatchObject({ previous_unit_price: 15, unit_price: 18, percentage_change: 20 });
      expect(changed?.anomalies).toContain("price_increase");
      const directDownload = await owner.storage.from(bucket).download(persisted.storage_path);
      expect(directDownload.error).toBeTruthy();

      await reviewSupplierInvoice({
        organizationId,
        invoiceId: automatic.invoice_id,
        decision: "reviewed",
      }, manager);
      expect(requireData(
        await manager.from("restaurant_supplier_invoices").select("review_status").eq("id", automatic.invoice_id).single(),
        "load manager-reviewed invoice",
      ).review_status).toBe("reviewed");
    } finally {
      await cleanup(service);
    }

    expect(requireData(
      await service.from("restaurant_supplier_invoices").select("id").in("id", [...created.invoiceIds]),
      "verify invoice cleanup",
    )).toEqual([]);
    expect(requireData(
      await service.from("restaurant_suppliers").select("id").in("id", [...created.supplierIds]),
      "verify supplier cleanup",
    )).toEqual([]);
    expect(requireData(
      await service.from("restaurant_supplier_invoices").select("id")
        .eq("organization_id", organizationId)
        .eq("supplier_normalized_name", "synthetic gulf foods"),
      "verify all Paddle verifier invoices are gone",
    )).toEqual([]);
    expect(requireData(
      await service.from("restaurant_suppliers").select("id")
        .eq("organization_id", organizationId)
        .eq("normalized_name", "synthetic gulf foods"),
      "verify all Paddle verifier suppliers are gone",
    )).toEqual([]);
  }, 240_000);
});
