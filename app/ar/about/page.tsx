import type { Metadata } from "next";
import MarketingPage from "@/components/MarketingPage";
import { arPageMetadata } from "@/app/metadata";
import { aboutAr } from "@/lib/i18n/about";

export const metadata: Metadata = arPageMetadata(aboutAr.metadataTitle, aboutAr.metadataDescription, "/about");

export default function ArabicAboutPage() {
  return (
    <MarketingPage locale="ar">
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{aboutAr.eyebrow}</p>
            <h1 className="nexus-heading mt-5 font-heading text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">{aboutAr.title}</h1>
          </div>
          <p className="nexus-copy max-w-2xl text-lg leading-8 lg:justify-self-end">
            {aboutAr.intro}
          </p>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-[var(--nexus-radius-surface)] bg-[var(--nexus-border)] md:grid-cols-2">
          {aboutAr.principles.map((principle) => (
            <article className="bg-[var(--nexus-surface)] p-6 sm:p-8" key={principle.title}>
              <h2 className="nexus-heading font-heading text-2xl font-semibold tracking-[-0.04em]">{principle.title}</h2>
              <p className="nexus-copy mt-4 max-w-lg text-sm leading-6">{principle.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-20 grid gap-8 border-t border-[var(--nexus-border)] pt-10 lg:grid-cols-[0.7fr_1.3fr]">
          <h2 className="nexus-heading font-heading text-3xl font-semibold tracking-[-0.045em]">{aboutAr.workStandsTitle}</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {aboutAr.workStands.map((item) => (
              <div key={item.title}><p className="nexus-heading text-sm font-semibold">{item.title}</p><p className="nexus-copy mt-2 text-sm leading-6">{item.description}</p></div>
            ))}
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
