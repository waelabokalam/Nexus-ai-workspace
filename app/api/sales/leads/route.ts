import { persistSalesLead } from "@/lib/server-sales-leads";
import { toSalesLeadRecord, validateSalesLeadPayload } from "@/lib/sales-lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const rateLimitStore = new Map<string, number[]>();

function clientIdentifier(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(identifier: string, now = Date.now()) {
  const recent = (rateLimitStore.get(identifier) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitStore.set(identifier, recent);
    return true;
  }
  rateLimitStore.set(identifier, [...recent, now]);
  return false;
}

export function resetSalesLeadRateLimitForTests() {
  rateLimitStore.clear();
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please send a valid form submission." }, { status: 400 });
  }

  const validation = validateSalesLeadPayload(body);
  if (!validation.ok) {
    return Response.json({ error: validation.message, field: validation.field }, { status: 400 });
  }

  if (isRateLimited(clientIdentifier(request))) {
    return Response.json(
      { error: "Too many requests were submitted. Please wait before trying again." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  const result = await persistSalesLead(toSalesLeadRecord(validation.value));
  if (!result.ok) {
    const message = result.reason === "configuration"
      ? "Lead submissions are not configured yet. Please try again later."
      : "We could not save your request right now. Please try again later.";
    return Response.json({ error: message }, { status: 503 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
