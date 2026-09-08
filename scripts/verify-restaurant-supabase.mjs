import assert from "node:assert/strict";
import fs from "node:fs";

import { createClient } from "@supabase/supabase-js";

const organizationId = "10000000-0000-4000-8000-000000000001";
const centralBranchId = "20000000-0000-4000-8000-000000000001";
const marinaBranchId = "20000000-0000-4000-8000-000000000002";
const isolationOrganizationId = "90000000-0000-4000-8000-000000000001";
const isolationBranchId = "90000000-0000-4000-8000-000000000002";

function parseEnvironment(path) {
  return Object.fromEntries(
    fs
      .readFileSync(path, "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator), line.slice(separator + 1)];
      }),
  );
}

function expectSuccess(result, context) {
  assert.equal(result.error, null, `${context}: ${result.error?.message ?? "unknown error"}`);
  return result.data;
}

function expectDenied(result, context) {
  assert.ok(result.error, `${context}: operation unexpectedly succeeded`);
}

const environment = parseEnvironment(process.env.NEXUS_RESTAURANT_ENV ?? ".env.local");
const fixturePath =
  process.env.NEXUS_RESTAURANT_AUTH_FIXTURES ?? "/tmp/nexus-restaurant-v1-auth.json";
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

assert.equal(fixture.projectRef, "ovloyniqxpuqkwrpoafp", "Auth fixtures target the wrong project");
assert.match(environment.NEXT_PUBLIC_SUPABASE_URL, /ovloyniqxpuqkwrpoafp\.supabase\.co$/);
assert.ok(environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, "Publishable key is missing");
assert.ok(environment.SUPABASE_SERVICE_ROLE_KEY, "Server secret is missing");

const service = createClient(
  environment.NEXT_PUBLIC_SUPABASE_URL,
  environment.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

async function authenticatedClient(role) {
  const user = fixture.users.find((candidate) => candidate.role === role);
  assert.ok(user, `Missing ${role} Auth fixture`);
  const client = createClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const signedIn = await client.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  });
  expectSuccess(signedIn, `${role} authentication`);
  assert.equal(signedIn.data.user.id, user.id, `${role} authenticated as the wrong user`);
  return { client, user };
}

const owner = await authenticatedClient("owner");
const manager = await authenticatedClient("manager");
const staff = await authenticatedClient("staff");
const outsider = await authenticatedClient("outsider");

const seededMembership = expectSuccess(
  await owner.client
    .from("restaurant_members")
    .select("user_id,role")
    .eq("organization_id", organizationId),
  "load seeded owner membership",
);
assert.ok(
  seededMembership.some(
    (membership) => membership.user_id === owner.user.id && membership.role === "owner",
  ),
  "Seeded owner membership is missing",
);

async function ensureMember(userId, role) {
  const existing = expectSuccess(
    await service
      .from("restaurant_members")
      .select("role")
      .eq("organization_id", organizationId)
      .eq("user_id", userId)
      .maybeSingle(),
    `inspect ${role} membership`,
  );
  if (existing?.role === role) return;
  expectSuccess(
    await owner.client.rpc("manage_restaurant_member", {
      p_organization_id: organizationId,
      p_user_id: userId,
      p_operation: "upsert",
      p_role: role,
    }),
    `create ${role} membership`,
  );
}

await ensureMember(manager.user.id, "manager");
await ensureMember(staff.user.id, "staff");

const branches = expectSuccess(
  await owner.client
    .from("restaurant_branches")
    .select("id,name")
    .eq("organization_id", organizationId)
    .order("id"),
  "load seeded branches",
);
assert.equal(branches.length, 2, "Seed must persist two branches");
assert.deepEqual(
  branches.map(({ id }) => id),
  [centralBranchId, marinaBranchId],
  "Unexpected branch fixture",
);

expectSuccess(
  await service.from("restaurant_organizations").upsert({
    id: isolationOrganizationId,
    name: "Nexus Restaurant V1 Isolation Fixture",
    slug: "nexus-restaurant-v1-isolation-fixture",
    timezone: "UTC",
    default_currency: "USD",
    default_locale: "en",
  }),
  "persist isolation organization",
);
expectSuccess(
  await service.from("restaurant_branches").upsert({
    id: isolationBranchId,
    organization_id: isolationOrganizationId,
    name: "Hidden Branch",
    timezone: "UTC",
    is_active: true,
  }),
  "persist isolation branch",
);

for (const actor of [owner, manager, staff]) {
  const visibleOrganizations = expectSuccess(
    await actor.client.from("restaurant_organizations").select("id"),
    `${actor.user.role} organization visibility`,
  );
  assert.deepEqual(visibleOrganizations, [{ id: organizationId }]);
}
assert.deepEqual(
  expectSuccess(
    await outsider.client.from("restaurant_organizations").select("id"),
    "outsider organization visibility",
  ),
  [],
);
assert.deepEqual(
  expectSuccess(
    await outsider.client.from("restaurant_events").select("id"),
    "outsider event visibility",
  ),
  [],
);

