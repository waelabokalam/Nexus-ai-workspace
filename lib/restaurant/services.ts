import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { requireRestaurantAccess } from "@/lib/restaurant/auth";
import {
  activityInputSchema,
  approvalDecisionSchema,
  attentionUpdateSchema,
  classifyRestaurantEvent,
  membershipManagementSchema,
  normalizeRestaurantEvent,
  serializeAttentionUpdate,
  serializeMembershipManagement,
} from "@/lib/restaurant/domain";
import { RestaurantDatabaseError } from "@/lib/restaurant/errors";
import {
  classifyRestaurantReview,
  normalizeRestaurantReview,
} from "@/lib/restaurant/reputation";
import {
  calculateDailyManagerBrief,
  calculateRestaurantSummary,
  isAutomaticallyHandledEvent,
} from "@/lib/restaurant/summary";
import {
  getRestaurantDayWindow,
  getRestaurantLocalDate,
} from "@/lib/restaurant/time";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/lib/supabase/database.types";

const commandCenterRequestSchema = z.object({
  organizationId: z.uuid(),
  branchId: z.uuid().nullable().optional().default(null),
  localDate: z.iso.date().optional(),
});

function throwDatabaseError(
  context: string,
  error: { message: string; code?: string } | null,
) {
  if (error) {
    throw new RestaurantDatabaseError(`${context}: ${error.message}`, error.code);
  }
}

function branchFilter<T extends { or: (filter: string) => T }>(query: T, branchId: string | null) {
  return branchId ? query.or(`branch_id.eq.${branchId},branch_id.is.null`) : query;
}

