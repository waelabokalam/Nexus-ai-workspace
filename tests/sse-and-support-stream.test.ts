import { describe, expect, it } from "vitest";
import { SSEParser } from "@/lib/sse";
import { createNewSupportSession, getOrCreateSupportSession } from "@/lib/support-session";
import {
  appendAssistantDelta,
  applyWorkflowEvent,
  createWorkflowSteps,
  userFacingStreamError,
} from "@/lib/support-stream";

describe("SSE parsing and support stream state", () => {
  it("parses multiple SSE events across chunks", () => {
    const parser = new SSEParser();
    const first = parser.push('event: request.started\ndata: {"type":"request.started"}\n\n');
    const second = parser.push('event: response.delta\ndata: {"type":"response.delta","payload":{"text":"Hello"}}\n\n');

    expect(first).toEqual([{ event: "request.started", data: '{"type":"request.started"}', id: undefined }]);
    expect(second).toEqual([
      {
        event: "response.delta",
        data: '{"type":"response.delta","payload":{"text":"Hello"}}',
        id: undefined,
      },
    ]);
  });

  it("appends response.delta text and reports a safe request.failed message", () => {
    expect(appendAssistantDelta("Hel", "lo")).toBe("Hello");
    expect(userFacingStreamError()).toBe("The support demo could not complete that request. Please try again.");
  });

  it("updates only real workflow events", () => {
    const steps = applyWorkflowEvent(createWorkflowSteps(), {
      type: "request.started",
      timestamp: "2026-07-29T10:00:00.000Z",
    });
    const next = applyWorkflowEvent(steps, {
      type: "request.validated",
      timestamp: "2026-07-29T10:00:00.120Z",
    });

    expect(next[0]).toMatchObject({ state: "complete", durationMs: 120 });
    expect(next[1]).toMatchObject({ state: "active" });
    expect(next[4]).toMatchObject({ state: "pending" });
  });

  it("persists a conversation ID across messages in the browser session", () => {
    const values = new Map<string, string>();
    const storage = {
      get length() {
        return values.size;
      },
      clear: () => values.clear(),
      getItem: (key: string) => values.get(key) ?? null,
      key: () => null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
    };
    const first = getOrCreateSupportSession(storage);
    const second = getOrCreateSupportSession(storage);

    expect(first).toEqual(second);
    expect(first.conversationId).not.toHaveLength(0);
    expect(first.customerId).not.toHaveLength(0);
  });

  it("creates fresh persisted identifiers for a deliberate new conversation", () => {
    const values = new Map<string, string>();
    const storage = {
      get length() {
        return values.size;
      },
      clear: () => values.clear(),
      getItem: (key: string) => values.get(key) ?? null,
      key: () => null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
    };

    const original = getOrCreateSupportSession(storage);
    const replacement = createNewSupportSession(storage);

    expect(replacement).not.toEqual(original);
    expect(getOrCreateSupportSession(storage)).toEqual(replacement);
  });
});
