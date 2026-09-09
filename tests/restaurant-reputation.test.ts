import { describe, expect, it } from "vitest";

import {
  classifyRestaurantReview,
  detectRepeatedNegativeReviewTopics,
  normalizeRestaurantReview,
} from "@/lib/restaurant/reputation";
import { calculateDailyManagerBrief } from "@/lib/restaurant/summary";
import type {
  ManagerApprovalRow,
  ManagerAttentionItemRow,
  RestaurantEventRow,
  RestaurantReviewRow,
} from "@/lib/supabase/database.types";

const organizationId = "10000000-0000-4000-8000-000000000001";
const branchId = "20000000-0000-4000-8000-000000000001";
const otherBranchId = "20000000-0000-4000-8000-000000000002";

function normalized(overrides: Record<string, unknown> = {}) {
  return normalizeRestaurantReview(
    {
      organizationId,
      branchId,
      source: "direct_feedback",
      externalReviewId: "review-101",
      customerDisplayName: "Mina",
      rating: 5,
      reviewText: "Delicious food and friendly service.",
      reviewedAt: "2026-09-09T08:00:00.000Z",
      ...overrides,
    },
    new Date("2026-09-09T10:00:00.000Z"),
  );
}

function review(overrides: Partial<RestaurantReviewRow> = {}): RestaurantReviewRow {
  return {
    id: crypto.randomUUID(),
    organization_id: organizationId,
    branch_id: branchId,
    event_id: crypto.randomUUID(),
    source: "direct_feedback",
    external_review_id: crypto.randomUUID(),
    customer_display_name: "Guest",
    rating: 3,
    review_text: "Slow service",
    reviewed_at: "2026-09-08T08:00:00.000Z",
    language: "en",
    sentiment: "negative",
    topics: ["service", "speed"],
    severity: "medium",
    response_status: "pending",
    proposed_response: "We are sorry about the delay.",
    approved_response: null,
    dedupe_key: crypto.randomUUID(),
    created_at: "2026-09-08T08:00:00.000Z",
    updated_at: "2026-09-08T08:00:00.000Z",
    ...overrides,
  };
}

describe("review normalization and deterministic classification", () => {
  it("normalizes provider metadata and derives a stable external-ID dedupe key", () => {
    const value = normalized();
    expect(value).toMatchObject({
      source: "direct_feedback",
      externalReviewId: "review-101",
      reviewedAt: "2026-09-09T08:00:00.000Z",
      dedupeKey: "review:direct_feedback:review-101",
    });
  });

  it("derives a retry-stable fingerprint when a provider has no external ID", () => {
    const input = {
      organizationId,
      branchId,
      source: "manual_feedback",
      externalReviewId: null,
      customerDisplayName: "Mina",
      rating: 4,
      reviewText: "Friendly staff.",
    };
    expect(normalizeRestaurantReview(input, new Date("2026-09-09T10:00:00Z")).dedupeKey)
      .toBe(normalizeRestaurantReview(input, new Date("2026-09-09T11:00:00Z")).dedupeKey);
  });

  it.each([0, 6, 2.5])("rejects invalid rating %s", (rating) => {
    expect(() => normalized({ rating })).toThrow();
  });

  it("keeps a positive review on the no-attention path", () => {
    expect(classifyRestaurantReview(normalized())).toEqual({
      sentiment: "positive",
      topics: ["food_quality", "service", "staff"],
      severity: "low",
      requiresAttention: false,
      handlingMode: "auto",
      eventStatus: "handled",
      attentionPriority: null,
      proposedResponse: null,
    });
  });

  it("classifies a three-star slow-service complaint and prepares one approval draft", () => {
    const result = classifyRestaurantReview(
      normalized({
        rating: 3,
        reviewText: "Service was slow and we waited too long.",
      }),
    );
    expect(result.sentiment).toBe("negative");
    expect(result.topics).toEqual(["service", "speed"]);
    expect(result.severity).toBe("medium");
    expect(result).toMatchObject({
      requiresAttention: true,
      handlingMode: "approval",
      eventStatus: "waiting_approval",
      attentionPriority: "medium",
    });
    expect(result.proposedResponse).toContain("sorry");
  });

  it("conservatively escalates serious food-safety language without drafting a reply", () => {
    const result = classifyRestaurantReview(
      normalized({
        rating: 1,
        reviewText: "I had an allergic reaction and was hospitalized after the meal.",
      }),
    );
    expect(result).toMatchObject({
      sentiment: "negative",
      severity: "critical",
      requiresAttention: true,
      handlingMode: "human",
      eventStatus: "escalated",
      attentionPriority: "critical",
      proposedResponse: null,
    });
    expect(result.topics).toContain("food_quality");
  });
});

