import { detectRepeatedNegativeReviewTopics } from "@/lib/restaurant/reputation";
import { belongsToBranch } from "@/lib/restaurant/summary";
import type { RestaurantReviewRow } from "@/lib/supabase/database.types";

export type ReputationBriefFacts = {
  negativeReviewCount: number;
  seriousReputationCount: number;
  seriousReviewEventIds: ReadonlySet<string>;
  repeatedNegativeTopics: ReturnType<typeof detectRepeatedNegativeReviewTopics>;
};

export function getReputationBriefFacts(input: {
  reviews: RestaurantReviewRow[];
  startsAt: string;
  endsAt: string;
  branchId?: string | null;
}): ReputationBriefFacts {
  const start = Date.parse(input.startsAt);
  const end = Date.parse(input.endsAt);
  const reviewsToday = input.reviews.filter((review) => {
    const reviewedAt = Date.parse(review.reviewed_at);
    return (
      reviewedAt >= start &&
      reviewedAt < end &&
      belongsToBranch(review, input.branchId)
    );
  });
  const negativeReviews = reviewsToday.filter(
    (review) => review.sentiment === "negative",
  );
  const seriousReviews = negativeReviews.filter(
    (review) => review.severity === "high" || review.severity === "critical",
  );

  return {
    negativeReviewCount: negativeReviews.length,
    seriousReputationCount: seriousReviews.length,
    seriousReviewEventIds: new Set(seriousReviews.map((review) => review.event_id)),
    repeatedNegativeTopics: detectRepeatedNegativeReviewTopics(input.reviews, {
      endsAt: input.endsAt,
      branchId: input.branchId ?? undefined,
    }),
  };
}
