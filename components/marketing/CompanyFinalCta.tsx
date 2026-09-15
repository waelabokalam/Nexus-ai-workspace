import Link from "next/link";
import SectionReveal from "@/components/marketing/SectionReveal";
import { localeHref, type Locale } from "@/lib/i18n/routing";
import { homeEn, type FinalCtaCopy } from "@/lib/i18n/home";

export default function CompanyFinalCta({
  t = homeEn.finalCta,
  locale = "en",
}: {
  t?: FinalCtaCopy;
  locale?: Locale;
}) {
  return (
    <section className="border-t border-[var(--nexus-border)] px-5 py-20 sm:px-8 sm:py-24">
      <SectionReveal className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="nexus-heading max-w-3xl font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl">{t.title}</h2>
          <p className="nexus-copy mt-4 max-w-xl text-base leading-7">{t.copy}</p>
        </div>
        <Link className="nexus-button-primary nexus-focus inline-flex min-h-12 shrink-0 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href={localeHref("/contact", locale)}>{t.cta} <span aria-hidden="true" className="ms-2 inline-block rtl:-scale-x-100">→</span></Link>
      </SectionReveal>
    </section>
  );
}
