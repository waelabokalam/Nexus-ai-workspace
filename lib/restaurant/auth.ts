import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database, RestaurantMemberRole } from "@/lib/supabase/database.types";

export class RestaurantAuthorizationError extends Error {
  constructor(message = "You do not have access to this restaurant workspace.") {
    super(message);
    this.name = "RestaurantAuthorizationError";
  }
}

export async function requireRestaurantUser(
  client?: SupabaseClient<Database>,
): Promise<User> {
  const database = client ?? (await createSupabaseServerClient());
  const { data, error } = await database.auth.getUser();
  if (error || !data.user) {
    throw new RestaurantAuthorizationError("Sign in to access the restaurant workspace.");
  }
  return data.user;
}

export async function requireRestaurantAccess(
  organizationId: string,
  allowedRoles?: RestaurantMemberRole[],
  client?: SupabaseClient<Database>,
) {
  const database = client ?? (await createSupabaseServerClient());
  const user = await requireRestaurantUser(database);
  const { data: membership, error } = await database
    .from("restaurant_members")
    .select("id, organization_id, user_id, role, created_at")
    .eq("organization_id", organizationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !membership) throw new RestaurantAuthorizationError();
  if (allowedRoles && !allowedRoles.includes(membership.role)) {
    throw new RestaurantAuthorizationError("Your restaurant role cannot perform this action.");
  }

  return { user, membership };
}

export async function listRestaurantWorkspaces(
  client?: SupabaseClient<Database>,
) {
  const database = client ?? (await createSupabaseServerClient());
  const user = await requireRestaurantUser(database);
  const { data, error } = await database
    .from("restaurant_members")
    .select("id, organization_id, user_id, role, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Could not load restaurant memberships: ${error.message}`);
  return data;
}
