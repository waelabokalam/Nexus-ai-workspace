"use client";

import { useActionState } from "react";

import {
  signInRestaurant,
  type RestaurantSignInState,
} from "@/lib/restaurant/auth-actions";

export default function RestaurantLoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<RestaurantSignInState, FormData>(
    signInRestaurant,
    undefined,
  );

  return (
    <form action={action} className="mt-8 space-y-5">
      <input name="next" type="hidden" value={next ?? "/restaurant"} />
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-200 light:text-zinc-800" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          autoFocus
          className="nexus-focus min-h-11 w-full rounded-xl border border-white/[0.12] bg-white/[0.045] px-3.5 text-sm text-white placeholder:text-zinc-600 light:border-black/[0.14] light:bg-black/[0.025] light:text-zinc-950 light:placeholder:text-zinc-400"
          id="email"
          name="email"
          placeholder="manager@restaurant.com"
          required
          type="email"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-200 light:text-zinc-800" htmlFor="password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className="nexus-focus min-h-11 w-full rounded-xl border border-white/[0.12] bg-white/[0.045] px-3.5 text-sm text-white placeholder:text-zinc-600 light:border-black/[0.14] light:bg-black/[0.025] light:text-zinc-950 light:placeholder:text-zinc-400"
          id="password"
          minLength={8}
          name="password"
          placeholder="Your password"
          required
          type="password"
        />
      </div>
      {state?.error ? (
        <p className="rounded-xl border border-red-400/20 bg-red-400/[0.08] px-3.5 py-3 text-sm text-red-200 light:text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        className="nexus-focus nexus-button-primary min-h-11 w-full rounded-xl px-4 text-sm font-semibold disabled:cursor-wait disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Signing in…" : "Open command center"}
      </button>
    </form>
  );
}
