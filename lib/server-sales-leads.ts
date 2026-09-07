import type { SalesLeadRecord } from "@/lib/sales-lead";

type PersistenceResult =
  | { ok: true }
  | { ok: false; reason: "configuration" | "unavailable" };

export async function persistSalesLead(lead: SalesLeadRecord): Promise<PersistenceResult> {
  const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) return { ok: false, reason: "configuration" };

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/sales_leads`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(lead),
      cache: "no-store",
    });

    return response.ok ? { ok: true } : { ok: false, reason: "unavailable" };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}
