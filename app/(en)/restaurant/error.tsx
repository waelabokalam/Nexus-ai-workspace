"use client";

import { useEffect } from "react";

export default function RestaurantError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Restaurant workspace failed to load", error);
  }, [error]);

  return (
    <main className="nexus-page flex min-h-screen flex-1 items-center justify-center px-5 py-12 text-white">
      <section className="nexus-surface w-full max-w-lg rounded-[var(--nexus-radius-surface)] p-7 text-center sm:p-9">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Manager Command Center</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white light:text-zinc-950">The workspace could not be loaded</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400 light:text-zinc-600">
          Check the Supabase configuration and try again. No restaurant action was performed.
        </p>
        <button className="nexus-focus nexus-button-primary mt-7 min-h-10 rounded-xl px-4 text-sm font-medium" onClick={reset} type="button">Try again</button>
      </section>
    </main>
  );
}
