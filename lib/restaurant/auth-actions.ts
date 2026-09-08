"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type RestaurantSignInState = { error?: string } | undefined;

const signInSchema = z.object({
  email: z.email().trim().max(320),
  password: z.string().min(8).max(200),
  next: z.string().optional(),
});

function safeRestaurantDestination(value?: string) {
  return value?.startsWith("/restaurant") && !value.startsWith("//")
    ? value
    : "/restaurant";
}

export async function signInRestaurant(
  _state: RestaurantSignInState,
  formData: FormData,
): Promise<RestaurantSignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { error: "The email or password was not accepted." };

  redirect(safeRestaurantDestination(parsed.data.next));
}

export async function signOutRestaurant() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/restaurant/login");
}
