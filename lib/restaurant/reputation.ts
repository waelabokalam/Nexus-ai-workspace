import { z } from "zod";

import type {
  RestaurantReviewRow,
  RestaurantReviewSentiment,
  RestaurantReviewTopic,
  RestaurantSeverity,
} from "@/lib/supabase/database.types";

const reviewSourceSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z][a-z0-9_]*$/, "Use a lowercase snake_case source identifier.");

export const restaurantReviewSentimentSchema = z.enum([
  "positive",
  "neutral",
  "negative",
]);

export const restaurantReviewTopicSchema = z.enum([
  "food_quality",
  "service",
  "speed",
  "delivery",
  "cleanliness",
  "staff",
  "price",
  "reservation",
  "atmosphere",
  "other",
]);

export const restaurantReviewInputSchema = z.object({
  organizationId: z.uuid(),
  branchId: z.uuid().nullable().optional().default(null),
  source: reviewSourceSchema,
  externalReviewId: z.string().trim().min(1).max(240).nullable().optional().default(null),
  customerDisplayName: z.string().trim().min(1).max(160).nullable().optional().default(null),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().trim().min(1).max(10_000),
  reviewedAt: z.iso.datetime({ offset: true }).optional(),
  language: z.string().trim().min(2).max(35).nullable().optional().default(null),
  dedupeKey: z.string().trim().min(1).max(240).nullable().optional().default(null),
});

export type NormalizedRestaurantReview = Omit<
  z.infer<typeof restaurantReviewInputSchema>,
  "reviewedAt" | "dedupeKey"
> & {
  reviewedAt: string;
  dedupeKey: string;
};

export type RestaurantReviewClassification = {
  sentiment: RestaurantReviewSentiment;
  topics: RestaurantReviewTopic[];
  severity: Exclude<RestaurantSeverity, "info">;
  requiresAttention: boolean;
  handlingMode: "auto" | "approval" | "human";
  eventStatus: "handled" | "waiting_approval" | "escalated";
  attentionPriority: Exclude<RestaurantSeverity, "info"> | null;
  proposedResponse: string | null;
};

const TOPIC_TERMS: ReadonlyArray<[
  RestaurantReviewTopic,
  readonly string[],
]> = [
  ["food_quality", ["food", "meal", "dish", "taste", "tasteless", "delicious", "cold food", "undercooked", "stale", "temperature"]],
  ["service", ["service", "waiter", "waitress", "server", "served", "hospitality"]],
  ["speed", ["slow", "waited", "waiting", "delay", "delayed", "took forever", "late"]],
  ["delivery", ["delivery", "delivered", "courier", "driver", "takeaway", "takeout"]],
  ["cleanliness", ["dirty", "cleanliness", "clean", "hygiene", "restroom", "bathroom", "filthy"]],
  ["staff", ["staff", "rude", "friendly", "manager", "employee", "team"]],
  ["price", ["price", "expensive", "overpriced", "value", "cost", "bill"]],
  ["reservation", ["reservation", "booking", "booked", "table"]],
  ["atmosphere", ["atmosphere", "ambience", "ambiance", "music", "noisy", "noise", "decor"]],
];

const NEGATIVE_TERMS = [
  "bad",
  "cold",
  "complaint",
  "disappointed",
  "dirty",
  "late",
  "overpriced",
  "poor",
  "rude",
  "slow",
  "terrible",
  "waited",
  "wrong",
];

const HIGH_RISK_TERMS = [
  "allergic reaction",
  "allergy",
  "charged twice",
  "food poisoning",
  "fraud",
  "glass in",
  "harassment",
  "payment dispute",
  "poisoned",
  "unsafe",
];

const CRITICAL_RISK_TERMS = [
  "anaphylaxis",
  "assault",
  "hospitalised",
  "hospitalized",
  "life threatening",
  "sexual harassment",
  "weapon",
];

function includesAny(text: string, terms: readonly string[]) {
  return terms.some((term) => text.includes(term));
}

