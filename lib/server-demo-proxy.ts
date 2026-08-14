import { randomUUID } from "crypto";

type BrowserDemoPayload = {
  conversation_id: string;
  customer_id: string;
  message: string;
};

type DemoBackendProfile = {
  tenantId: string;
  businessId: string;
  unavailableMessage: string;
};

const MAX_ID_LENGTH = 128;
const MAX_MESSAGE_LENGTH = 12_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validIdentifier(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= MAX_ID_LENGTH
  );
}

export function validateBrowserDemoPayload(value: unknown): BrowserDemoPayload | null {
  if (!isRecord(value)) return null;

  const { conversation_id, customer_id, message } = value;
  if (
    !validIdentifier(conversation_id) ||
    !validIdentifier(customer_id) ||
    typeof message !== "string" ||
    message.trim().length === 0 ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return null;
  }

  return {
    conversation_id: conversation_id.trim(),
    customer_id: customer_id.trim(),
    message: message.trim(),
  };
}

function jsonError(status: number, message: string) {
  return Response.json({ error: message }, { status });
}

function isAbortError(error: unknown) {
  return (
    error instanceof DOMException
      ? error.name === "AbortError"
      : typeof error === "object" && error !== null && "name" in error && error.name === "AbortError"
  );
}

export function createDemoProxy(profile: DemoBackendProfile) {
  return async function POST(request: Request) {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return jsonError(400, "Please send a valid support message.");
    }

    const payload = validateBrowserDemoPayload(body);
    if (!payload) {
      return jsonError(400, "Please provide a valid conversation, customer, and message.");
    }

    const backendUrl = process.env.NEXUS_BACKEND_URL?.replace(/\/$/, "");
    const apiKey = process.env.NEXUS_DEVELOPMENT_API_KEY;
    if (!backendUrl || !apiKey) {
      return jsonError(503, profile.unavailableMessage);
    }

    if (request.signal.aborted) {
      return new Response(null, { status: 499 });
    }

    let backendResponse: Response;
    try {
      backendResponse = await fetch(`${backendUrl}/v1/messages/stream`, {
        method: "POST",
        signal: request.signal,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          tenant_id: profile.tenantId,
          business_id: profile.businessId,
          conversation_id: payload.conversation_id,
          customer_id: payload.customer_id,
          channel: "website",
          message: {
            message_type: "text",
            content: payload.message,
          },
          request_id: randomUUID(),
        }),
      });
    } catch (error) {
      if (request.signal.aborted || isAbortError(error)) {
        return new Response(null, { status: 499 });
      }
      return jsonError(502, profile.unavailableMessage);
    }

    if (!backendResponse.ok || !backendResponse.body) {
      return jsonError(502, profile.unavailableMessage);
    }

    return new Response(backendResponse.body, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
      },
    });
  };
}