export async function getRestaurantCommandCenter(
  request: unknown,
  client?: SupabaseClient<Database>,
) {
  const database = client ?? (await createSupabaseServerClient());
  const input = commandCenterRequestSchema.parse(request);
  const { membership, user } = await requireRestaurantAccess(
    input.organizationId,
    undefined,
    database,
  );

  const [organizationResult, branchesResult] = await Promise.all([
    database
      .from("restaurant_organizations")
      .select("*")
      .eq("id", input.organizationId)
      .single(),
    database
      .from("restaurant_branches")
      .select("*")
      .eq("organization_id", input.organizationId)
      .eq("is_active", true)
      .order("name"),
  ]);
  throwDatabaseError("Could not load restaurant", organizationResult.error);
  throwDatabaseError("Could not load restaurant branches", branchesResult.error);
  const organization = organizationResult.data;
  if (!organization) throw new Error("Restaurant organization was not found.");

  const selectedBranch = input.branchId
    ? branchesResult.data?.find((branch) => branch.id === input.branchId)
    : null;
  if (input.branchId && !selectedBranch) {
    throw new Error("The selected branch is not active in this restaurant.");
  }

  const workspaceTimeZone = selectedBranch?.timezone ?? organization.timezone;
  const localDate = input.localDate ?? getRestaurantLocalDate(workspaceTimeZone);
  const { startsAt, endsAt } = getRestaurantDayWindow(localDate, workspaceTimeZone);

  const eventsQuery = branchFilter(
    database
      .from("restaurant_events")
      .select("*")
      .eq("organization_id", input.organizationId)
      .gte("occurred_at", startsAt)
      .lt("occurred_at", endsAt),
    input.branchId,
  ).order("occurred_at", { ascending: false });
  const attentionQuery = branchFilter(
    database
      .from("manager_attention_items")
      .select("*")
      .eq("organization_id", input.organizationId)
      .in("status", ["open", "assigned"]),
    input.branchId,
  ).order("created_at", { ascending: false });
  const approvalsQuery = branchFilter(
    database
      .from("manager_approvals")
      .select("*")
      .eq("organization_id", input.organizationId)
      .eq("status", "pending"),
    input.branchId,
  ).order("requested_at", { ascending: false });
  const activityQuery = branchFilter(
    database
      .from("restaurant_activity_log")
      .select("*")
      .eq("organization_id", input.organizationId),
    input.branchId,
  )
    .order("created_at", { ascending: false })
    .limit(40);
  const reputationStartsAt = new Date(
    Date.parse(endsAt) - 7 * 24 * 60 * 60 * 1_000,
  ).toISOString();
  const reviewsQuery = branchFilter(
    database
      .from("restaurant_reviews")
      .select("*")
      .eq("organization_id", input.organizationId)
      .gte("reviewed_at", reputationStartsAt)
      .lt("reviewed_at", endsAt),
    input.branchId,
  )
    .order("reviewed_at", { ascending: false })
    .limit(50);

  const [eventsResult, attentionResult, approvalsResult, activityResult, reviewsResult] =
    await Promise.all([
      eventsQuery,
      attentionQuery,
      approvalsQuery,
      activityQuery,
      reviewsQuery,
    ]);
  throwDatabaseError("Could not load restaurant events", eventsResult.error);
  throwDatabaseError("Could not load manager attention", attentionResult.error);
  throwDatabaseError("Could not load approvals", approvalsResult.error);
  throwDatabaseError("Could not load activity", activityResult.error);
  throwDatabaseError("Could not load restaurant reviews", reviewsResult.error);

  const events = eventsResult.data ?? [];
  const attentionItems = attentionResult.data ?? [];
  const approvals = approvalsResult.data ?? [];
  const activity = activityResult.data ?? [];
  const reviews = reviewsResult.data ?? [];
  const relatedEventIds = Array.from(
    new Set(
      [...attentionItems, ...approvals]
        .map((item) => item.event_id)
        .filter((eventId): eventId is string => Boolean(eventId)),
    ),
  );
  const relatedEventsResult = relatedEventIds.length
    ? await database
        .from("restaurant_events")
        .select("*")
        .eq("organization_id", input.organizationId)
        .in("id", relatedEventIds)
    : { data: [], error: null };
  throwDatabaseError("Could not load related restaurant events", relatedEventsResult.error);

  return {
    user: { id: user.id, email: user.email ?? null },
    membership,
    organization,
    branches: branchesResult.data ?? [],
    selectedBranchId: input.branchId,
    localDate,
    timeZone: workspaceTimeZone,
    summary: calculateRestaurantSummary({
      events,
      attentionItems,
      approvals,
      startsAt,
      endsAt,
      branchId: input.branchId,
    }),
    dailyBrief: calculateDailyManagerBrief({
      organizationId: input.organizationId,
      generatedForDate: localDate,
      branches: branchesResult.data ?? [],
      events,
      attentionItems,
      approvals,
      activity,
      reviews,
      startsAt,
      endsAt,
      branchId: input.branchId,
    }),
    attentionItems,
    approvals,
    relatedEvents: relatedEventsResult.data ?? [],
    handledEvents: events
      .filter(isAutomaticallyHandledEvent)
      .slice(0, 12),
    activity,
    reviews,
  };
}

export async function ingestRestaurantReview(
  input: unknown,
  clients?: {
    user?: SupabaseClient<Database>;
    service?: SupabaseClient<Database>;
  },
) {
  const userDatabase = clients?.user ?? (await createSupabaseServerClient());
  const review = normalizeRestaurantReview(input);
  const classification = classifyRestaurantReview(review);
  const { user } = await requireRestaurantAccess(
    review.organizationId,
    undefined,
    userDatabase,
  );
  const database = clients?.service ?? createSupabaseServiceRoleClient();
  const { data, error } = await database.rpc("ingest_restaurant_review", {
    p_actor_id: user.id,
    p_organization_id: review.organizationId,
    p_branch_id: review.branchId,
    p_reviewed_at: review.reviewedAt,
    p_source: review.source,
    p_external_review_id: review.externalReviewId,
    p_customer_display_name: review.customerDisplayName,
    p_rating: review.rating,
    p_review_text: review.reviewText,
    p_language: review.language,
    p_sentiment: classification.sentiment,
    p_topics: classification.topics,
    p_severity: classification.severity,
    p_dedupe_key: review.dedupeKey,
    p_proposed_response: classification.proposedResponse,
  });
  throwDatabaseError("Could not ingest restaurant review", error);
  return data;
}

