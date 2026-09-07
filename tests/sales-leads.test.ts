import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST, resetSalesLeadRateLimitForTests } from "@/app/api/sales/leads/route";
import { normalizeWebsiteUrl, validateSalesLeadPayload } from "@/lib/sales-lead";

function validLead(overrides: Record<string, unknown> = {}) {
  return {
    full_name: "Aylin Demir",
    email: "aylin@example.com",
    phone: "+90 555 555 55 55",
    preferred_contact_method: "whatsapp",
    business_name: "North Table",
    website_url: "northtable.example",
    country: "Türkiye",
    city: "Istanbul",
    location_count: "2-5",
    current_channels: ["website", "instagram"],
    interested_in: ["online_ordering", "customer_crm"],
    pain_point: "Orders and customer context are split across tools.",
    industry: "restaurants",
    source_page: "/restaurants",
    utm_source: "outbound",
    utm_medium: "email",
    utm_campaign: "istanbul-restaurants",
    company_website: "",
    form_started_at: Date.now() - 5_000,
    ...overrides,
  };
}

function leadRequest(body: unknown, ip = "203.0.113.10") {
  return new Request("http://localhost/api/sales/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

describe("sales lead validation", () => {
  it("normalizes safe website URLs and rejects unsafe protocols", () => {
    expect(normalizeWebsiteUrl("northtable.example/menu")).toBe("https://northtable.example/menu");
    expect(normalizeWebsiteUrl("javascript:alert(1)")).toBeNull();
  });

  it("rejects invalid email, missing selections, honeypots, and implausibly fast submissions", () => {
    expect(validateSalesLeadPayload(validLead({ email: "not-an-email" }))).toMatchObject({ ok: false, field: "email" });
    expect(validateSalesLeadPayload(validLead({ current_channels: [] }))).toMatchObject({ ok: false, field: "current_channels" });
    expect(validateSalesLeadPayload(validLead({ company_website: "spam.example" }))).toMatchObject({ ok: false });
    expect(validateSalesLeadPayload(validLead({ form_started_at: Date.now() }))).toMatchObject({ ok: false });
  });

  it("retains qualified attribution without accepting arbitrary source URLs", () => {
    const valid = validateSalesLeadPayload(validLead());
    expect(valid).toMatchObject({
      ok: true,
      value: {
        industry: "restaurants",
        source_page: "/restaurants",
        utm_source: "outbound",
        utm_campaign: "istanbul-restaurants",
      },
    });

    const external = validateSalesLeadPayload(validLead({ source_page: "https://example.com/redirect" }));
    expect(external).toMatchObject({ ok: true, value: { source_page: "/contact" } });
  });
});

describe("sales lead route", () => {
  beforeEach(() => {
    resetSalesLeadRateLimitForTests();
    vi.stubEnv("SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-secret");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("rejects malformed data before persistence", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(leadRequest(validLead({ email: "broken" })));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("persists a sanitized lead server-side without exposing the service key", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(leadRequest(validLead()));

    expect(response.status).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://project.supabase.co/rest/v1/sales_leads",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ apikey: "test-service-role-secret" }),
      }),
    );
    const persisted = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(persisted).toMatchObject({
      email: "aylin@example.com",
      status: "new",
      source_page: "/restaurants",
    });
    expect(persisted).not.toHaveProperty("form_started_at");
    expect(JSON.stringify(responseBody)).not.toContain("test-service-role-secret");
  });

  it("fails safely when lead storage is not configured", async () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    const response = await POST(leadRequest(validLead()));

    expect(response.status).toBe(503);
    expect(await response.text()).not.toMatch(/service.role|supabase|secret/i);
  });

  it("rate limits repeated submissions from the same client", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 201 })));
    for (let index = 0; index < 5; index += 1) {
      expect((await POST(leadRequest(validLead(), "198.51.100.7"))).status).toBe(201);
    }
    const blocked = await POST(leadRequest(validLead(), "198.51.100.7"));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBe("600");
  });
});
