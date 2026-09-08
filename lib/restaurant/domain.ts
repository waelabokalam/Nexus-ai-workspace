import { z } from "zod";

import type {
  Database,
  Json,
  RestaurantMemberRole,
  RestaurantEventStatus,
  RestaurantHandlingMode,
  RestaurantSeverity,
} from "@/lib/supabase/database.types";

const slug = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z][a-z0-9_]*$/, "Use a lowercase snake_case identifier.");

export const restaurantSeveritySchema = z.enum([
  "info",
  "low",
  "medium",
  "high",
  "critical",
]);
export const restaurantHandlingModeSchema = z.enum(["auto", "approval", "human"]);
export const restaurantCategorySchema = z.enum([
  "customer",
  "reservations",
  "reputation",
  "operations",
  "sales",
  "system",
]);

export const restaurantApprovalActionTypeSchema = z.enum([
  "manager_review",
  "customer_response",
  "reservation_change",
  "reservation_cancellation",
  "refund",
  "compensation",
]);

const restaurantActionChannelSchema = z.enum([
  "web_chat",
  "email",
  "sms",
  "phone",
  "internal",
]);

const boundedObject = <T extends z.ZodRawShape>(shape: T, maxBytes: number) =>
  z
    .strictObject(shape)
    .refine(
      (value) => new TextEncoder().encode(JSON.stringify(value)).byteLength <= maxBytes,
      `JSON payload must not exceed ${maxBytes} bytes.`,
    );

export const restaurantProposedActionSchema = boundedObject(
  {
    channel: restaurantActionChannelSchema.optional(),
    message: z.string().trim().min(1).max(4_000).optional(),
    tone: z.enum(["warm", "neutral", "concise", "apologetic"]).optional(),
    offer: z
      .enum(["none", "dessert_on_next_visit", "discount", "refund"])
      .optional(),
    reservation_id: z.string().trim().min(1).max(240).optional(),
    requested_time: z.iso.datetime({ offset: true }).optional(),
    reason: z.string().trim().min(1).max(500).optional(),
    amount: z.number().finite().min(0).max(1_000_000).optional(),
    currency: z.string().regex(/^[A-Z]{3}$/).optional(),
  },
  8_192,
);

export const restaurantStructuredDataSchema = boundedObject(
  {
    channel: restaurantActionChannelSchema.optional(),
    demo: z.boolean().optional(),
    allergen: z.string().trim().min(1).max(120).optional(),
    party_size: z.number().int().min(1).max(100).optional(),
    guest_reference: z.string().trim().min(1).max(240).optional(),
    language: z.string().trim().min(2).max(35).optional(),
    action_type: restaurantApprovalActionTypeSchema.optional(),
    proposed_action: restaurantProposedActionSchema.optional(),
  },
  12_288,
);

export const normalizedRestaurantEventSchema = z.object({
  organizationId: z.uuid(),
  branchId: z.uuid().nullable().optional().default(null),
  occurredAt: z.iso.datetime({ offset: true }).optional(),
  source: slug,
  eventType: slug,
  category: restaurantCategorySchema,
  title: z.string().trim().min(1).max(180),
  summary: z.string().trim().min(1).max(2_000),
  severity: restaurantSeveritySchema.optional().default("info"),
  requestedHandlingMode: restaurantHandlingModeSchema.optional(),
  sourceReference: z.string().trim().min(1).max(240).nullable().optional().default(null),
  subjectType: slug.nullable().optional().default(null),
  subjectId: z.string().trim().min(1).max(240).nullable().optional().default(null),
  structuredData: restaurantStructuredDataSchema.optional().default({}),
  confidence: z.number().min(0).max(1).nullable().optional().default(null),
  dedupeKey: z.string().trim().min(1).max(240).nullable().optional().default(null),
});

export type NormalizedRestaurantEvent = Omit<
  z.infer<typeof normalizedRestaurantEventSchema>,
  "occurredAt"
> & { occurredAt: string };

export type RestaurantRuleDecision = {
  handlingMode: RestaurantHandlingMode;
  status: RestaurantEventStatus;
  requiresAttention: boolean;
  attentionPriority: RestaurantSeverity | null;
  approvalRequired: boolean;
  approvalActionType: string | null;
  proposedAction: Json;
};

export function normalizeRestaurantEvent(
  value: unknown,
  now: Date = new Date(),
): NormalizedRestaurantEvent {
  const event = normalizedRestaurantEventSchema.parse(value);
  return {
    ...event,
    occurredAt: event.occurredAt ?? now.toISOString(),
  };
}