describe("reputation trend detection", () => {
  const reviews = [
    review({ reviewed_at: "2026-09-03T08:00:00.000Z" }),
    review({ reviewed_at: "2026-09-05T08:00:00.000Z" }),
    review({ reviewed_at: "2026-09-07T08:00:00.000Z", topics: ["service", "speed", "speed"] }),
    review({ reviewed_at: "2026-09-08T08:00:00.000Z" }),
  ];

  it("requires four negative mentions inside the seven-day window", () => {
    expect(
      detectRepeatedNegativeReviewTopics(reviews.slice(0, 3), {
        endsAt: "2026-09-10T00:00:00.000Z",
      }),
    ).toEqual([]);
    expect(
      detectRepeatedNegativeReviewTopics(reviews, {
        endsAt: "2026-09-10T00:00:00.000Z",
      }),
    ).toEqual([
      {
        topic: "service",
        count: 4,
        firstReviewedAt: "2026-09-03T08:00:00.000Z",
        lastReviewedAt: "2026-09-08T08:00:00.000Z",
      },
      {
        topic: "speed",
        count: 4,
        firstReviewedAt: "2026-09-03T08:00:00.000Z",
        lastReviewedAt: "2026-09-08T08:00:00.000Z",
      },
    ]);
  });

  it("respects branch scope while retaining organization-wide reviews", () => {
    const scoped = [
      ...reviews,
      review({ branch_id: otherBranchId, reviewed_at: "2026-09-08T09:00:00.000Z" }),
      review({ branch_id: null, reviewed_at: "2026-09-08T10:00:00.000Z" }),
    ];
    const result = detectRepeatedNegativeReviewTopics(scoped, {
      endsAt: "2026-09-10T00:00:00.000Z",
      branchId,
      threshold: 5,
    });
    expect(result.map(({ topic, count }) => ({ topic, count }))).toEqual([
      { topic: "service", count: 5 },
      { topic: "speed", count: 5 },
    ]);
  });
});

describe("Daily Manager Brief reputation facts", () => {
  it("surfaces negative volume, serious review risk, and a repeated topic", () => {
    const seriousReview = review({
      reviewed_at: "2026-09-09T09:00:00.000Z",
      rating: 1,
      severity: "critical",
      response_status: "none",
      proposed_response: null,
      topics: ["food_quality"],
    });
    const seriousEvent: RestaurantEventRow = {
      id: seriousReview.event_id,
      organization_id: organizationId,
      branch_id: branchId,
      created_at: seriousReview.reviewed_at,
      occurred_at: seriousReview.reviewed_at,
      source: "direct_feedback",
      event_type: "review_received",
      category: "reputation",
      title: "Serious review",
      summary: seriousReview.review_text,
      severity: "critical",
      handling_mode: "human",
      status: "escalated",
      source_reference: seriousReview.external_review_id,
      subject_type: "restaurant_review",
      subject_id: seriousReview.id,
      structured_data: {},
      confidence: 1,
      requires_attention: true,
      dedupe_key: seriousReview.dedupe_key,
      updated_at: seriousReview.reviewed_at,
    };
    const attention: ManagerAttentionItemRow = {
      id: crypto.randomUUID(), organization_id: organizationId, branch_id: branchId,
      event_id: seriousEvent.id, title: "Serious review", summary: "Human review",
      priority: "critical", category: "reputation", status: "open", assigned_to: null,
      due_at: null, created_at: seriousReview.reviewed_at, resolved_at: null,
      updated_at: seriousReview.reviewed_at,
    };
    const brief = calculateDailyManagerBrief({
      organizationId,
      generatedForDate: "2026-09-09",
      startsAt: "2026-09-09T00:00:00.000Z",
      endsAt: "2026-09-10T00:00:00.000Z",
      branchId: null,
      branches: [{ id: branchId, name: "Central" }],
      events: [seriousEvent],
      attentionItems: [attention],
      approvals: [] as ManagerApprovalRow[],
      activity: [],
      reviews: [
        review({ reviewed_at: "2026-09-03T08:00:00.000Z" }),
        review({ reviewed_at: "2026-09-05T08:00:00.000Z" }),
        review({ reviewed_at: "2026-09-07T08:00:00.000Z" }),
        review({ reviewed_at: "2026-09-09T08:00:00.000Z" }),
        seriousReview,
      ],
    });
    expect(brief.negativeReviewCount).toBe(2);
    expect(brief.seriousReputationCount).toBe(1);
    expect(brief.repeatedNegativeTopics[0]).toMatchObject({ topic: "service", count: 4 });
    expect(brief.priorityItems.map((item) => item.kind)).toEqual(
      expect.arrayContaining([
        "serious_reputation_issues",
        "negative_reviews",
        "reputation_topic_trend",
      ]),
    );
  });
});
