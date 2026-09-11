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
        tenant_id: "tqen",
        business_id: "tqen-agent",
        conversation_id: "conversation-1",
        customer_id: "customer-1",
        channel: "website",
        message: { message_type: "text", content: "Hello" },
        request_id: expect.any(String),
      }),
    );
  });

  it("prioritizes TQEN_AGENT_BACKEND_URL and TQEN_AGENT_API_KEY environment variables", async () => {
    vi.stubEnv("TQEN_AGENT_BACKEND_URL", "http://127.0.0.1:9000");
    vi.stubEnv("TQEN_AGENT_API_KEY", "tqen-specific-key");

    const fetchMock = vi.fn().mockResolvedValue(
      new Response("event: request.started\ndata: {}\n\n", {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      supportRequest({ conversation_id: "c-1", customer_id: "cust-1", message: "Hi" }),
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:9000/v1/messages/stream",
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-api-key": "tqen-specific-key",
        }),
      }),
    );
  });

  it("handles backend HTTP 500 safely without leaking stack traces or internal paths", async () => {
    const internalLeakPayload = JSON.stringify({
      error: "Internal Server Error",
      traceback: "Traceback (most recent call last):\n  File '/app/src/engine.py', line 123 in run\nValueError",
      file_path: "/root/.secrets/tqen_key.json",
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(internalLeakPayload, { status: 500 })));

    const response = await POST(
      supportRequest({ conversation_id: "c-err", customer_id: "cust-err", message: "Crash test" }),
    );

    expect(response.status).toBe(502);
    const body = await response.text();
    expect(body).toContain("The TQEN Agent is temporarily unavailable. Please try again.");
    expect(body).not.toContain("/app/src/engine.py");
    expect(body).not.toContain("Traceback");
    expect(body).not.toContain("/root/.secrets");
    expect(body).not.toContain(apiKey);
  });

  it("handles backend timeout and connection errors safely without leaking details", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("connect ETIMEDOUT 127.0.0.1:8000 with secret=" + apiKey)));

    const response = await POST(
      supportRequest({ conversation_id: "c-timeout", customer_id: "cust-timeout", message: "Timeout test" }),
    );

    expect(response.status).toBe(502);
    const body = await response.text();
    expect(body).toContain("The TQEN Agent is temporarily unavailable. Please try again.");
    expect(body).not.toContain("ETIMEDOUT");
    expect(body).not.toContain(apiKey);
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
