import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { requireRestaurantAccess } from "@/lib/restaurant/auth";
import {
  filterRestaurantBranch,
  throwRestaurantDatabaseError,
} from "@/lib/restaurant/core/data-access";
import { getSupplierInvoiceCommandCenterData } from "@/lib/restaurant/invoice-services";
import { calculateDailyManagerBrief } from "@/lib/restaurant/daily-brief";
import {
  calculateRestaurantSummary,
  isAutomaticallyHandledEvent,
} from "@/lib/restaurant/summary";
import {
  getRestaurantDayWindow,
  getRestaurantLocalDate,
} from "@/lib/restaurant/time";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const commandCenterRequestSchema = z.object({
  organizationId: z.uuid(),
  branchId: z.uuid().nullable().optional().default(null),
  localDate: z.iso.date().optional(),
});

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
  throwRestaurantDatabaseError("Could not load restaurant", organizationResult.error);
  throwRestaurantDatabaseError("Could not load restaurant branches", branchesResult.error);
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

  const eventsQuery = filterRestaurantBranch(
    database
      .from("restaurant_events")
      .select("*")
      .eq("organization_id", input.organizationId)
      .gte("occurred_at", startsAt)
      .lt("occurred_at", endsAt),
    input.branchId,
  ).order("occurred_at", { ascending: false });
  const attentionQuery = filterRestaurantBranch(
    database
      .from("manager_attention_items")
      .select("*")
      .eq("organization_id", input.organizationId)
      .in("status", ["open", "assigned"]),
    input.branchId,
  ).order("created_at", { ascending: false });
  const approvalsQuery = filterRestaurantBranch(
    database
      .from("manager_approvals")
      .select("*")
      .eq("organization_id", input.organizationId)
      .eq("status", "pending"),
    input.branchId,
  ).order("requested_at", { ascending: false });
  const activityQuery = filterRestaurantBranch(
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
  const reviewsQuery = filterRestaurantBranch(
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
  const supplierInvoiceData = getSupplierInvoiceCommandCenterData(
    input.organizationId,
    input.branchId,
    database,
  );

  const [eventsResult, attentionResult, approvalsResult, activityResult, reviewsResult, invoiceData] =
    await Promise.all([
      eventsQuery,
      attentionQuery,
      approvalsQuery,
      activityQuery,
      reviewsQuery,
      supplierInvoiceData,
    ]);
  throwRestaurantDatabaseError("Could not load restaurant events", eventsResult.error);
  throwRestaurantDatabaseError("Could not load manager attention", attentionResult.error);
  throwRestaurantDatabaseError("Could not load approvals", approvalsResult.error);
  throwRestaurantDatabaseError("Could not load activity", activityResult.error);
  throwRestaurantDatabaseError("Could not load restaurant reviews", reviewsResult.error);

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
  throwRestaurantDatabaseError(
    "Could not load related restaurant events",
    relatedEventsResult.error,
  );

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
      invoices: invoiceData.invoices,
      invoiceItems: invoiceData.invoiceItems,
      startsAt,
      endsAt,
      branchId: input.branchId,
    }),
    attentionItems,
    approvals,
    relatedEvents: relatedEventsResult.data ?? [],
    handledEvents: events.filter(isAutomaticallyHandledEvent).slice(0, 12),
    activity,
    reviews,
    invoices: invoiceData.invoices,
    invoiceItems: invoiceData.invoiceItems,
  };
}
