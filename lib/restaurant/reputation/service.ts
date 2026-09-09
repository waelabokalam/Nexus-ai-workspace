import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { requireRestaurantAccess } from "@/lib/restaurant/auth";
import { throwRestaurantDatabaseError } from "@/lib/restaurant/core/data-access";
import {
  classifyRestaurantReview,
  normalizeRestaurantReview,
} from "@/lib/restaurant/reputation";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
  throwRestaurantDatabaseError("Could not ingest restaurant review", error);
  return data;
}
