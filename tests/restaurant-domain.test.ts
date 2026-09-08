import { describe, expect, it } from "vitest";

import {
  activityInputSchema,
  approvalDecisionSchema,
  classifyRestaurantEvent,
  membershipManagementSchema,
  normalizeRestaurantEvent,
  restaurantProposedActionSchema,
  restaurantStructuredDataSchema,
  serializeAttentionUpdate,
  serializeMembershipManagement,
} from "@/lib/restaurant/domain";
import {
  belongsToBranch,
  calculateRestaurantSummary,
} from "@/lib/restaurant/summary";
import {
  getRestaurantDayWindow,
  getRestaurantLocalDate,
} from "@/lib/restaurant/time";
import type {
  ManagerApprovalRow,
  ManagerAttentionItemRow,
  RestaurantEventRow,
} from "@/lib/supabase/database.types";

const organizationId = "10000000-0000-4000-8000-000000000001";
const branchOne = "20000000-0000-4000-8000-000000000001";
const branchTwo = "20000000-0000-4000-8000-000000000002";

function normalizedEvent(overrides: Record<string, unknown> = {}) {
  return normalizeRestaurantEvent(
    {
      organizationId,
      branchId: branchOne,
      source: "demo",
      eventType: "customer_question",
      category: "customer",
      title: "  Opening-hours question  ",
      summary: "  A customer asked when dinner service begins.  ",
      ...overrides,
    },
    new Date("2026-09-08T09:00:00.000Z"),
  );
}

function event(overrides: Partial<RestaurantEventRow> = {}): RestaurantEventRow {
  return {
    id: crypto.randomUUID(),
    organization_id: organizationId,
    branch_id: branchOne,
    created_at: "2026-09-08T09:00:00.000Z",
    occurred_at: "2026-09-08T09:00:00.000Z",
    source: "demo",
    event_type: "customer_question",
    category: "customer",
    title: "Question handled",
    summary: "Nexus answered a routine customer question.",
    severity: "info",
    handling_mode: "auto",
    status: "handled",
    source_reference: null,
    subject_type: null,
    subject_id: null,
    structured_data: {},
    confidence: null,
    requires_attention: false,
    dedupe_key: null,
    updated_at: "2026-09-08T09:00:00.000Z",
    ...overrides,
  };
}

function attention(
  overrides: Partial<ManagerAttentionItemRow> = {},
): ManagerAttentionItemRow {
  return {
    id: crypto.randomUUID(),
    organization_id: organizationId,
    branch_id: branchOne,
    event_id: null,
    title: "Attention",
    summary: "Manager follow-up is needed.",
    priority: "high",
    category: "operations",
    status: "open",
    assigned_to: null,
    due_at: null,
    created_at: "2026-09-08T09:00:00.000Z",
    resolved_at: null,
    updated_at: "2026-09-08T09:00:00.000Z",
    ...overrides,
  };
}

function approval(overrides: Partial<ManagerApprovalRow> = {}): ManagerApprovalRow {
  return {
    id: crypto.randomUUID(),
    organization_id: organizationId,
    branch_id: branchOne,
    event_id: null,
    action_type: "manager_review",
    title: "Review response",
    summary: "Review a proposed response.",
    proposed_action: {},
    status: "pending",
    requested_at: "2026-09-08T09:00:00.000Z",
    reviewed_at: null,
    reviewed_by: null,
    reviewer_note: null,
    updated_at: "2026-09-08T09:00:00.000Z",
    ...overrides,
  };
}

describe("restaurant event normalization", () => {
  it("normalizes text and supplies the ingestion timestamp", () => {
    const result = normalizedEvent();

    expect(result.title).toBe("Opening-hours question");
    expect(result.summary).toBe("A customer asked when dinner service begins.");
    expect(result.occurredAt).toBe("2026-09-08T09:00:00.000Z");
    expect(result.severity).toBe("info");
    expect(result.structuredData).toEqual({});
  });

  it("rejects invalid IDs, arbitrary severity, and non-snake-case event types", () => {
    expect(() =>
      normalizedEvent({ organizationId: "other-restaurant", severity: "urgent" }),
    ).toThrow();
    expect(() => normalizedEvent({ eventType: "Complaint Received" })).toThrow();
  });

  it("rejects malformed, unknown, and oversized structured payloads", () => {
    expect(() => normalizedEvent({ structuredData: { raw_prompt: "secret" } })).toThrow();
    expect(() =>
      normalizedEvent({ structuredData: { party_size: 1.5 } }),
    ).toThrow();
    expect(() =>
      restaurantStructuredDataSchema.parse({
        proposed_action: { message: "€".repeat(4_000) },
      }),
    ).toThrow("8192 bytes");
  });

  it("accepts bounded approval payloads and rejects invalid fields", () => {
    expect(
      restaurantProposedActionSchema.parse({
        message: "x".repeat(4_000),
        requested_time: "2026-09-08T18:30:00+03:00",
        amount: 1_000_000,
        currency: "TRY",
      }),
    ).toMatchObject({ amount: 1_000_000, currency: "TRY" });
    expect(() =>
      restaurantProposedActionSchema.parse({ message: "x".repeat(4_001) }),
    ).toThrow();
    expect(() =>
      restaurantProposedActionSchema.parse({ requested_time: "tomorrow evening" }),
    ).toThrow();
    expect(() => restaurantProposedActionSchema.parse({ amount: Infinity })).toThrow();
    expect(() => restaurantProposedActionSchema.parse({ currency: "try" })).toThrow();
  });
});

