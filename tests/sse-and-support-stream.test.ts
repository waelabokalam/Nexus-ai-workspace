import { describe, expect, it } from "vitest";
import { SSEParser } from "@/lib/sse";
import { createNewSupportSession, getOrCreateSupportSession } from "@/lib/support-session";
import { createNewDemoSession, getOrCreateDemoSession } from "@/lib/support-session";
import { messageDirection } from "@/lib/message-direction";
import PGParaDemoPage, { pgparaWorkspaceConfig } from "@/app/demo/pgpara/page";
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

  it("does not duplicate workflow state or assistant deltas when intent events repeat", () => {
    const steps = applyWorkflowEvent(createWorkflowSteps(), {
      type: "intent.detected",
      timestamp: "2026-08-14T10:00:00.000Z",
    });
    const repeated = applyWorkflowEvent(steps, {
      type: "intent.detected",
      timestamp: "2026-08-14T10:00:00.050Z",
    });

    expect(repeated).toHaveLength(8);
    expect(repeated.filter((step) => step.type === "intent.detected")).toHaveLength(1);
    expect(appendAssistantDelta("", "Professional financial-safety guidance.")).toBe("Professional financial-safety guidance.");
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

  it("isolates PGPara conversation state without changing the support-demo session keys", () => {
    const values = new Map<string, string>();
    const storage = {
      get length() { return values.size; },
      clear: () => values.clear(),
      getItem: (key: string) => values.get(key) ?? null,
      key: () => null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => values.set(key, value),
    };

    const support = getOrCreateSupportSession(storage);
    const pgpara = getOrCreateDemoSession(storage, "pgpara");
    const newPgpara = createNewDemoSession(storage, "pgpara");

    expect(support).toEqual(getOrCreateSupportSession(storage));
    expect(pgpara).not.toEqual(support);
    expect(newPgpara).not.toEqual(pgpara);
    expect(values.has("nexus-support-conversation-id")).toBe(true);
    expect(values.has("nexus-pgpara-conversation-id")).toBe(true);
  });

  it("exposes PGPara starter prompts and renders Arabic messages in RTL", () => {
    const page = PGParaDemoPage();

    expect(page).toBeTruthy();
    expect(pgparaWorkspaceConfig.prompts).toContain("Sanal POS nedir?");
    expect(pgparaWorkspaceConfig.prompts).toContain("بدي أعرف كيف أقدر أرسل حوالة");
    expect(messageDirection("بدي أعرف كيف أقدر أرسل حوالة")).toBe("rtl");
    expect(messageDirection("Sanal POS nedir?")).toBe("auto");
    expect(JSON.stringify(pgparaWorkspaceConfig)).not.toContain("NEXUS_DEVELOPMENT_API_KEY");
  });
});