function fingerprint(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function normalizeRestaurantReview(
  value: unknown,
  now: Date = new Date(),
): NormalizedRestaurantReview {
  const review = restaurantReviewInputSchema.parse(value);
  const reviewedAt = review.reviewedAt ?? now.toISOString();
  const fallbackIdentity = [
    review.organizationId,
    review.branchId ?? "all",
    review.source,
    review.externalReviewId ?? "direct",
    review.customerDisplayName ?? "anonymous",
    review.rating,
    review.reviewText,
  ].join("|");

  return {
    ...review,
    reviewedAt,
    dedupeKey:
      review.dedupeKey ??
      (review.externalReviewId
        ? `review:${review.source}:${review.externalReviewId}`
        : `review:${review.source}:${fingerprint(fallbackIdentity)}`),
  };
}

export function classifyRestaurantReview(
  review: NormalizedRestaurantReview,
): RestaurantReviewClassification {
  const text = review.reviewText.toLocaleLowerCase("en-US");
  const topics = TOPIC_TERMS
    .filter(([, terms]) => includesAny(text, terms))
    .map(([topic]) => topic);
  if (!topics.length) topics.push("other");

  const criticalRisk = includesAny(text, CRITICAL_RISK_TERMS);
  const highRisk = criticalRisk || includesAny(text, HIGH_RISK_TERMS);
  const hasNegativeLanguage = includesAny(text, NEGATIVE_TERMS) || highRisk;
  const sentiment: RestaurantReviewSentiment = highRisk
    ? "negative"
    : review.rating >= 4
      ? "positive"
      : review.rating <= 2 || hasNegativeLanguage
        ? "negative"
        : "neutral";
  const severity: Exclude<RestaurantSeverity, "info"> = criticalRisk
    ? "critical"
    : highRisk
      ? "high"
      : sentiment === "negative"
        ? "medium"
        : "low";

  if (severity === "high" || severity === "critical") {
    return {
      sentiment,
      topics,
      severity,
      requiresAttention: true,
      handlingMode: "human",
      eventStatus: "escalated",
      attentionPriority: severity,
      proposedResponse: null,
    };
  }

  if (sentiment === "negative") {
    const name = review.customerDisplayName ? ` ${review.customerDisplayName}` : "";
    const topic = topics[0] === "other" ? "your experience" : topics[0].replaceAll("_", " ");
    return {
      sentiment,
      topics,
      severity,
      requiresAttention: true,
      handlingMode: "approval",
      eventStatus: "waiting_approval",
      attentionPriority: severity,
      proposedResponse: `Thank you for your feedback${name}. We are sorry that ${topic} did not meet expectations. We are reviewing what happened with the team and appreciate the opportunity to improve.`,
    };
  }

  return {
    sentiment,
    topics,
    severity,
    requiresAttention: false,
    handlingMode: "auto",
    eventStatus: "handled",
    attentionPriority: null,
    proposedResponse: null,
  };
}

export type RepeatedReviewTopic = {
  topic: Exclude<RestaurantReviewTopic, "other">;
  count: number;
  firstReviewedAt: string;
  lastReviewedAt: string;
};

export function detectRepeatedNegativeReviewTopics(
  reviews: Pick<RestaurantReviewRow, "branch_id" | "reviewed_at" | "sentiment" | "topics">[],
  options: {
    endsAt: string;
    branchId?: string | null;
    rollingDays?: number;
    threshold?: number;
  },
): RepeatedReviewTopic[] {
  const end = Date.parse(options.endsAt);
  const rollingDays = options.rollingDays ?? 7;
  const threshold = options.threshold ?? 4;
  if (!Number.isFinite(end) || rollingDays <= 0 || threshold < 2) {
    throw new Error("A valid reputation trend window and threshold are required.");
  }
  const start = end - rollingDays * 24 * 60 * 60 * 1_000;
  const byTopic = new Map<Exclude<RestaurantReviewTopic, "other">, string[]>();

  for (const review of reviews) {
    const reviewedAt = Date.parse(review.reviewed_at);
    if (
      review.sentiment !== "negative" ||
      reviewedAt < start ||
      reviewedAt >= end ||
      (options.branchId !== undefined &&
        review.branch_id !== null &&
        review.branch_id !== options.branchId)
    ) {
      continue;
    }
    for (const topic of new Set(review.topics)) {
      if (topic === "other") continue;
      const occurrences = byTopic.get(topic) ?? [];
      occurrences.push(review.reviewed_at);
      byTopic.set(topic, occurrences);
    }
  }

  return [...byTopic.entries()]
    .filter(([, occurrences]) => occurrences.length >= threshold)
    .map(([topic, occurrences]) => {
      occurrences.sort();
      return {
        topic,
        count: occurrences.length,
        firstReviewedAt: occurrences[0],
        lastReviewedAt: occurrences.at(-1)!,
      };
    })
    .sort((left, right) => right.count - left.count || left.topic.localeCompare(right.topic));
}