describe("restaurant V1 deterministic rules", () => {
  it("automatically handles safe customer questions", () => {
    expect(classifyRestaurantEvent(normalizedEvent())).toEqual({
      handlingMode: "auto",
      status: "handled",
      requiresAttention: false,
      attentionPriority: null,
      approvalRequired: false,
      approvalActionType: null,
      proposedAction: {},
    });
  });

  it("creates manager attention and approval for an ordinary complaint", () => {
    expect(
      classifyRestaurantEvent(
        normalizedEvent({
          eventType: "complaint",
          category: "reputation",
          severity: "medium",
          structuredData: {
            action_type: "customer_response",
            proposed_action: { message: "We are sorry." },
          },
        }),
      ),
    ).toMatchObject({
      handlingMode: "approval",
      status: "waiting_approval",
      requiresAttention: true,
      attentionPriority: "medium",
      approvalRequired: true,
      approvalActionType: "customer_response",
      proposedAction: { message: "We are sorry." },
    });
  });

  it("escalates serious complaints to a human without creating approval work", () => {
    expect(
      classifyRestaurantEvent(
        normalizedEvent({
          eventType: "complaint",
          category: "reputation",
          severity: "critical",
        }),
      ),
    ).toMatchObject({
      handlingMode: "human",
      status: "escalated",
      requiresAttention: true,
      attentionPriority: "critical",
      approvalRequired: false,
    });
  });

  it("never lowers an explicit human handling request", () => {
    expect(
      classifyRestaurantEvent(
        normalizedEvent({ requestedHandlingMode: "human", severity: "low" }),
      ),
    ).toMatchObject({ handlingMode: "human", status: "escalated", attentionPriority: "high" });
  });

  it.each([
    ["customer_handoff", "low"],
    ["manager_task", "medium"],
    ["operational_alert", "info"],
    ["complaint", "high"],
  ] as const)("routes %s at %s severity to a human", (eventType, severity) => {
    expect(
      classifyRestaurantEvent(normalizedEvent({ eventType, severity })),
    ).toMatchObject({
      handlingMode: "human",
      status: "escalated",
      requiresAttention: true,
      approvalRequired: false,
    });
  });

  it.each([
    { requestedHandlingMode: "approval" },
    { eventType: "approval_requested" },
    { eventType: "complaint", severity: "low" },
    { eventType: "review_received", severity: "medium" },
  ])("routes each approval rule to manager approval: $eventType", (overrides) => {
    expect(classifyRestaurantEvent(normalizedEvent(overrides))).toMatchObject({
      handlingMode: "approval",
      status: "waiting_approval",
      requiresAttention: true,
      approvalRequired: true,
      approvalActionType: "manager_review",
    });
  });

  it("keeps low-severity reviews in the safe automatic branch", () => {
    expect(
      classifyRestaurantEvent(
        normalizedEvent({ eventType: "review_received", severity: "low" }),
      ),
    ).toMatchObject({ handlingMode: "auto", status: "handled" });
  });

  it("requires replacement content for an edited approval", () => {
    expect(() =>
      approvalDecisionSchema.parse({
        organizationId,
        approvalId: "30000000-0000-4000-8000-000000000001",
        decision: "edited",
      }),
    ).toThrow();
    expect(() =>
      approvalDecisionSchema.parse({
        organizationId,
        approvalId: "30000000-0000-4000-8000-000000000001",
        decision: "approved",
        editedAction: { message: "Unexpected replacement" },
      }),
    ).toThrow();
  });

  it("validates bounded explicit activity data", () => {
    expect(() =>
      activityInputSchema.parse({
        organizationId,
        action: "manager_note_added",
        entityType: "restaurant_event",
        description: "x".repeat(2_001),
      }),
    ).toThrow();
    expect(() =>
      activityInputSchema.parse({
        organizationId,
        action: "manager_note_added",
        entityType: "restaurant_event",
        description: "Valid note",
        metadata: { unexpected: true },
      }),
    ).toThrow();
  });
});