const severityRank: Record<RestaurantSeverity, number> = {
  info: 0,
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

function atLeast(severity: RestaurantSeverity, threshold: RestaurantSeverity) {
  return severityRank[severity] >= severityRank[threshold];
}

function proposedAction(event: NormalizedRestaurantEvent): Json {
  const value = event.structuredData.proposed_action;
  return value === undefined ? {} : value;
}

export function classifyRestaurantEvent(
  event: NormalizedRestaurantEvent,
): RestaurantRuleDecision {
  if (event.requestedHandlingMode === "human") {
    return {
      handlingMode: "human",
      status: "escalated",
      requiresAttention: true,
      attentionPriority: atLeast(event.severity, "high") ? event.severity : "high",
      approvalRequired: false,
      approvalActionType: null,
      proposedAction: {},
    };
  }

  const requiresHuman =
    event.eventType === "customer_handoff" ||
    event.eventType === "manager_task" ||
    event.eventType === "operational_alert" ||
    (event.eventType === "complaint" && atLeast(event.severity, "high"));

  if (requiresHuman) {
    return {
      handlingMode: "human",
      status: "escalated",
      requiresAttention: true,
      attentionPriority: atLeast(event.severity, "high") ? event.severity : "high",
      approvalRequired: false,
      approvalActionType: null,
      proposedAction: {},
    };
  }

  const requiresApproval =
    event.requestedHandlingMode === "approval" ||
    event.eventType === "approval_requested" ||
    event.eventType === "complaint" ||
    (event.eventType === "review_received" && atLeast(event.severity, "medium"));

  if (requiresApproval) {
    return {
      handlingMode: "approval",
      status: "waiting_approval",
      requiresAttention: true,
      attentionPriority: atLeast(event.severity, "medium") ? event.severity : "medium",
      approvalRequired: true,
      approvalActionType: event.structuredData.action_type ?? "manager_review",
      proposedAction: proposedAction(event),
    };
  }

  return {
    handlingMode: "auto",
    status: "handled",
    requiresAttention: false,
    attentionPriority: null,
    approvalRequired: false,
    approvalActionType: null,
    proposedAction: {},
  };
}

export const attentionUpdateSchema = z.object({
  organizationId: z.uuid(),
  attentionId: z.uuid(),
  status: z.enum(["open", "assigned", "resolved", "dismissed"]),
  assignedTo: z.uuid().nullable().optional(),
});

export function serializeAttentionUpdate(
  input: z.infer<typeof attentionUpdateSchema>,
): Database["public"]["Functions"]["update_manager_attention_item"]["Args"] {
  return {
    p_organization_id: input.organizationId,
    p_attention_id: input.attentionId,
    p_status: input.status,
    p_assigned_to: input.assignedTo ?? null,
    p_assigned_to_is_set: Object.hasOwn(input, "assignedTo"),
  };
}

export const membershipManagementSchema = z
  .object({
    organizationId: z.uuid(),
    userId: z.uuid(),
    operation: z.enum(["upsert", "remove"]),
    role: z.enum(["owner", "manager", "staff"]).nullable().optional(),
  })
  .superRefine((value, context) => {
    if (value.operation === "upsert" && !value.role) {
      context.addIssue({
        code: "custom",
        path: ["role"],
        message: "Adding or updating a member requires a role.",
      });
    }
    if (value.operation === "remove" && value.role != null) {
      context.addIssue({
        code: "custom",
        path: ["role"],
        message: "Removing a member does not accept a role.",
      });
    }
  });

export type MembershipManagementInput = z.infer<
  typeof membershipManagementSchema
>;

export function serializeMembershipManagement(
  input: MembershipManagementInput,
): Database["public"]["Functions"]["manage_restaurant_member"]["Args"] {
  return {
    p_organization_id: input.organizationId,
    p_user_id: input.userId,
    p_operation: input.operation,
    p_role: (input.role ?? null) as RestaurantMemberRole | null,
  };
}

export const approvalDecisionSchema = z
  .object({
    organizationId: z.uuid(),
    approvalId: z.uuid(),
    decision: z.enum(["approved", "edited", "rejected"]),
    reviewerNote: z.string().trim().max(2_000).nullable().optional().default(null),
    editedAction: restaurantProposedActionSchema.nullable().optional().default(null),
  })
  .superRefine((value, context) => {
    if (value.decision === "edited" && !value.editedAction) {
      context.addIssue({
        code: "custom",
        path: ["editedAction"],
        message: "An edited approval requires the replacement proposed action.",
      });
    }
    if (value.decision !== "edited" && value.editedAction !== null) {
      context.addIssue({
        code: "custom",
        path: ["editedAction"],
        message: "Only an edited approval may replace the proposed action.",
      });
    }
  });

export const activityInputSchema = z.object({
  organizationId: z.uuid(),
  branchId: z.uuid().nullable().optional().default(null),
  action: z.enum([
    "manager_note_added",
    "restaurant_settings_updated",
    "branch_settings_updated",
  ]),
  entityType: z.enum([
    "restaurant_organization",
    "restaurant_branch",
    "restaurant_event",
    "manager_attention_item",
    "manager_approval",
  ]),
  entityId: z.uuid().nullable().optional().default(null),
  description: z.string().trim().min(1).max(2_000),
  metadata: boundedObject(
    {
      reason: z.string().trim().min(1).max(500).optional(),
      source: z.enum(["manager_command_center", "settings"]).optional(),
    },
    2_048,
  )
    .optional()
    .default({}),
});
