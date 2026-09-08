import type {
  ManagerApprovalRow,
  ManagerAttentionItemRow,
  RestaurantActivityRow,
  RestaurantBranchRow,
  RestaurantEventRow,
  RestaurantSeverity,
} from "@/lib/supabase/database.types";

export type RestaurantSummary = {
  eventsToday: number;
  handledAutomatically: number;
  waitingForApproval: number;
  openAttentionItems: number;
  humanEscalations: number;
  reservationsToday: number;
  customerInteractions: number;
};

export type RestaurantSummaryInput = {
  events: RestaurantEventRow[];
  attentionItems: ManagerAttentionItemRow[];
  approvals: ManagerApprovalRow[];
  startsAt: string;
  endsAt: string;
  branchId?: string | null;
};

export type DailyManagerBriefItemKind =
  | "high_human_escalations"
  | "high_priority_attention"
  | "pending_approvals"
  | "unresolved_complaints"
  | "open_attention"
  | "reservations_today"
  | "customer_interactions_today"
  | "auto_handled_today";

export type DailyManagerBriefPriorityItem = {
  kind: DailyManagerBriefItemKind;
  count: number;
  label: string;
  priority: RestaurantSeverity;
};

export type DailyManagerBrief = {
  source: "deterministic";
  headline: string;
  priorityItems: DailyManagerBriefPriorityItem[];
  attentionCount: number;
  highPriorityAttentionCount: number;
  approvalCount: number;
  escalationCount: number;
  handledCount: number;
  eventCount: number;
  reservationCount: number;
  customerInteractionCount: number;
  unresolvedComplaintCount: number;
  actionableCount: number;
  operationalNotes: string[];
  generatedForDate: string;
  organizationId: string;
  branchId: string | null;
  scopeLabel: string;
};

export type DailyManagerBriefInput = RestaurantSummaryInput & {
  organizationId: string;
  generatedForDate: string;
  branches: Pick<RestaurantBranchRow, "id" | "name">[];
  activity: RestaurantActivityRow[];
};

type OperationalRows = {
  events: RestaurantEventRow[];
  attentionItems: ManagerAttentionItemRow[];
  approvals: ManagerApprovalRow[];
};

const ACTIVE_EVENT_STATUSES = new Set([
  "new",
  "processing",
  "waiting_approval",
  "escalated",
]);

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function belongsToBranch(
  row: { branch_id: string | null },
  branchId?: string | null,
) {
  return !branchId || row.branch_id === null || row.branch_id === branchId;
}

export function isAutomaticallyHandledEvent(event: RestaurantEventRow) {
  return event.handling_mode === "auto" && event.status === "handled";
}

function getOperationalRows(input: RestaurantSummaryInput): OperationalRows {
  const start = Date.parse(input.startsAt);
  const end = Date.parse(input.endsAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) {
    throw new Error("A valid, increasing summary time window is required.");
  }

  const events = input.events.filter((event) => {
    const occurredAt = Date.parse(event.occurred_at);
    return (
      occurredAt >= start &&
      occurredAt < end &&
      belongsToBranch(event, input.branchId)
    );
  });
  const attentionItems = input.attentionItems.filter((item) =>
    belongsToBranch(item, input.branchId),
  );
  const approvals = input.approvals.filter((item) =>
    belongsToBranch(item, input.branchId),
  );

  return { events, attentionItems, approvals };
}

function summarizeOperationalRows({
  events,
  attentionItems,
  approvals,
}: OperationalRows): RestaurantSummary {
  return {
    eventsToday: events.length,
    handledAutomatically: events.filter(isAutomaticallyHandledEvent).length,
    waitingForApproval: approvals.filter((approval) => approval.status === "pending").length,
    openAttentionItems: attentionItems.filter(
      (item) => item.status === "open" || item.status === "assigned",
    ).length,
    humanEscalations: events.filter(
      (event) => event.handling_mode === "human" && event.status === "escalated",
    ).length,
    reservationsToday: events.filter((event) =>
      event.event_type.startsWith("reservation_"),
    ).length,
    customerInteractions: events.filter((event) => event.category === "customer").length,
  };
}

export function calculateRestaurantSummary(
  input: RestaurantSummaryInput,
): RestaurantSummary {
  return summarizeOperationalRows(getOperationalRows(input));
}

