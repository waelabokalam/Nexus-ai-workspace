"use client";

import Link from "next/link";

export default function DemoError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="nexus-page grid min-h-screen place-items-center px-5 text-white sm:px-8">
      <section className="nexus-surface w-full max-w-lg rounded-[var(--nexus-radius-surface)] p-6 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">Demo unavailable</p>
        <h1 className="mt-4 font-heading text-3xl font-medium tracking-[-0.04em] text-white">The product surface could not load.</h1>
        <p className="mt-4 text-sm leading-6 text-zinc-400">Try loading the Demo Hub again. If the issue continues, return to the product overview.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button className="nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200" onClick={reset} type="button">Try again</button>
          <Link className="nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] border border-white/[0.12] px-4 text-sm font-medium text-white transition hover:bg-white/[0.06]" href="/">Return home</Link>
        </div>
      </section>
    </main>
  );
}
