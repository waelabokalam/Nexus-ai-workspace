import type {
  ManagerApprovalRow,
  ManagerAttentionItemRow,
  RestaurantEventRow,
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

type SummaryInput = {
  events: RestaurantEventRow[];
  attentionItems: ManagerAttentionItemRow[];
  approvals: ManagerApprovalRow[];
  startsAt: string;
  endsAt: string;
  branchId?: string | null;
};

export function belongsToBranch(
  row: { branch_id: string | null },
  branchId?: string | null,
) {
  return !branchId || row.branch_id === null || row.branch_id === branchId;
}

export function calculateRestaurantSummary(input: SummaryInput): RestaurantSummary {
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

  return {
    eventsToday: events.length,
    handledAutomatically: events.filter(
      (event) => event.handling_mode === "auto" && event.status === "handled",
    ).length,
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