export function calculateDailyManagerBrief(
  input: DailyManagerBriefInput,
): DailyManagerBrief {
  const rows = getOperationalRows(input);
  const summary = summarizeOperationalRows(rows);
  const activeAttention = rows.attentionItems.filter(
    (item) => item.status === "open" || item.status === "assigned",
  );
  const pendingApprovals = rows.approvals.filter(
    (approval) => approval.status === "pending",
  );
  const humanEscalations = rows.events.filter(
    (event) => event.handling_mode === "human" && event.status === "escalated",
  );
  const highHumanEscalations = humanEscalations.filter(
    (event) => event.severity === "high" || event.severity === "critical",
  );
  const highHumanEventIds = new Set(highHumanEscalations.map((event) => event.id));
  const highPriorityAttention = activeAttention.filter(
    (item) => item.priority === "high" || item.priority === "critical",
  );
  const highPriorityAttentionOutsideEscalations = highPriorityAttention.filter(
    (item) => !item.event_id || !highHumanEventIds.has(item.event_id),
  );
  const unresolvedComplaints = rows.events.filter(
    (event) =>
      event.event_type === "complaint" && ACTIVE_EVENT_STATUSES.has(event.status),
  );

  const activeAttentionEventIds = new Set(
    activeAttention
      .map((item) => item.event_id)
      .filter((eventId): eventId is string => Boolean(eventId)),
  );
  const approvalWithoutAttentionCount = pendingApprovals.filter(
    (approval) =>
      !approval.event_id || !activeAttentionEventIds.has(approval.event_id),
  ).length;
  const escalationWithoutAttentionCount = humanEscalations.filter(
    (event) => !activeAttentionEventIds.has(event.id),
  ).length;
  const actionableCount =
    activeAttention.length +
    approvalWithoutAttentionCount +
    escalationWithoutAttentionCount;

  const priorityItems: DailyManagerBriefPriorityItem[] = [];
  const addPriorityItem = (
    kind: DailyManagerBriefItemKind,
    count: number,
    label: string,
    priority: RestaurantSeverity,
  ) => {
    if (count > 0) priorityItems.push({ kind, count, label, priority });
  };

  addPriorityItem(
    "high_human_escalations",
    highHumanEscalations.length,
    `${pluralize(highHumanEscalations.length, "high-priority human escalation")} awaiting follow-up`,
    "critical",
  );
  addPriorityItem(
    "high_priority_attention",
    highPriorityAttentionOutsideEscalations.length,
    `${pluralize(highPriorityAttentionOutsideEscalations.length, "high-priority item")} in the attention queue`,
    "high",
  );
  addPriorityItem(
    "pending_approvals",
    pendingApprovals.length,
    `${pluralize(pendingApprovals.length, "approval")} waiting for a decision`,
    "medium",
  );
  addPriorityItem(
    "unresolved_complaints",
    unresolvedComplaints.length,
    `${pluralize(unresolvedComplaints.length, "unresolved complaint")} recorded today`,
    "medium",
  );
  const otherAttentionCount =
    activeAttention.length - highPriorityAttention.length;
  addPriorityItem(
    "open_attention",
    otherAttentionCount,
    `${pluralize(otherAttentionCount, "additional attention item")} open`,
    "medium",
  );
  addPriorityItem(
    "reservations_today",
    summary.reservationsToday,
    `${pluralize(summary.reservationsToday, "reservation event")} recorded today`,
    "info",
  );
  addPriorityItem(
    "customer_interactions_today",
    summary.customerInteractions,
    `${pluralize(summary.customerInteractions, "customer interaction")} recorded today`,
    "info",
  );
  addPriorityItem(
    "auto_handled_today",
    summary.handledAutomatically,
    `${pluralize(summary.handledAutomatically, "event")} handled automatically by Nexus`,
    "info",
  );

  const start = Date.parse(input.startsAt);
  const end = Date.parse(input.endsAt);
  const activityToday = input.activity.filter((entry) => {
    const createdAt = Date.parse(entry.created_at);
    return (
      createdAt >= start &&
      createdAt < end &&
      belongsToBranch(entry, input.branchId)
    );
  });
  const managerDecisionCount = activityToday.filter((entry) =>
    ["approval_approved", "approval_edited", "approval_rejected"].includes(
      entry.action,
    ),
  ).length;
  const attentionClosedCount = activityToday.filter((entry) =>
    ["attention_resolved", "attention_dismissed"].includes(entry.action),
  ).length;
  const operationalNotes: string[] = [];
  if (managerDecisionCount > 0) {
    operationalNotes.push(
      `${pluralize(managerDecisionCount, "manager decision")} recorded today.`,
    );
  }
  if (attentionClosedCount > 0) {
    operationalNotes.push(
      `${pluralize(attentionClosedCount, "attention item")} closed today.`,
    );
  }

  if (!input.branchId && highPriorityAttention.length > 0) {
    const branchCounts = new Map<string, number>();
    for (const item of highPriorityAttention) {
      if (!item.branch_id) continue;
      branchCounts.set(item.branch_id, (branchCounts.get(item.branch_id) ?? 0) + 1);
    }
    const busiestBranch = [...branchCounts.entries()].sort(
      ([leftId, leftCount], [rightId, rightCount]) =>
        rightCount - leftCount || leftId.localeCompare(rightId),
    )[0];
    if (busiestBranch) {
      const branchName =
        input.branches.find((branch) => branch.id === busiestBranch[0])?.name ??
        "One branch";
      operationalNotes.push(
        `${branchName} has ${pluralize(busiestBranch[1], "high-priority attention item")}.`,
      );
    }
  }

  const scopeLabel = input.branchId
    ? input.branches.find((branch) => branch.id === input.branchId)?.name ?? "Selected branch"
    : "All branches";

  return {
    source: "deterministic",
    headline:
      actionableCount === 0
        ? "No urgent issues need your attention right now."
        : `${pluralize(actionableCount, "item")} ${actionableCount === 1 ? "needs" : "need"} your attention today.`,
    priorityItems: priorityItems.slice(0, 6),
    attentionCount: summary.openAttentionItems,
    highPriorityAttentionCount: highPriorityAttention.length,
    approvalCount: summary.waitingForApproval,
    escalationCount: summary.humanEscalations,
    handledCount: summary.handledAutomatically,
    eventCount: summary.eventsToday,
    reservationCount: summary.reservationsToday,
    customerInteractionCount: summary.customerInteractions,
    unresolvedComplaintCount: unresolvedComplaints.length,
    actionableCount,
    operationalNotes,
    generatedForDate: input.generatedForDate,
    organizationId: input.organizationId,
    branchId: input.branchId ?? null,
    scopeLabel,
  };
}
