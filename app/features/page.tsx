import type { Metadata } from "next";
import Link from "next/link";
import MarketingPage from "@/components/MarketingPage";
import FeatureSystems from "@/components/features/FeatureSystems";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata(
  "Features",
  "Explore Nexus AI agents, automation, focused business systems, computer vision, and how they combine inside real operations.",
  "/features",
);

export default function FeaturesPage() {
  return (
    <MarketingPage>
      <section className="mx-auto max-w-7xl px-5 pb-28 pt-20 sm:px-8 sm:pt-28">
        <div className="max-w-4xl">
          <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Nexus capabilities</p>
          <h1 className="nexus-heading mt-5 font-heading text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">Intelligence that understands the operation around it.</h1>
          <p className="nexus-copy mt-6 max-w-3xl text-lg leading-8">Nexus combines AI agents, controlled automation, focused business software and computer vision. The result is not a catalogue of disconnected tools, but a system shaped around the operation.</p>
        </div>

        <FeatureSystems />

        <div className="mt-20 flex flex-col gap-5 border-t border-[var(--nexus-border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="nexus-copy max-w-lg text-sm leading-6">See the live Nexus Agent today, or discuss the operational system you want to build next.</p>
          <div className="flex flex-col gap-3 sm:flex-row"><Link className="nexus-button-secondary nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/demo">Open live demos</Link><Link className="nexus-button-primary nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/contact?source_page=%2Ffeatures">Discuss a workflow <span aria-hidden="true" className="ms-2">→</span></Link></div>
        </div>
      </section>
    </MarketingPage>
  );
}
