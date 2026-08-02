"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SSEParser } from "@/lib/sse";
import { createNewSupportSession, getOrCreateSupportSession } from "@/lib/support-session";
import {
  appendAssistantDelta,
  applyWorkflowEvent,
  createWorkflowSteps,
  finaliseWorkflow,
  type EngineStreamEvent,
  userFacingStreamError,
  type WorkflowStep,
} from "@/lib/support-stream";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  complete?: boolean;
};

function isEngineEvent(value: unknown): value is EngineStreamEvent {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    typeof value.type === "string"
  );
}

export default function useSupportChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [workflow, setWorkflow] = useState<WorkflowStep[]>(createWorkflowSteps);
  const [isSending, setIsSending] = useState(false);
  const isReady = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const sessionRef = useRef<{ conversationId: string; customerId: string } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const sendMessage = useCallback(async (content: string) => {
    const session =
      sessionRef.current ||
      getOrCreateSupportSession(sessionStorage);
    sessionRef.current = session;
    const message = content.trim();
    if (!session || !message || isSending) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: message, complete: true };
    const assistantId = crypto.randomUUID();
    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "assistant", content: "", complete: false },
    ]);
    setWorkflow(createWorkflowSteps());
    setError(null);
    setLastFailedMessage(null);
    setIsSending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const updateAssistant = (update: (message: ChatMessage) => ChatMessage) => {
      setMessages((current) =>
        current.map((chatMessage) =>
          chatMessage.id === assistantId ? update(chatMessage) : chatMessage,
        ),
      );
    };

    try {
      const response = await fetch("/api/demo/support", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: session.conversationId,
          customer_id: session.customerId,
          message,
        }),
      });

      if (!response.ok || !response.body) throw new Error("support stream unavailable");

      const parser = new SSEParser();
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let completed = false;

      const handleEvent = (rawEvent: { event: string; data: string }) => {
        let parsed: unknown;
        try {
          parsed = JSON.parse(rawEvent.data);
        } catch {
          return;
        }
        if (!isEngineEvent(parsed)) return;

        const event = { ...parsed, type: rawEvent.event || parsed.type };
        setWorkflow((current) => applyWorkflowEvent(current, event));

        if (event.type === "response.delta") {
          updateAssistant((assistant) => ({
            ...assistant,
            content: appendAssistantDelta(assistant.content, event.payload?.text),
          }));
        }
        if (event.type === "response.completed") {
          completed = true;
          updateAssistant((assistant) => ({ ...assistant, complete: true }));
        }
        if (event.type === "request.failed") {
          completed = true;
          const safeMessage = userFacingStreamError();
          setError(safeMessage);
          setLastFailedMessage(message);
          updateAssistant((assistant) => ({ ...assistant, content: safeMessage, complete: true }));
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const event of parser.push(decoder.decode(value, { stream: true }))) handleEvent(event);
      }
      for (const event of parser.push(decoder.decode())) handleEvent(event);
      for (const event of parser.finish()) handleEvent(event);

      if (!completed) {
        const safeMessage = userFacingStreamError();
        setError(safeMessage);
        setLastFailedMessage(message);
        updateAssistant((assistant) => ({ ...assistant, content: safeMessage, complete: true }));
      }
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return;
      const safeMessage = userFacingStreamError();
      setError(safeMessage);
      setLastFailedMessage(message);
      updateAssistant((assistant) => ({ ...assistant, content: safeMessage, complete: true }));
    } finally {
      setWorkflow((current) => finaliseWorkflow(current));
      setIsSending(false);
      abortRef.current = null;
    }
  }, [isSending]);

  const startNewConversation = useCallback(() => {
    if (isSending) return;
    sessionRef.current = createNewSupportSession(sessionStorage);
    setMessages([]);
    setWorkflow(createWorkflowSteps());
    setError(null);
    setLastFailedMessage(null);
  }, [isSending]);

  return { messages, workflow, isSending, isReady, error, lastFailedMessage, sendMessage, startNewConversation };
}
