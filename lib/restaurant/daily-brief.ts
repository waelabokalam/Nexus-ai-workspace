import type {
  RestaurantActivityRow,
  RestaurantBranchRow,
  RestaurantReviewRow,
  RestaurantSeverity,
  RestaurantSupplierInvoiceItemRow,
  RestaurantSupplierInvoiceRow,
} from "@/lib/supabase/database.types";
import { getSupplierInvoiceBriefFacts } from "@/lib/restaurant/invoices/brief-facts";
import {
  getReputationBriefFacts,
  type ReputationBriefFacts,
} from "@/lib/restaurant/reputation/brief-facts";
import {
  belongsToBranch,
  selectOperationalRows,
  summarizeOperationalRows,
  type RestaurantSummaryInput,
} from "@/lib/restaurant/summary";

export type DailyManagerBriefItemKind =
  | "high_human_escalations"
  | "high_priority_attention"
  | "pending_approvals"
  | "serious_reputation_issues"
  | "negative_reviews"
  | "reputation_topic_trend"
  | "supplier_invoices_need_review"
  | "supplier_price_increases"
  | "supplier_invoice_mismatches"
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
  negativeReviewCount: number;
  seriousReputationCount: number;
  repeatedNegativeTopics: ReputationBriefFacts["repeatedNegativeTopics"];
  supplierInvoiceReviewCount: number;
  supplierInvoiceMismatchCount: number;
  materialSupplierIncreaseCount: number;
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
  reviews?: RestaurantReviewRow[];
  invoices?: RestaurantSupplierInvoiceRow[];
  invoiceItems?: RestaurantSupplierInvoiceItemRow[];
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

export function calculateDailyManagerBrief(
  input: DailyManagerBriefInput,
): DailyManagerBrief {
  const rows = selectOperationalRows(input);
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
  const reputationFacts = getReputationBriefFacts({
    reviews: input.reviews ?? [],
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    branchId: input.branchId,
  });
  const invoiceFacts = getSupplierInvoiceBriefFacts({
    invoices: input.invoices ?? [],
    invoiceItems: input.invoiceItems ?? [],
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    branchId: input.branchId,
  });
  const highHumanEscalationsOutsideReputation = highHumanEscalations.filter(
    (event) =>
      !reputationFacts.seriousReviewEventIds.has(event.id) &&
      !invoiceFacts.supplierInvoiceEventIds.has(event.id),
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
    "serious_reputation_issues",
    reputationFacts.seriousReputationCount,
    `${pluralize(reputationFacts.seriousReputationCount, "serious reputation issue")} ${reputationFacts.seriousReputationCount === 1 ? "was" : "were"} routed to human review`,
    "critical",
  );
  addPriorityItem(
    "supplier_invoices_need_review",
    invoiceFacts.supplierInvoiceReviewCount,
    `${pluralize(invoiceFacts.supplierInvoiceReviewCount, "supplier invoice")} ${invoiceFacts.supplierInvoiceReviewCount === 1 ? "needs" : "need"} review`,
    "high",
  );
  addPriorityItem(
    "supplier_price_increases",
    invoiceFacts.materialSupplierIncreaseCount,
    `${pluralize(invoiceFacts.materialSupplierIncreaseCount, "supplier item")} increased materially`,
    "high",
  );
  addPriorityItem(
    "supplier_invoice_mismatches",
    invoiceFacts.supplierInvoiceMismatchCount,
    `${pluralize(invoiceFacts.supplierInvoiceMismatchCount, "invoice total")} ${invoiceFacts.supplierInvoiceMismatchCount === 1 ? "has" : "have"} a mismatch`,
    "high",
  );
  addPriorityItem(
    "high_human_escalations",
    highHumanEscalationsOutsideReputation.length,
    `${pluralize(highHumanEscalationsOutsideReputation.length, "high-priority human escalation")} awaiting follow-up`,
    "critical",
  );
  addPriorityItem(
    "high_priority_attention",
    highPriorityAttentionOutsideEscalations.length,
    `${pluralize(highPriorityAttentionOutsideEscalations.length, "high-priority item")} in the attention queue`,
    "high",
  );
  addPriorityItem(
    "negative_reviews",
    reputationFacts.negativeReviewCount,
    `${pluralize(reputationFacts.negativeReviewCount, "negative review")} ${reputationFacts.negativeReviewCount === 1 ? "was" : "were"} recorded today`,
    "high",
  );
  const leadingReputationTrend = reputationFacts.repeatedNegativeTopics[0];
  addPriorityItem(
    "reputation_topic_trend",
    leadingReputationTrend?.count ?? 0,
    leadingReputationTrend
      ? `${leadingReputationTrend.topic.replaceAll("_", " ")} was mentioned negatively ${leadingReputationTrend.count} times in the last 7 days`
      : "",
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
    `${pluralize(summary.handledAutomatically, "event")} handled automatically by TQEN`,
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
    negativeReviewCount: reputationFacts.negativeReviewCount,
    seriousReputationCount: reputationFacts.seriousReputationCount,
    repeatedNegativeTopics: reputationFacts.repeatedNegativeTopics,
    supplierInvoiceReviewCount: invoiceFacts.supplierInvoiceReviewCount,
    supplierInvoiceMismatchCount: invoiceFacts.supplierInvoiceMismatchCount,
    materialSupplierIncreaseCount: invoiceFacts.materialSupplierIncreaseCount,
    actionableCount,
    operationalNotes,
    generatedForDate: input.generatedForDate,
    organizationId: input.organizationId,
    branchId: input.branchId ?? null,
    scopeLabel,
  };
}
