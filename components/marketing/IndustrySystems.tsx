import Link from "next/link";
import { Dumbbell, ScanSearch, UtensilsCrossed } from "lucide-react";
import SectionReveal from "@/components/marketing/SectionReveal";
import { localeHref, type Locale } from "@/lib/i18n/routing";
import { homeEn, type IndustriesCopy } from "@/lib/i18n/home";

const secondaryIcons = [ScanSearch, Dumbbell] as const;

export default function IndustrySystems({
  t = homeEn.industries,
  locale = "en",
}: {
  t?: IndustriesCopy;
  locale?: Locale;
}) {
  return (
    <section className="border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-20 sm:px-8 sm:py-24" id="industries">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="max-w-3xl">
          <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{t.eyebrow}</p>
          <h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl">{t.title}</h2>
          <p className="nexus-copy mt-5 max-w-2xl text-base leading-7">{t.copy}</p>
        </SectionReveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <SectionReveal className="nexus-surface relative flex min-h-[26rem] flex-col rounded-[var(--nexus-radius-surface)] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <UtensilsCrossed aria-hidden="true" className="nexus-heading size-7" strokeWidth={1.5} />
              <span className="nexus-status rounded-full px-3 py-1 text-xs font-medium">{t.flagshipStatus}</span>
            </div>
            <div className="mt-auto max-w-2xl pt-16">
              <h3 className="nexus-heading font-heading text-4xl font-semibold tracking-[-0.05em]">{t.flagshipTitle}</h3>
              <p className="nexus-copy mt-4 max-w-xl text-base leading-7">{t.flagshipCopy}</p>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {t.flagshipPoints.map((point) => <span className="nexus-subtle" key={point}>{point}</span>)}
              </div>
              <Link className="nexus-heading nexus-focus mt-8 inline-flex min-h-11 items-center rounded-[var(--nexus-radius-control)] text-sm font-medium underline decoration-current/25 underline-offset-4 transition hover:decoration-current" href={localeHref("/restaurants", locale)}>
                {t.flagshipLink} <span aria-hidden="true" className="ms-2 inline-block rtl:-scale-x-100">→</span>
              </Link>
            </div>
          </SectionReveal>

          <div className="grid gap-4">
            {t.secondary.map(({ title, status, description, href, action }, index) => {
              const Icon = secondaryIcons[index];
              return (
                <SectionReveal className="rounded-[var(--nexus-radius-surface)] border border-[var(--nexus-border)] p-6" delay={0.05 * (index + 1)} key={title}>
                  <div className="flex items-start justify-between gap-4">
                    <Icon aria-hidden="true" className="nexus-subtle size-6" strokeWidth={1.5} />
                    <span className="nexus-subtle text-xs font-medium">{status}</span>
                  </div>
                  <h3 className="nexus-heading mt-10 font-heading text-2xl font-medium tracking-[-0.04em]">{title}</h3>
                  <p className="nexus-copy mt-3 text-sm leading-6">{description}</p>
                  <Link className="nexus-heading nexus-focus mt-6 inline-flex min-h-10 items-center text-sm font-medium underline decoration-current/20 underline-offset-4 hover:decoration-current" href={localeHref(href, locale)}>{action}</Link>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
