import type { Metadata } from "next";
import Link from "next/link";
import { arPageMetadata } from "@/app/metadata";
import MarketingPage from "@/components/MarketingPage";
import CraveItSystemMap from "@/components/marketing/CraveItSystemMap";
import SectionReveal from "@/components/marketing/SectionReveal";
import { localeHref } from "@/lib/i18n/routing";
import { craveItAr, craveItMetaAr } from "@/lib/i18n/casestudy";

export const metadata: Metadata = arPageMetadata(
  craveItMetaAr.title,
  craveItMetaAr.description,
  "/case-studies/crave-it",
);

export default function ArabicCraveItCaseStudyPage() {
  const t = craveItAr;
  return (
    <MarketingPage locale="ar">
      <section className="px-5 pb-24 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-20">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{t.hero.eyebrow}</p>
              <span className="nexus-status rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em]">{t.hero.badge}</span>
            </div>
            <h1 className="nexus-heading mt-5 font-heading text-6xl font-semibold tracking-[-0.065em] sm:text-7xl">Crave It</h1>
            <p className="nexus-heading mt-5 max-w-xl font-heading text-2xl font-medium leading-tight tracking-[-0.04em] sm:text-3xl">
              {t.hero.subtitle}
            </p>
            <p className="nexus-copy mt-6 max-w-xl text-base leading-7">
              {t.hero.copy}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href={localeHref("/contact?source=crave-it", "ar")}>
                {t.hero.primaryCta} <span aria-hidden="true" className="ms-2 inline-block rtl:-scale-x-100">→</span>
              </Link>
              <Link className="nexus-button-secondary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href={localeHref("/features#business-systems", "ar")}>
                {t.hero.secondaryCta}
              </Link>
            </div>
          </div>
          <CraveItSystemMap t={t.map} />
        </div>
      </section>

      <section className="border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <SectionReveal>
            <div>
              <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{t.problem.eyebrow}</p>
              <h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
                {t.problem.title}
              </h2>
            </div>
          </SectionReveal>
          <SectionReveal>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="nexus-heading text-base font-semibold">{t.problem.customerTitle}</h3>
                <p className="nexus-copy mt-3 text-sm leading-6">{t.problem.customerCopy}</p>
              </div>
              <div>
                <h3 className="nexus-heading text-base font-semibold">{t.problem.businessTitle}</h3>
                <p className="nexus-copy mt-3 text-sm leading-6">{t.problem.businessCopy}</p>
              </div>
              <p className="nexus-heading border-s-2 border-[var(--nexus-text)] ps-5 text-lg leading-8 sm:col-span-2">
                {t.problem.pullQuote}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{t.built.eyebrow}</p>
            <h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              {t.built.title}
            </h2>
          </div>
          <div className="mt-14 border-t border-[var(--nexus-border)]">
            {t.built.items.map(({ title, description }, index) => (
              <SectionReveal key={title}>
                <article className="grid gap-4 border-b border-[var(--nexus-border)] py-7 sm:grid-cols-[4rem_0.65fr_1.35fr] sm:items-start sm:gap-8">
                  <span className="nexus-subtle text-xs tabular-nums">0{index + 1}</span>
                  <h3 className="nexus-heading text-base font-semibold">{title}</h3>
                  <p className="nexus-copy max-w-2xl text-sm leading-6">{description}</p>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{t.proof.eyebrow}</p>
              <h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em]">{t.proof.title}</h2>
            </div>
            <p className="nexus-copy max-w-2xl text-base leading-7 lg:justify-self-end">
              {t.proof.copy}
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="nexus-frame mx-auto max-w-7xl rounded-[var(--nexus-radius-surface)] p-1">
          <div className="nexus-surface rounded-[calc(var(--nexus-radius-surface)-0.3rem)] px-6 py-16 text-center sm:px-10 sm:py-20">
            <h2 className="nexus-heading mx-auto max-w-4xl font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">{t.final.title}</h2>
            <p className="nexus-copy mx-auto mt-5 max-w-xl text-base leading-7">{t.final.copy}</p>
            <Link className="nexus-button-primary nexus-focus mt-9 inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href={localeHref("/contact?source=crave-it", "ar")}>
              {t.final.cta} <span aria-hidden="true" className="ms-2 inline-block rtl:-scale-x-100">→</span>
            </Link>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
