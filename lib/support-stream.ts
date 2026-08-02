export const WORKFLOW_EVENTS = [
  "request.started",
  "request.validated",
  "memory.loaded",
  "intent.detected",
  "retrieval.started",
  "retrieval.completed",
  "response.started",
  "response.completed",
] as const;

export type WorkflowEventType = (typeof WORKFLOW_EVENTS)[number];
export type WorkflowState = "pending" | "active" | "complete" | "skipped";

export type EngineStreamEvent = {
  type: string;
  timestamp?: string;
  payload?: Record<string, unknown>;
};

export type WorkflowStep = {
  type: WorkflowEventType;
  label: string;
  state: WorkflowState;
  durationMs?: number;
  startedAt?: number;
};

const labels: Record<WorkflowEventType, string> = {
  "request.started": "Receiving message",
  "request.validated": "Checking request",
  "memory.loaded": "Loading conversation memory",
  "intent.detected": "Understanding intent",
  "retrieval.started": "Searching company knowledge",
  "retrieval.completed": "Knowledge search complete",
  "response.started": "Preparing response",
  "response.completed": "Completing request",
};

function timestampFor(event: EngineStreamEvent) {
  const timestamp = event.timestamp ? Date.parse(event.timestamp) : Number.NaN;
  return Number.isFinite(timestamp) ? timestamp : Date.now();
}

function isWorkflowEvent(type: string): type is WorkflowEventType {
  return WORKFLOW_EVENTS.includes(type as WorkflowEventType);
}

export function createWorkflowSteps(): WorkflowStep[] {
  return WORKFLOW_EVENTS.map((type) => ({ type, label: labels[type], state: "pending" }));
}

export function applyWorkflowEvent(
  steps: WorkflowStep[],
  event: EngineStreamEvent,
): WorkflowStep[] {
  if (!isWorkflowEvent(event.type)) return steps;

  const at = timestampFor(event);
  const next = steps.map((step) => {
    if (step.state !== "active") return step;
    return {
      ...step,
      state: "complete" as const,
      durationMs: step.startedAt ? Math.max(0, at - step.startedAt) : undefined,
    };
  });

  const targetIndex = next.findIndex((step) => step.type === event.type);
  if (targetIndex === -1) return next;

  next[targetIndex] = {
    ...next[targetIndex],
    state: event.type === "response.completed" ? "complete" : "active",
    startedAt: at,
  };

  if (event.type === "response.completed") {
    return next.map((step) =>
      step.state === "pending" ? { ...step, state: "skipped" as const } : step,
    );
  }

  return next;
}

export function finaliseWorkflow(steps: WorkflowStep[], at = Date.now()): WorkflowStep[] {
  return steps.map((step) => {
    if (step.state === "active") {
      return {
        ...step,
        state: "complete" as const,
        durationMs: step.startedAt ? Math.max(0, at - step.startedAt) : undefined,
      };
    }
    if (step.state === "pending") return { ...step, state: "skipped" as const };
    return step;
  });
}

export function appendAssistantDelta(content: string, delta: unknown) {
  return typeof delta === "string" ? `${content}${delta}` : content;
}

export function userFacingStreamError() {
  return "The support demo could not complete that request. Please try again.";
}