expectDenied(
  await manager.client.rpc("manage_restaurant_member", {
    p_organization_id: organizationId,
    p_user_id: outsider.user.id,
    p_operation: "upsert",
    p_role: "staff",
  }),
  "manager member administration",
);
expectDenied(
  await owner.client.rpc("manage_restaurant_member", {
    p_organization_id: organizationId,
    p_user_id: owner.user.id,
    p_operation: "remove",
    p_role: null,
  }),
  "last-owner removal",
);
expectDenied(
  await owner.client.rpc("manage_restaurant_member", {
    p_organization_id: organizationId,
    p_user_id: owner.user.id,
    p_operation: "upsert",
    p_role: "manager",
  }),
  "last-owner demotion",
);

const runId = `live-${Date.now()}`;
const occurredAt = new Date().toISOString();

function ingestionInput({
  suffix,
  branchId,
  title,
  handlingMode,
  eventStatus,
  severity,
  attentionPriority,
  approvalRequired = false,
  proposedAction = {},
}) {
  return {
    p_actor_id: owner.user.id,
    p_organization_id: organizationId,
    p_branch_id: branchId,
    p_occurred_at: occurredAt,
    p_source: "nexus_agent",
    p_event_type: handlingMode === "human" ? "customer_handoff" : "customer_question",
    p_category: "customer",
    p_title: title,
    p_summary: `Persisted Supabase verification ${suffix}.`,
    p_severity: severity,
    p_handling_mode: handlingMode,
    p_event_status: eventStatus,
    p_source_reference: `${runId}:${suffix}:source`,
    p_subject_type: null,
    p_subject_id: null,
    p_structured_data: approvalRequired
      ? { channel: "email", action_type: "customer_response", proposed_action: proposedAction }
      : { channel: "web_chat" },
    p_confidence: 0.99,
    p_requires_attention: handlingMode !== "auto",
    p_dedupe_key: `${runId}:${suffix}`,
    p_attention_priority: attentionPriority,
    p_approval_required: approvalRequired,
    p_approval_action_type: approvalRequired ? "customer_response" : null,
    p_proposed_action: proposedAction,
  };
}

const autoInput = ingestionInput({
  suffix: "auto",
  branchId: centralBranchId,
  title: "Live AUTO verification",
  handlingMode: "auto",
  eventStatus: "handled",
  severity: "info",
  attentionPriority: null,
});
expectDenied(await owner.client.rpc("ingest_restaurant_event", autoInput), "browser-side ingestion");
expectDenied(
  await service.rpc("ingest_restaurant_event", {
    ...autoInput,
    p_actor_id: outsider.user.id,
    p_dedupe_key: `${runId}:unauthorized-actor`,
    p_source_reference: `${runId}:unauthorized-actor:source`,
  }),
  "privileged ingestion with a non-member actor",
);

const autoResult = expectSuccess(
  await service.rpc("ingest_restaurant_event", autoInput),
  "server-only AUTO ingestion",
);
assert.equal(autoResult.created, true);
assert.equal(autoResult.attention_item_id, null);
assert.equal(autoResult.approval_id, null);
const autoRetry = expectSuccess(
  await service.rpc("ingest_restaurant_event", autoInput),
  "AUTO idempotent retry",
);
assert.equal(autoRetry.created, false);
assert.equal(autoRetry.event_id, autoResult.event_id);

const humanResult = expectSuccess(
  await service.rpc(
    "ingest_restaurant_event",
    ingestionInput({
      suffix: "human",
      branchId: marinaBranchId,
      title: "Live HUMAN escalation verification",
      handlingMode: "human",
      eventStatus: "escalated",
      severity: "high",
      attentionPriority: "high",
    }),
  ),
  "server-only HUMAN ingestion",
);
expectDenied(
  await staff.client.rpc("update_manager_attention_item", {
    p_organization_id: organizationId,
    p_attention_id: humanResult.attention_item_id,
    p_status: "assigned",
    p_assigned_to: staff.user.id,
    p_assigned_to_is_set: true,
  }),
  "staff attention mutation",
);
expectSuccess(
  await manager.client.rpc("update_manager_attention_item", {
    p_organization_id: organizationId,
    p_attention_id: humanResult.attention_item_id,
    p_status: "assigned",
    p_assigned_to: manager.user.id,
    p_assigned_to_is_set: true,
  }),
  "manager attention assignment",
);
expectSuccess(
  await manager.client.rpc("update_manager_attention_item", {
    p_organization_id: organizationId,
    p_attention_id: humanResult.attention_item_id,
    p_status: "resolved",
    p_assigned_to: null,
    p_assigned_to_is_set: false,
  }),
  "manager attention resolution",
);

