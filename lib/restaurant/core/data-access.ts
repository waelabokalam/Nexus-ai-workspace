import "server-only";

import { RestaurantDatabaseError } from "@/lib/restaurant/errors";

export function throwRestaurantDatabaseError(
  context: string,
  error: { message: string; code?: string } | null,
) {
  if (error) {
    throw new RestaurantDatabaseError(`${context}: ${error.message}`, error.code);
  }
}

export function filterRestaurantBranch<T extends { or: (filter: string) => T }>(
  query: T,
  branchId: string | null,
) {
  return branchId ? query.or(`branch_id.eq.${branchId},branch_id.is.null`) : query;
}
