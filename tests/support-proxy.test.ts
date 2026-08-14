import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/demo/support/route";
import { POST as pgparaPOST } from "@/app/api/demo/pgpara/route";

const apiKey = "test-development-key";

function supportRequest(body: unknown) {
  return new Request("http://localhost/api/demo/support", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("support proxy", () => {
  beforeEach(() => {
    vi.stubEnv("NEXUS_BACKEND_URL", "http://127.0.0.1:8000");
    vi.stubEnv("NEXUS_DEVELOPMENT_API_KEY", apiKey);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("rejects an invalid browser payload without calling the backend", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(supportRequest({ conversation_id: "only-one-field" }));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not expose the development API key when the backend fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(apiKey, { status: 401 })));

    const response = await POST(
      supportRequest({ conversation_id: "conversation-1", customer_id: "customer-1", message: "Hello" }),
    );

    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain(apiKey);
    expect(response.headers.get("x-api-key")).toBeNull();
  });

  it("forwards the correct scoped FastAPI request and streams its response", async () => {
    const stream = "event: request.started\ndata: {\"type\":\"request.started\"}\n\n";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(stream, {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      supportRequest({ conversation_id: "conversation-1", customer_id: "customer-1", message: "Hello" }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/event-stream");
    expect(await response.text()).toBe(stream);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/v1/messages/stream",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        }),
      }),
    );

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(
      expect.objectContaining({
        tenant_id: "demo-tenant",
        business_id: "support-demo",
        conversation_id: "conversation-1",
        customer_id: "customer-1",
        channel: "website",
        message: { message_type: "text", content: "Hello" },
        request_id: expect.any(String),
      }),
    );
  });
});

describe("PGPara prototype proxy", () => {
  beforeEach(() => {
    vi.stubEnv("NEXUS_BACKEND_URL", "http://127.0.0.1:8000");
    vi.stubEnv("NEXUS_DEVELOPMENT_API_KEY", apiKey);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("forwards PGPara IDs server-side without returning the API key", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('event: response.completed\\ndata: {"type":"response.completed"}\\n\\n', {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await pgparaPOST(
      supportRequest({ conversation_id: "pg-conversation", customer_id: "pg-customer", message: "Sanal POS nedir?" }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("x-api-key")).toBeNull();
    expect(await response.text()).not.toContain(apiKey);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(
      expect.objectContaining({
        tenant_id: "pgpara-demo",
        business_id: "pgpara-assistant",
        conversation_id: "pg-conversation",
        customer_id: "pg-customer",
        message: { message_type: "text", content: "Sanal POS nedir?" },
      }),
    );
  });
});
