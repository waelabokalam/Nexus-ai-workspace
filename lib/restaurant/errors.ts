export class RestaurantDatabaseError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "RestaurantDatabaseError";
  }
}

export function isRestaurantMutationAlreadyApplied(error: unknown) {
  if (!(error instanceof RestaurantDatabaseError) || error.code !== "55000") {
    return false;
  }

  const message = error.message.toLowerCase();
  return [
    "already in a terminal state",
    "transition is stale",
    "approval decision is stale",
    "related event is no longer waiting for approval",
  ].some((fragment) => message.includes(fragment));
}
