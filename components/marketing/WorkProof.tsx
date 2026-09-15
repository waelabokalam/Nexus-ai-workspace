import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, UtensilsCrossed } from "lucide-react";
import SectionReveal from "@/components/marketing/SectionReveal";
import { localeHref, type Locale } from "@/lib/i18n/routing";
import { homeEn, type ProofCopy } from "@/lib/i18n/home";

export default function WorkProof({
  t = homeEn.proof,
  locale = "en",
}: {
  t?: ProofCopy;
  locale?: Locale;
}) {
  const crave = t.crave;
  const velvet = t.velvet;
  return (
    <section className="border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-20 sm:px-8 sm:py-28" id="work">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="max-w-3xl">
          <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{t.eyebrow}</p>
          <h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">{t.title}</h2>
          <p className="nexus-copy mt-5 max-w-2xl text-base leading-7">{t.copy}</p>
        </SectionReveal>

        {/* Flagship: TQEN product, TQEN visual language */}
        <SectionReveal className="nexus-surface mt-12 grid gap-8 rounded-[var(--nexus-radius-surface)] p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="nexus-status rounded-full px-3 py-1 text-xs font-medium">{t.flagshipStatus}</span>
              <span className="nexus-subtle text-xs">{t.flagshipLive}</span>
            </div>
            <h3 className="nexus-heading mt-5 flex items-center gap-3 font-heading text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              <UtensilsCrossed aria-hidden="true" className="size-8 shrink-0" strokeWidth={1.5} />
              {t.flagshipTitle}
            </h3>
            <p className="nexus-copy mt-4 max-w-xl text-base leading-7">{t.flagshipCopy}</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {t.flagshipPoints.map((point) => <span className="nexus-subtle" key={point}>{point}</span>)}
            </div>
            <Link className="nexus-button-primary nexus-focus mt-8 inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href={localeHref("/restaurants", locale)}>
              {t.flagshipLink} <ArrowRight aria-hidden="true" className="ms-2 inline-block size-4 rtl:-scale-x-100" strokeWidth={1.6} />
            </Link>
          </div>
          <div className="nexus-control grid gap-3 rounded-[var(--nexus-radius-control)] p-5" aria-label={t.flagshipScopeLabel}>
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">{t.flagshipScopeLabel}</p>
            <ul className="space-y-3">
              {t.flagshipScope.map((item) => (
                <li className="nexus-heading border-b border-[var(--nexus-border)] pb-3 text-sm last:border-0 last:pb-0" key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </SectionReveal>

        {/* Client work: their brands, their visual language */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <SectionReveal className="flex min-h-80 flex-col overflow-hidden rounded-[var(--nexus-radius-surface)] border border-[#A0D0E0]/25 bg-[#0E2A33] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex rounded-[1.75rem] bg-[#102b35] px-7 py-5 sm:px-9 sm:py-6">
                <Image alt="Crave It" className="h-12 w-auto sm:h-14" height={56} src="/brands/crave-it-mark.webp" width={60} />
              </span>
              <span className="shrink-0 rounded-full border border-[#A0D0E0]/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[#A0D0E0]">{crave.tag}</span>
            </div>
            <div className="pt-10">
              <h3 className="text-2xl font-black uppercase leading-none tracking-tight text-white sm:text-3xl">{crave.title}</h3>
              <p className="mt-3 max-w-md text-sm font-medium leading-6 text-[#A0D0E0]">{crave.definition}</p>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A0D0E0]/70">{crave.builtLabel}</p>
              <ul className="mt-3 space-y-2">
                {crave.built.map((item) => (
                  <li className="flex gap-2.5 text-[13px] leading-5 text-white/90" key={item}><span aria-hidden="true" className="mt-[7px] size-1 shrink-0 rounded-full bg-[#A0D0E0]" />{item}</li>
                ))}
              </ul>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A0D0E0]/70">{crave.valueLabel}</p>
              <ul className="mt-3 space-y-2">
                {crave.value.map((item) => (
                  <li className="flex gap-2.5 text-[13px] leading-5 text-white/75" key={item}><span aria-hidden="true" className="mt-[7px] size-1 shrink-0 rounded-full bg-[#A0D0E0]/60" />{item}</li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
                {crave.external ? (
                  <a className="nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] bg-[#A0D0E0] px-5 text-sm font-semibold text-[#0E2A33] transition hover:bg-[#102b35] hover:text-white" href={crave.primaryHref} rel="noopener noreferrer" target="_blank">
                    {crave.primaryCta} <ArrowUpRight aria-hidden="true" className="ms-2 inline-block size-4 rtl:-scale-x-100" strokeWidth={1.6} />
                  </a>
                ) : (
                  <Link className="nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] bg-[#A0D0E0] px-5 text-sm font-semibold text-[#0E2A33] transition hover:bg-[#102b35] hover:text-white" href={localeHref(crave.primaryHref, locale)}>
                    {crave.primaryCta} <ArrowUpRight aria-hidden="true" className="ms-2 inline-block size-4 rtl:-scale-x-100" strokeWidth={1.6} />
                  </Link>
                )}
                {crave.secondaryCta && (
                  <Link className="nexus-focus inline-flex min-h-10 items-center rounded-lg text-sm font-medium text-[#A0D0E0]/80 underline decoration-transparent underline-offset-4 transition hover:text-[#A0D0E0] hover:decoration-[#A0D0E0]/40" href={localeHref(crave.secondaryHref ?? "/", locale)}>
                    {crave.secondaryCta} <ArrowUpRight aria-hidden="true" className="ms-1.5 inline-block size-4 rtl:-scale-x-100" strokeWidth={1.6} />
                  </Link>
                )}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal className="flex min-h-80 flex-col overflow-hidden rounded-[var(--nexus-radius-surface)] border border-[#E14762]/30 bg-[#E5D5D0] p-6 sm:p-8" delay={0.05}>
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex rounded-[1.75rem] bg-[#FFB7C0] px-7 py-5 sm:px-9 sm:py-6">
                <Image alt="Velvet" className="w-32 sm:w-44" height={58} src="/brands/velvet-logo.webp" width={176} />
              </span>
              <span className="shrink-0 rounded-full border border-[#E14762]/50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[#E14762]">{velvet.tag}</span>
            </div>
            <div className="pt-10">
              <h3 className="font-heading text-2xl font-semibold tracking-[-0.03em] text-black sm:text-3xl">{velvet.title}</h3>
              <p className="mt-3 max-w-md text-sm font-medium leading-6 text-[#625B57]">{velvet.definition}</p>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#E14762]">{velvet.builtLabel}</p>
              <ul className="mt-3 space-y-2">
                {velvet.built.map((item) => (
                  <li className="flex gap-2.5 text-[13px] leading-5 text-[#625B57]" key={item}><span aria-hidden="true" className="mt-[7px] size-1 shrink-0 rounded-full bg-[#E14762]" />{item}</li>
                ))}
              </ul>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#E14762]">{velvet.valueLabel}</p>
              <ul className="mt-3 space-y-2">
                {velvet.value.map((item) => (
                  <li className="flex gap-2.5 text-[13px] leading-5 text-[#625B57]" key={item}><span aria-hidden="true" className="mt-[7px] size-1 shrink-0 rounded-full bg-[#E14762]/70" />{item}</li>
                ))}
              </ul>
              <div className="mt-7">
                {velvet.external ? (
                  <a className="nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] bg-[#FF435B] px-5 text-sm font-semibold text-white transition hover:bg-[#E14762]" href={velvet.primaryHref} rel="noopener noreferrer" target="_blank">
                    {velvet.primaryCta} <ArrowUpRight aria-hidden="true" className="ms-2 inline-block size-4 rtl:-scale-x-100" strokeWidth={1.6} />
                  </a>
                ) : (
                  <Link className="nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] bg-[#FF435B] px-5 text-sm font-semibold text-white transition hover:bg-[#E14762]" href={localeHref(velvet.primaryHref, locale)}>
                    {velvet.primaryCta} <ArrowUpRight aria-hidden="true" className="ms-2 inline-block size-4 rtl:-scale-x-100" strokeWidth={1.6} />
                  </Link>
                )}
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* Compact built-for strip */}
        <SectionReveal className="mt-10 flex flex-col gap-5 border-t border-[var(--nexus-border)] pt-8 sm:flex-row sm:items-center">
          <p className="nexus-subtle shrink-0 text-xs font-medium uppercase tracking-[0.16em]">{t.stripLabel}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link aria-label="Crave It case study" className="nexus-focus inline-flex min-h-10 items-center gap-3 rounded-lg py-1" href={localeHref("/case-studies/crave-it", locale)}>
              <Image alt="" aria-hidden="true" className="h-7 w-auto" height={26} src="/brands/crave-it-mark.webp" width={28} />
              <span className="nexus-copy text-sm font-semibold">Crave It</span>
            </Link>
            <a aria-label="Velvet website (external)" className="nexus-focus inline-flex min-h-10 items-center gap-3 rounded-lg py-1" href="https://velvets.fit/" rel="noopener noreferrer" target="_blank">
              <Image alt="" aria-hidden="true" className="h-7 w-auto" height={23} src="/brands/velvet-logo.webp" width={70} />
              <span className="nexus-copy text-sm font-semibold">Velvet</span>
            </a>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
