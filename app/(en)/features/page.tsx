import type { Metadata } from "next";
import MarketingPage from "@/components/MarketingPage";
import SolutionSystems from "@/components/marketing/SolutionSystems";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata(
  "Features",
  "Explore the intelligent systems, automation, applications, integrations and operational technology TQEN builds around real businesses.",
  "/features",
);

export default function FeaturesPage() {
  return (
    <MarketingPage>
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
        <div className="max-w-3xl">
          <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">What we build</p>
          <h1 className="nexus-heading mt-5 font-heading text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">
            Systems that make the operation easier to run.
          </h1>
          <p className="nexus-copy mt-6 max-w-2xl text-lg leading-8">
            TQEN combines software, automation and AI only where each one is useful. Every engagement begins with the workflow, the people responsible for it and the decisions that matter.
          </p>
        </div>

        <SolutionSystems />
      </section>
    </MarketingPage>
  );
}