export async function ingestRestaurantEvent(
  input: unknown,
  clients?: {
    user?: SupabaseClient<Database>;
    service?: SupabaseClient<Database>;
  },
) {
  const userDatabase = clients?.user ?? (await createSupabaseServerClient());
  const event = normalizeRestaurantEvent(input);
  const decision = classifyRestaurantEvent(event);
  const { user } = await requireRestaurantAccess(
    event.organizationId,
    undefined,
    userDatabase,
  );
  const database = clients?.service ?? createSupabaseServiceRoleClient();

  const { data, error } = await database.rpc("ingest_restaurant_event", {
    p_actor_id: user.id,
    p_organization_id: event.organizationId,
    p_branch_id: event.branchId,
    p_occurred_at: event.occurredAt,
    p_source: event.source,
    p_event_type: event.eventType,
    p_category: event.category,
    p_title: event.title,
    p_summary: event.summary,
    p_severity: event.severity,
    p_handling_mode: decision.handlingMode,
    p_event_status: decision.status,
    p_source_reference: event.sourceReference,
    p_subject_type: event.subjectType,
    p_subject_id: event.subjectId,
    p_structured_data: event.structuredData,
    p_confidence: event.confidence,
    p_requires_attention: decision.requiresAttention,
    p_dedupe_key: event.dedupeKey,
    p_attention_priority: decision.attentionPriority,
    p_approval_required: decision.approvalRequired,
    p_approval_action_type: decision.approvalActionType,
    p_proposed_action: decision.proposedAction,
  });
  throwDatabaseError("Could not ingest restaurant event", error);
  return data;
}

export async function updateManagerAttentionItem(
  input: unknown,
  client?: SupabaseClient<Database>,
) {
  const database = client ?? (await createSupabaseServerClient());
  const value = attentionUpdateSchema.parse(input);
  await requireRestaurantAccess(value.organizationId, ["owner", "manager"], database);
  const { data, error } = await database.rpc(
    "update_manager_attention_item",
    serializeAttentionUpdate(value),
  );
  throwDatabaseError("Could not update manager attention", error);
  return data;
}

export async function manageRestaurantMember(
  input: unknown,
  client?: SupabaseClient<Database>,
) {
  const database = client ?? (await createSupabaseServerClient());
  const value = membershipManagementSchema.parse(input);
  await requireRestaurantAccess(value.organizationId, ["owner"], database);
  const { data, error } = await database.rpc(
    "manage_restaurant_member",
    serializeMembershipManagement(value),
  );
  throwDatabaseError("Could not manage restaurant member", error);
  return data;
}

export async function processManagerApproval(
  input: unknown,
  client?: SupabaseClient<Database>,
) {
  const database = client ?? (await createSupabaseServerClient());
  const value = approvalDecisionSchema.parse(input);
  await requireRestaurantAccess(value.organizationId, ["owner", "manager"], database);
  const { data, error } = await database.rpc("process_manager_approval", {
    p_organization_id: value.organizationId,
    p_approval_id: value.approvalId,
    p_decision: value.decision,
    p_reviewer_note: value.reviewerNote,
    p_edited_action: value.editedAction,
  });
  throwDatabaseError("Could not process manager approval", error);
  return data;
}

export async function writeRestaurantActivity(
  input: unknown,
  clients?: {
    user?: SupabaseClient<Database>;
    service?: SupabaseClient<Database>;
  },
) {
  const userDatabase = clients?.user ?? (await createSupabaseServerClient());
  const value = activityInputSchema.parse(input);
  const { user } = await requireRestaurantAccess(
    value.organizationId,
    undefined,
    userDatabase,
  );
  const database = clients?.service ?? createSupabaseServiceRoleClient();
  const { data, error } = await database.rpc("write_restaurant_activity", {
    p_actor_id: user.id,
    p_organization_id: value.organizationId,
    p_branch_id: value.branchId,
    p_action: value.action,
    p_entity_type: value.entityType,
    p_entity_id: value.entityId,
    p_description: value.description,
    p_metadata: value.metadata as Json,
  });
  throwDatabaseError("Could not write restaurant activity", error);
  return data;
}