const approvalOutcomes = [
  { decision: "approved", eventStatus: "handled", attentionStatus: "resolved" },
  { decision: "edited", eventStatus: "handled", attentionStatus: "resolved" },
  { decision: "rejected", eventStatus: "dismissed", attentionStatus: "dismissed" },
];
const approvalResults = [];
for (const outcome of approvalOutcomes) {
  const proposedAction = { channel: "email", tone: "neutral", message: "Initial draft" };
  const ingested = expectSuccess(
    await service.rpc(
      "ingest_restaurant_event",
      ingestionInput({
        suffix: `approval-${outcome.decision}`,
        branchId: centralBranchId,
        title: `Live approval ${outcome.decision} verification`,
        handlingMode: "approval",
        eventStatus: "waiting_approval",
        severity: "medium",
        attentionPriority: "medium",
        approvalRequired: true,
        proposedAction,
      }),
    ),
    `ingest ${outcome.decision} approval`,
  );
  const decision = expectSuccess(
    await manager.client.rpc("process_manager_approval", {
      p_organization_id: organizationId,
      p_approval_id: ingested.approval_id,
      p_decision: outcome.decision,
      p_reviewer_note: `Live ${outcome.decision} verification`,
      p_edited_action:
        outcome.decision === "edited"
          ? { channel: "email", tone: "warm", message: "Manager-edited draft" }
          : null,
    }),
    `process ${outcome.decision} approval`,
  );
  assert.equal(decision.event_status, outcome.eventStatus);
  approvalResults.push({ ...ingested, ...outcome });
}

const persistedEvents = expectSuccess(
  await service
    .from("restaurant_events")
    .select("id,branch_id,status,handling_mode,dedupe_key")
    .like("dedupe_key", `${runId}:%`),
  "load persisted verification events",
);
assert.equal(persistedEvents.length, 5);
assert.equal(persistedEvents.find(({ id }) => id === humanResult.event_id)?.status, "handled");
for (const outcome of approvalResults) {
  assert.equal(
    persistedEvents.find(({ id }) => id === outcome.event_id)?.status,
    outcome.eventStatus,
  );
  const approval = expectSuccess(
    await service
      .from("manager_approvals")
      .select("status,reviewed_by,reviewed_at")
      .eq("id", outcome.approval_id)
      .single(),
    `load persisted ${outcome.decision} approval`,
  );
  assert.equal(approval.status, outcome.decision);
  assert.equal(approval.reviewed_by, manager.user.id);
  assert.ok(approval.reviewed_at);
  const attention = expectSuccess(
    await service
      .from("manager_attention_items")
      .select("status,resolved_at")
      .eq("id", outcome.attention_item_id)
      .single(),
    `load persisted ${outcome.decision} attention`,
  );
  assert.equal(attention.status, outcome.attentionStatus);
  assert.ok(attention.resolved_at);
}

const centralView = expectSuccess(
  await owner.client
    .from("restaurant_events")
    .select("id,branch_id")
    .eq("organization_id", organizationId)
    .or(`branch_id.eq.${centralBranchId},branch_id.is.null`),
  "central branch filter",
);
assert.ok(centralView.some(({ id }) => id === autoResult.event_id));
assert.ok(!centralView.some(({ id }) => id === humanResult.event_id));

expectDenied(
  await owner.client.rpc("update_manager_attention_item", {
    p_organization_id: isolationOrganizationId,
    p_attention_id: humanResult.attention_item_id,
    p_status: "dismissed",
    p_assigned_to: null,
    p_assigned_to_is_set: false,
  }),
  "cross-organization attention mutation",
);

const activity = expectSuccess(
  await owner.client
    .from("restaurant_activity_log")
    .select("action,actor_id,entity_id")
    .eq("organization_id", organizationId),
  "load persisted activity",
);
for (const action of [
  "member_added",
  "event_handled",
  "event_escalated",
  "attention_assigned",
  "attention_resolved",
  "approval_approved",
  "approval_edited",
  "approval_rejected",
]) {
  assert.ok(activity.some((entry) => entry.action === action), `Missing ${action} activity`);
}

const openAttention = expectSuccess(
  await owner.client
    .from("manager_attention_items")
    .select("id", { count: "exact" })
    .eq("organization_id", organizationId)
    .in("status", ["open", "assigned"]),
  "summary attention count",
);
const pendingApprovals = expectSuccess(
  await owner.client
    .from("manager_approvals")
    .select("id", { count: "exact" })
    .eq("organization_id", organizationId)
    .eq("status", "pending"),
  "summary approval count",
);

console.log(
  JSON.stringify({
    result: "PASS",
    projectRef: fixture.projectRef,
    authentication: ["owner", "manager", "staff", "outsider"],
    memberships: ["owner", "manager", "staff"],
    branches: branches.length,
    persistedVerificationEvents: persistedEvents.length,
    approvalOutcomes: approvalOutcomes.map(({ decision }) => decision),
    openAttention: openAttention.length,
    pendingApprovals: pendingApprovals.length,
    activityRowsVisible: activity.length,
    rlsIsolation: true,
    privilegedIngestionBoundary: true,
    lastOwnerProtection: true,
  }),
);
