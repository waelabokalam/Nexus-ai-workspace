import { describe, expect, it } from "vitest";

import {
  isRestaurantMutationAlreadyApplied,
  RestaurantDatabaseError,
} from "@/lib/restaurant/errors";

describe("Restaurant mutation errors", () => {
  it.each([
    "The attention item is already in a terminal state.",
    "The attention item transition is stale.",
    "The approval decision is stale.",
    "The related event is no longer waiting for approval.",
  ])("recognizes a safe duplicate mutation: %s", (message) => {
    expect(
      isRestaurantMutationAlreadyApplied(
        new RestaurantDatabaseError(`Could not mutate: ${message}`, "55000"),
      ),
    ).toBe(true);
  });

  it("does not hide business-rule or authorization failures", () => {
    expect(
      isRestaurantMutationAlreadyApplied(
        new RestaurantDatabaseError(
          "Resolve the pending approval before closing manager attention.",
          "55000",
        ),
      ),
    ).toBe(false);
    expect(
      isRestaurantMutationAlreadyApplied(
        new RestaurantDatabaseError("Permission denied.", "42501"),
      ),
    ).toBe(false);
  });
});
