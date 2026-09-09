import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { requireRestaurantAccess } from "@/lib/restaurant/auth";
import { throwRestaurantDatabaseError } from "@/lib/restaurant/core/data-access";
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
import { createSupabaseServiceRoleClient } from "@/lib/supabase/admin";
import type { Database, Json } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
  throwRestaurantDatabaseError("Could not ingest restaurant event", error);
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
  throwRestaurantDatabaseError("Could not update manager attention", error);
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
  throwRestaurantDatabaseError("Could not manage restaurant member", error);
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
  throwRestaurantDatabaseError("Could not process manager approval", error);
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
  throwRestaurantDatabaseError("Could not write restaurant activity", error);
  return data;
}