describe("restaurant RPC serialization", () => {
  const attentionId = "30000000-0000-4000-8000-000000000001";

  it("distinguishes omitted, cleared, and supplied assignees", () => {
    expect(
      serializeAttentionUpdate({ organizationId, attentionId, status: "resolved" }),
    ).toMatchObject({ p_assigned_to: null, p_assigned_to_is_set: false });
    expect(
      serializeAttentionUpdate({
        organizationId,
        attentionId,
        status: "open",
        assignedTo: null,
      }),
    ).toMatchObject({ p_assigned_to: null, p_assigned_to_is_set: true });
    expect(
      serializeAttentionUpdate({
        organizationId,
        attentionId,
        status: "assigned",
        assignedTo: branchOne,
      }),
    ).toMatchObject({ p_assigned_to: branchOne, p_assigned_to_is_set: true });
  });

  it("serializes only valid owner membership operations", () => {
    const parsed = membershipManagementSchema.parse({
      organizationId,
      userId: branchOne,
      operation: "upsert",
      role: "manager",
    });
    expect(serializeMembershipManagement(parsed)).toEqual({
      p_organization_id: organizationId,
      p_user_id: branchOne,
      p_operation: "upsert",
      p_role: "manager",
    });
    expect(() =>
      membershipManagementSchema.parse({
        organizationId,
        userId: branchOne,
        operation: "upsert",
      }),
    ).toThrow();
    expect(() =>
      membershipManagementSchema.parse({
        organizationId,
        userId: branchOne,
        operation: "remove",
        role: "staff",
      }),
    ).toThrow();
  });
});

describe("branch filtering and deterministic summary", () => {
  it("derives today's date in the restaurant timezone", () => {
    const instant = new Date("2026-09-08T21:30:00.000Z");
    expect(getRestaurantLocalDate("Europe/Istanbul", instant)).toBe("2026-09-09");
    expect(getRestaurantLocalDate("America/New_York", instant)).toBe("2026-09-08");
  });

  it("uses the restaurant timezone, including daylight-saving day length", () => {
    expect(getRestaurantDayWindow("2026-09-08", "Europe/Istanbul")).toEqual({
      startsAt: "2026-09-07T21:00:00.000Z",
      endsAt: "2026-09-08T21:00:00.000Z",
    });
    expect(getRestaurantDayWindow("2026-03-29", "Europe/Copenhagen")).toEqual({
      startsAt: "2026-03-28T23:00:00.000Z",
      endsAt: "2026-03-29T22:00:00.000Z",
    });
    expect(getRestaurantDayWindow("2026-09-06", "America/Santiago")).toEqual({
      startsAt: "2026-09-06T04:00:00.000Z",
      endsAt: "2026-09-07T03:00:00.000Z",
    });
  });

  it("includes organization-wide records in a selected branch", () => {
    expect(belongsToBranch({ branch_id: null }, branchOne)).toBe(true);
    expect(belongsToBranch({ branch_id: branchOne }, branchOne)).toBe(true);
    expect(belongsToBranch({ branch_id: branchTwo }, branchOne)).toBe(false);
  });

  it("calculates today's metrics from persisted record shapes", () => {
    const summary = calculateRestaurantSummary({
      startsAt: "2026-09-08T00:00:00.000Z",
      endsAt: "2026-09-09T00:00:00.000Z",
      branchId: branchOne,
      events: [
        event(),
        event({
          branch_id: null,
          event_type: "reservation_request",
          category: "reservations",
          handling_mode: "approval",
          status: "waiting_approval",
        }),
        event({
          branch_id: branchOne,
          event_type: "customer_handoff",
          handling_mode: "human",
          status: "escalated",
        }),
        event({ branch_id: branchTwo }),
        event({ occurred_at: "2026-09-07T23:59:59.000Z" }),
      ],
      attentionItems: [
        attention(),
        attention({ branch_id: null, status: "assigned" }),
        attention({ branch_id: branchTwo }),
        attention({ status: "resolved" }),
      ],
      approvals: [approval(), approval({ branch_id: branchTwo })],
    });

    expect(summary).toEqual({
      eventsToday: 3,
      handledAutomatically: 1,
      waitingForApproval: 1,
      openAttentionItems: 2,
      humanEscalations: 1,
      reservationsToday: 1,
      customerInteractions: 2,
    });
  });

  it("rejects an invalid summary window", () => {
    expect(() =>
      calculateRestaurantSummary({
        startsAt: "2026-09-09T00:00:00.000Z",
        endsAt: "2026-09-08T00:00:00.000Z",
        events: [],
        attentionItems: [],
        approvals: [],
      }),
    ).toThrow("increasing summary time window");
  });

  it("uses half-open boundaries and excludes nonmatching statuses", () => {
    const summary = calculateRestaurantSummary({
      startsAt: "2026-09-08T00:00:00.000Z",
      endsAt: "2026-09-09T00:00:00.000Z",
      events: [
        event({ occurred_at: "2026-09-08T00:00:00.000Z" }),
        event({ occurred_at: "2026-09-09T00:00:00.000Z" }),
        event({ handling_mode: "auto", status: "failed" }),
        event({ handling_mode: "human", status: "handled" }),
      ],
      attentionItems: [attention({ status: "dismissed" })],
      approvals: [approval({ status: "rejected" })],
    });
    expect(summary).toEqual({
      eventsToday: 3,
      handledAutomatically: 1,
      waitingForApproval: 0,
      openAttentionItems: 0,
      humanEscalations: 0,
      reservationsToday: 0,
      customerInteractions: 3,
    });
  });
});
