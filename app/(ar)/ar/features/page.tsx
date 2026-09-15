import type { Metadata } from "next";
import MarketingPage from "@/components/MarketingPage";
import SolutionSystems from "@/components/marketing/SolutionSystems";
import { arPageMetadata } from "@/app/metadata";
import { featuresAr } from "@/lib/i18n/features";
import { homeAr } from "@/lib/i18n/home";

export const metadata: Metadata = arPageMetadata(
  featuresAr.metaTitle,
  featuresAr.metaDescription,
  "/features",
);

export default function ArabicFeaturesPage() {
  return (
    <MarketingPage locale="ar">
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
        <div className="max-w-3xl">
          <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{featuresAr.header.eyebrow}</p>
          <h1 className="nexus-heading mt-5 font-heading text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">
            {featuresAr.header.title}
          </h1>
          <p className="nexus-copy mt-6 max-w-2xl text-lg leading-8">
            {featuresAr.header.copy}
          </p>
        </div>

        <SolutionSystems locale="ar" t={homeAr.solutionSystems} />
      </section>
    </MarketingPage>
  );
}
