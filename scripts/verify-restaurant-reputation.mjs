import assert from "node:assert/strict";
import fs from "node:fs";

import { createClient } from "@supabase/supabase-js";

const organizationId = "10000000-0000-4000-8000-000000000001";
const centralBranchId = "20000000-0000-4000-8000-000000000001";
const marinaBranchId = "20000000-0000-4000-8000-000000000002";

function parseEnvironment(path) {
  return Object.fromEntries(
    fs.readFileSync(path, "utf8").split(/\r?\n/)
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
const fixturePath = process.env.NEXUS_RESTAURANT_AUTH_FIXTURES ?? "/tmp/nexus-restaurant-v1-auth.json";
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
assert.equal(fixture.projectRef, "ovloyniqxpuqkwrpoafp", "Auth fixtures target the wrong project");
assert.match(environment.NEXT_PUBLIC_SUPABASE_URL, /ovloyniqxpuqkwrpoafp\.supabase\.co$/);

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
  return { client, user };
}

const owner = await authenticatedClient("owner");
const manager = await authenticatedClient("manager");
const outsider = await authenticatedClient("outsider");
const runId = `reputation-live-${Date.now()}`;
const workflowIds = { reviews: new Set(), events: new Set(), attention: new Set(), approvals: new Set() };
const baselineTrendIds = new Set(
  expectSuccess(
    await service.from("restaurant_events").select("id")
      .eq("organization_id", organizationId)
      .eq("event_type", "review_trend_detected"),
    "load reputation trend baseline",
  ).map(({ id }) => id),
);

function reviewInput({
  suffix,
  branchId,
  rating,
  text,
  sentiment,
  topics,
  severity,
  proposedResponse = null,
}) {
  return {
    p_actor_id: owner.user.id,
    p_organization_id: organizationId,
    p_branch_id: branchId,
    p_reviewed_at: new Date().toISOString(),
    p_source: "direct_feedback",
    p_external_review_id: `${runId}:${suffix}:external`,
    p_customer_display_name: "Live verification guest",
    p_rating: rating,
    p_review_text: text,
    p_language: "en",
    p_sentiment: sentiment,
    p_topics: topics,
    p_severity: severity,
    p_dedupe_key: `${runId}:${suffix}`,
    p_proposed_response: proposedResponse,
  };
}

function remember(result) {
  workflowIds.reviews.add(result.review_id);
  workflowIds.events.add(result.event_id);
  if (result.attention_item_id) workflowIds.attention.add(result.attention_item_id);
  if (result.approval_id) workflowIds.approvals.add(result.approval_id);
  for (const eventId of result.trend_event_ids ?? []) {
    if (!baselineTrendIds.has(eventId)) workflowIds.events.add(eventId);
  }
  return result;
}

async function ingest(input, context) {
  return remember(expectSuccess(await service.rpc("ingest_restaurant_review", input), context));
}

async function cleanup() {
  const reviewIds = [...workflowIds.reviews];
  const eventIds = [...workflowIds.events];
  if (eventIds.length) {
    const [attention, approvals] = await Promise.all([
      service.from("manager_attention_items").select("id").in("event_id", eventIds),
      service.from("manager_approvals").select("id").in("event_id", eventIds),
    ]);
    for (const { id } of expectSuccess(attention, "load cleanup attention")) workflowIds.attention.add(id);
    for (const { id } of expectSuccess(approvals, "load cleanup approvals")) workflowIds.approvals.add(id);
  }
  const entityIds = [...new Set([
    ...eventIds,
    ...workflowIds.attention,
    ...workflowIds.approvals,
    ...reviewIds,
  ])];
  if (entityIds.length) expectSuccess(
    await service.from("restaurant_activity_log").delete().in("entity_id", entityIds),
    "clean reputation activity",
  );
  if (reviewIds.length) expectSuccess(
    await service.from("restaurant_reviews").delete().in("id", reviewIds),
    "clean reputation reviews",
  );
  if (workflowIds.approvals.size) expectSuccess(
    await service.from("manager_approvals").delete().in("id", [...workflowIds.approvals]),
    "clean reputation approvals",
  );
  if (workflowIds.attention.size) expectSuccess(
    await service.from("manager_attention_items").delete().in("id", [...workflowIds.attention]),
    "clean reputation attention",
  );
  if (eventIds.length) expectSuccess(
    await service.from("restaurant_events").delete().in("id", eventIds),
    "clean reputation events",
  );
}

try {
  const positiveInput = reviewInput({
    suffix: "positive", branchId: centralBranchId, rating: 5,
    text: "Delicious food and friendly service.", sentiment: "positive",
    topics: ["food_quality", "service", "staff"], severity: "low",
  });
  expectDenied(
    await owner.client.rpc("ingest_restaurant_review", positiveInput),
    "browser-side review ingestion",
  );
  const positive = await ingest(positiveInput, "positive review ingestion");
  assert.equal(positive.created, true);
  assert.equal(positive.attention_item_id, null);
  assert.equal(positive.approval_id, null);
  const duplicate = expectSuccess(
    await service.rpc("ingest_restaurant_review", positiveInput),
    "duplicate external review retry",
  );
  assert.equal(duplicate.created, false);
  assert.equal(duplicate.review_id, positive.review_id);

  const negative = await ingest(reviewInput({
    suffix: "negative", branchId: centralBranchId, rating: 2,
    text: "The food arrived cold and the wait was disappointing.", sentiment: "negative",
    topics: ["food_quality", "speed"], severity: "medium",
    proposedResponse: "We are sorry your meal arrived cold and that you had to wait.",
  }), "negative review ingestion");
  assert.ok(negative.attention_item_id);
  assert.ok(negative.approval_id);

  const serious = await ingest(reviewInput({
    suffix: "serious", branchId: marinaBranchId, rating: 1,
    text: "I had an allergic reaction and was hospitalized after the meal.",
    sentiment: "negative", topics: ["food_quality"], severity: "critical",
  }), "serious review ingestion");
  assert.ok(serious.attention_item_id);
  assert.equal(serious.approval_id, null);

  const slowResults = [];
  for (let index = 1; index <= 5; index += 1) {
    slowResults.push(await ingest(reviewInput({
      suffix: `slow-${index}`, branchId: centralBranchId, rating: 3,
      text: `Slow service verification complaint ${index}; we waited too long.`,
      sentiment: "negative", topics: ["service", "speed"], severity: "medium",
      proposedResponse: "We are sorry about the slow service and are reviewing the delay.",
    }), `slow-service review ${index}`));
  }
  const fourthTrendIds = slowResults[3].trend_event_ids;
  const fifthTrendIds = slowResults[4].trend_event_ids;
  assert.equal(fourthTrendIds.length, 2, "Fourth repeated complaint must create topic alerts");
  assert.deepEqual(new Set(fifthTrendIds), new Set(fourthTrendIds), "Active trend alerts must be reused");
  const activeTrendCount = expectSuccess(
    await service.from("restaurant_events").select("id")
      .in("id", fourthTrendIds),
    "load active trend events",
  );
  assert.equal(activeTrendCount.length, 2);

  const decisions = [
    { result: negative, decision: "approved", edited: null, expected: "approved" },
    {
      result: slowResults[0], decision: "edited",
      edited: { tone: "warm", message: "Manager-edited reputation response." },
      expected: "approved",
    },
    { result: slowResults[1], decision: "rejected", edited: null, expected: "rejected" },
  ];
  for (const item of decisions) {
    expectSuccess(await manager.client.rpc("process_manager_approval", {
      p_organization_id: organizationId,
      p_approval_id: item.result.approval_id,
      p_decision: item.decision,
      p_reviewer_note: `Reputation ${item.decision} verification`,
      p_edited_action: item.edited,
    }), `${item.decision} reputation response`);
    const persisted = expectSuccess(
      await manager.client.from("restaurant_reviews")
        .select("response_status,approved_response")
        .eq("id", item.result.review_id).single(),
      `load ${item.decision} review response state`,
    );
    assert.equal(persisted.response_status, item.expected);
    if (item.decision === "edited") assert.equal(persisted.approved_response, item.edited.message);
  }

  const centralReviews = expectSuccess(
    await owner.client.from("restaurant_reviews").select("id,branch_id")
      .like("dedupe_key", `${runId}:%`)
      .or(`branch_id.eq.${centralBranchId},branch_id.is.null`),
    "central review branch filter",
  );
  assert.ok(centralReviews.some(({ id }) => id === positive.review_id));
  assert.ok(!centralReviews.some(({ id }) => id === serious.review_id));
  assert.deepEqual(
    expectSuccess(
      await outsider.client.from("restaurant_reviews").select("id")
        .like("dedupe_key", `${runId}:%`),
      "outsider review isolation",
    ),
    [],
  );

  const reviewRows = expectSuccess(
    await owner.client.from("restaurant_reviews")
      .select("id,sentiment,severity,response_status,topics,branch_id")
      .like("dedupe_key", `${runId}:%`),
    "load persisted reputation facts",
  );
  assert.equal(reviewRows.length, 8);
  assert.equal(reviewRows.filter(({ sentiment }) => sentiment === "negative").length, 7);
  assert.equal(reviewRows.filter(({ severity }) => severity === "critical").length, 1);
  const activity = expectSuccess(
    await owner.client.from("restaurant_activity_log").select("action,entity_id")
      .in("entity_id", [...new Set([...workflowIds.events, ...workflowIds.approvals])]),
    "load reputation activity history",
  );
  for (const action of [
    "event_handled", "approval_requested", "event_escalated",
    "approval_approved", "approval_edited", "approval_rejected",
  ]) {
    assert.ok(activity.some((entry) => entry.action === action), `Missing ${action} activity`);
  }

  console.log(JSON.stringify({
    result: "PASS",
    projectRef: fixture.projectRef,
    reviewsPersisted: reviewRows.length,
    negativeReviews: 7,
    seriousHumanEscalations: 1,
    responseDecisions: decisions.map(({ decision }) => decision),
    repeatedTopics: ["service", "speed"],
    duplicateExternalReviewPrevented: true,
    duplicateActiveTrendPrevented: true,
    branchFiltering: true,
    rlsIsolation: true,
    dailyBriefReputationFactsAvailable: true,
  }));
} finally {
  await cleanup();
}
