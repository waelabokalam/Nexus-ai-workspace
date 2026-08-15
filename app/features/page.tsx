import type { Metadata } from "next";
import Link from "next/link";
import MarketingPage from "@/components/MarketingPage";
import FeatureSystems from "@/components/features/FeatureSystems";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata(
  "Features",
  "Explore how Nexus understands, remembers, responds, retrieves and acts across business communication workflows.",
  "/features",
);

export default function FeaturesPage() {
  return (
    <MarketingPage>
      <section className="mx-auto max-w-7xl px-5 pb-28 pt-20 sm:px-8 sm:pt-28">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">Nexus capabilities</p>
          <h1 className="mt-5 font-heading text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">A connected operating system, not a loose set of AI features.</h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400">Nexus connects how a business understands, responds, remembers, retrieves and acts—so communication can stay grounded and operational.</p>
        </div>

        <FeatureSystems />

        <div className="mt-20 flex flex-col gap-5 border-t border-white/[0.1] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-lg text-sm leading-6 text-zinc-500">Start with a real support conversation and watch only the workflow activity the engine emits.</p>
          <Link className="nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] bg-white px-5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200" href="/demo">See the live workspace <span aria-hidden="true" className="ml-2">→</span></Link>
        </div>
      </section>
    </MarketingPage>
  );
}
