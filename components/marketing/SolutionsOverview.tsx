import Link from "next/link";
import {
  Blocks,
  Bot,
  Cable,
  Eye,
  PanelsTopLeft,
  Route,
  Smartphone,
  Workflow,
} from "lucide-react";
import SectionReveal from "@/components/marketing/SectionReveal";
import { localeHref, type Locale } from "@/lib/i18n/routing";
import { homeEn, type SolutionsOverviewCopy } from "@/lib/i18n/home";

const capabilityIcons = [Bot, Workflow, Blocks, Smartphone, PanelsTopLeft, Cable, Eye, Route] as const;

export default function SolutionsOverview({
  t = homeEn.solutionsOverview,
  locale = "en",
}: {
  t?: SolutionsOverviewCopy;
  locale?: Locale;
}) {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28" id="solutions">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="max-w-3xl">
          <h2 className="nexus-heading font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl">{t.title}</h2>
          <p className="nexus-copy mt-5 max-w-2xl text-base leading-7">{t.copy}</p>
        </SectionReveal>

        <div className="mt-12 grid gap-x-10 gap-y-0 border-y border-[var(--nexus-border)] md:grid-cols-2">
          {t.capabilities.map(({ title, description }, index) => {
            const Icon = capabilityIcons[index];
            return (
              <SectionReveal className="grid min-h-36 grid-cols-[2.5rem_1fr] gap-4 border-b border-[var(--nexus-border)] py-6 md:[&:nth-last-child(-n+2)]:border-b-0" delay={(index % 2) * 0.04} key={title}>
                <span className="nexus-control grid size-10 place-items-center rounded-[var(--nexus-radius-control)]">
                  <Icon aria-hidden="true" className="nexus-heading size-[1.125rem]" strokeWidth={1.55} />
                </span>
                <div>
                  <h3 className="nexus-heading font-heading text-lg font-medium tracking-[-0.025em]">{title}</h3>
                  <p className="nexus-copy mt-2 max-w-md text-sm leading-6">{description}</p>
                </div>
              </SectionReveal>
            );
          })}
        </div>

        <SectionReveal className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="nexus-copy max-w-2xl text-sm leading-6">{t.note}</p>
          <Link className="nexus-button-secondary nexus-focus inline-flex min-h-11 shrink-0 items-center justify-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium" href={localeHref("/features", locale)}>{t.link}</Link>
        </SectionReveal>
      </div>
    </section>
  );
}
