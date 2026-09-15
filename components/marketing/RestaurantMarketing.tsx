import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  Building2,
  CheckCircle2,
  FileSearch,
  History,
  MessageSquareWarning,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import RestaurantProductPreview from "@/components/marketing/RestaurantProductPreview";
import SectionReveal from "@/components/marketing/SectionReveal";
import { localeHref, type Locale } from "@/lib/i18n/routing";
import type { ProductPreviewCopy } from "@/lib/i18n/home";
import {
  restaurantsEn,
  type RestaurantControlCopy,
  type RestaurantHeroCopy,
  type RestaurantIntegrationCopy,
  type RestaurantIntelligenceCopy,
  type RestaurantManagementCopy,
  type RestaurantPilotCopy,
} from "@/lib/i18n/restaurants";

export function RestaurantHero({ t = restaurantsEn.hero, preview, locale = "en" }: { t?: RestaurantHeroCopy; preview?: ProductPreviewCopy; locale?: Locale }) {
  return (
    <section className="px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-14">
        <SectionReveal>
          <span className="nexus-status inline-flex rounded-full px-3 py-1 text-xs font-medium">{t.status}</span>
          <h1 className="nexus-heading mt-6 font-heading text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl">
            <span className="block">{t.titleA}</span>
            <span className="block">{t.titleB}</span>
          </h1>
          <p className="nexus-copy mt-6 max-w-xl text-lg leading-8">{t.copy}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href={localeHref("/contact?industry=restaurant&intent=pilot", locale)}>{t.primaryCta}</Link>
            <Link className="nexus-button-secondary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="#command-center">{t.secondaryCta}</Link>
          </div>
        </SectionReveal>
        <SectionReveal delay={0.08}><RestaurantProductPreview t={preview} /></SectionReveal>
      </div>
    </section>
  );
}

