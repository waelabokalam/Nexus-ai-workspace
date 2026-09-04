import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/demo/restaurant/route";

const apiKey = "test-development-key";

function restaurantRequest(body: unknown) {
  return new Request("http://localhost/api/demo/restaurant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("restaurant proxy", () => {
  beforeEach(() => {
    vi.stubEnv("NEXUS_BACKEND_URL", "http://127.0.0.1:8000");
    vi.stubEnv("NEXUS_DEVELOPMENT_API_KEY", apiKey);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("forwards the restaurant-scoped request to the backend", async () => {
    const stream = "event: request.started\ndata: {\"type\":\"request.started\"}\n\n";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(stream, {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      restaurantRequest({ conversation_id: "conversation-1", customer_id: "customer-1", message: "2 kisilik masa" }),
    );

    expect(response.status).toBe(200);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(
      expect.objectContaining({
        tenant_id: "demo-tenant",
        business_id: "restaurant-demo",
        channel: "website",
      }),
    );
  });
});