export function RestaurantManagementStory({ t = restaurantsEn.management }: { t?: RestaurantManagementCopy }) {
  return (
    <section className="border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-20 sm:px-8 sm:py-28" id="command-center">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="max-w-3xl"><h2 className="nexus-heading font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">{t.title}</h2><p className="nexus-copy mt-5 max-w-2xl text-base leading-7">{t.copy}</p></SectionReveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <SectionReveal className="nexus-surface rounded-[var(--nexus-radius-surface)] p-6 sm:p-8">
            <div className="flex items-center gap-3"><Activity aria-hidden="true" className="nexus-heading size-5" strokeWidth={1.5} /><h3 className="nexus-heading text-lg font-medium">{t.briefTitle}</h3></div>
            <p className="nexus-copy mt-4 max-w-2xl text-sm leading-6">{t.briefCopy}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {t.briefColumns.map((item) => <div className="nexus-control rounded-[var(--nexus-radius-control)] p-4" key={item}><p className="nexus-heading text-sm font-medium">{item}</p><p className="nexus-subtle mt-2 text-xs leading-5">{t.briefNote}</p></div>)}
            </div>
          </SectionReveal>
          <SectionReveal className="nexus-surface flex flex-col rounded-[var(--nexus-radius-surface)] p-6 sm:p-8" delay={0.05}>
            <AlertTriangle aria-hidden="true" className="nexus-heading size-6" strokeWidth={1.5} />
            <h3 className="nexus-heading mt-8 text-xl font-medium">{t.exceptionTitle}</h3>
            <p className="nexus-copy mt-3 text-sm leading-6">{t.exceptionCopy}</p>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

export function RestaurantIntelligence({ t = restaurantsEn.intelligence }: { t?: RestaurantIntelligenceCopy }) {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="max-w-3xl"><h2 className="nexus-heading font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">{t.title}</h2></SectionReveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionReveal className="nexus-surface rounded-[var(--nexus-radius-surface)] p-6 sm:p-8">
            <MessageSquareWarning aria-hidden="true" className="nexus-heading size-6" strokeWidth={1.5} />
            <h3 className="nexus-heading mt-8 text-2xl font-medium tracking-[-0.035em]">{t.reputationTitle}</h3>
            <p className="nexus-copy mt-4 text-sm leading-6">{t.reputationCopy}</p>
          </SectionReveal>
          <SectionReveal className="nexus-surface rounded-[var(--nexus-radius-surface)] p-6 sm:p-8" delay={0.05}>
            <FileSearch aria-hidden="true" className="nexus-heading size-6" strokeWidth={1.5} />
            <h3 className="nexus-heading mt-8 text-2xl font-medium tracking-[-0.035em]">{t.supplierTitle}</h3>
            <p className="nexus-copy mt-4 max-w-2xl text-sm leading-6">{t.supplierCopy}</p>
          </SectionReveal>
          <SectionReveal className="nexus-surface grid gap-8 rounded-[var(--nexus-radius-surface)] p-6 sm:p-8 lg:col-span-2 lg:grid-cols-[auto_1fr_1fr] lg:items-center">
            <ArrowDownToLine aria-hidden="true" className="nexus-heading size-7" strokeWidth={1.5} />
            <div><h3 className="nexus-heading text-2xl font-medium tracking-[-0.035em]">{t.extractionTitle}</h3><p className="nexus-copy mt-3 text-sm leading-6">{t.extractionCopy}</p></div>
            <div className="nexus-control rounded-[var(--nexus-radius-control)] p-4"><p className="nexus-heading text-sm font-medium">{t.reviewTitle}</p><p className="nexus-subtle mt-2 text-xs leading-5">{t.reviewCopy}</p></div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

export function RestaurantControlAndScope({ t = restaurantsEn.control }: { t?: RestaurantControlCopy }) {
  return (
    <section className="border-y border-[var(--nexus-border)] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal>
          <div className="flex items-center gap-3"><UsersRound aria-hidden="true" className="nexus-heading size-5" strokeWidth={1.5} /><h2 className="nexus-heading font-heading text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{t.orgTitle}</h2></div>
          <p className="nexus-copy mt-5 text-base leading-7">{t.orgCopy}</p>
          <div className="mt-8 flex items-center gap-3"><Building2 aria-hidden="true" className="nexus-subtle size-5" strokeWidth={1.5} /><p className="nexus-heading text-sm font-medium">{t.branchNote}</p></div>
          <div className="mt-4 flex items-center gap-3"><History aria-hidden="true" className="nexus-subtle size-5" strokeWidth={1.5} /><p className="nexus-heading text-sm font-medium">{t.historyNote}</p></div>
        </SectionReveal>
        <SectionReveal>
          <div className="flex items-center gap-3"><ShieldCheck aria-hidden="true" className="nexus-heading size-5" strokeWidth={1.5} /><h2 className="nexus-heading font-heading text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{t.controlTitle}</h2></div>
          <dl className="mt-7 grid gap-3">
            {t.routes.map(({ term, detail }) => <div className="grid grid-cols-[6rem_1fr] gap-4 border-b border-[var(--nexus-border)] pb-4" key={term}><dt className="nexus-heading text-xs font-semibold tracking-[0.04em]">{term}</dt><dd className="nexus-copy text-sm leading-6">{detail}</dd></div>)}
          </dl>
        </SectionReveal>
      </div>
    </section>
  );
}

export function RestaurantIntegrationBoundary({ t = restaurantsEn.integration }: { t?: RestaurantIntegrationCopy }) {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="max-w-3xl"><h2 className="nexus-heading font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">{t.title}</h2><p className="nexus-copy mt-5 max-w-2xl text-base leading-7">{t.copy}</p></SectionReveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionReveal className="nexus-surface rounded-[var(--nexus-radius-surface)] p-6 sm:p-8"><h3 className="nexus-heading text-xl font-medium">{t.builtTitle}</h3><ul className="mt-6 grid gap-3 sm:grid-cols-2">{t.built.map((item) => <li className="nexus-copy flex gap-2.5 text-sm leading-6" key={item}><CheckCircle2 aria-hidden="true" className="nexus-heading mt-1 size-4 shrink-0" strokeWidth={1.5} />{item}</li>)}</ul></SectionReveal>
          <SectionReveal className="nexus-surface rounded-[var(--nexus-radius-surface)] p-6 sm:p-8" delay={0.05}><h3 className="nexus-heading text-xl font-medium">{t.nextTitle}</h3><p className="nexus-copy mt-3 text-sm leading-6">{t.nextCopy}</p><ul className="mt-6 space-y-3">{t.next.map((item) => <li className="nexus-control rounded-lg px-3 py-2.5 text-sm nexus-copy" key={item}>{item}</li>)}</ul></SectionReveal>
        </div>
      </div>
    </section>
  );
}

export function RestaurantPilot({ t = restaurantsEn.pilot, locale = "en" }: { t?: RestaurantPilotCopy; locale?: Locale }) {
  return (
    <section className="border-t border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-20 sm:px-8 sm:py-28" id="restaurant-pilot">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-16">
        <SectionReveal><h2 className="nexus-heading font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">{t.title}</h2><p className="nexus-copy mt-5 max-w-2xl text-base leading-7">{t.copy}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href={localeHref("/contact?industry=restaurant&intent=pilot", locale)}>{t.primaryCta}</Link><Link className="nexus-button-secondary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/restaurant/login">{t.secondaryCta}</Link></div></SectionReveal>
        <SectionReveal className="nexus-surface rounded-[var(--nexus-radius-surface)] p-6 sm:p-8"><h3 className="nexus-heading text-sm font-medium">{t.examinesTitle}</h3><ul className="mt-6 space-y-4">{t.checks.map((item) => <li className="nexus-copy flex gap-3 text-sm leading-6" key={item}><CheckCircle2 aria-hidden="true" className="nexus-heading mt-1 size-4 shrink-0" strokeWidth={1.5} />{item}</li>)}</ul></SectionReveal>
      </div>
    </section>
  );
}
