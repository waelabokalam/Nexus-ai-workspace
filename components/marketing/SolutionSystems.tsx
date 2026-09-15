import Link from "next/link";
import {
  AppWindow,
  Blocks,
  Bot,
  Eye,
  PanelsTopLeft,
  Workflow,
} from "lucide-react";
import SectionReveal from "@/components/marketing/SectionReveal";
import { localeHref, type Locale } from "@/lib/i18n/routing";
import { homeEn, type SolutionSystemsCopy } from "@/lib/i18n/home";

const solutionIcons = [Bot, PanelsTopLeft, AppWindow, Blocks, Eye, Workflow] as const;

export default function SolutionSystems({
  t = homeEn.solutionSystems,
  locale = "en",
}: {
  t?: SolutionSystemsCopy;
  locale?: Locale;
}) {
  return (
    <div className="mt-20 border-t border-[var(--nexus-border)]">
      {t.solutions.map((solution, index) => {
        const Icon = solutionIcons[index];
        return (
          <SectionReveal key={solution.id}>
            <article
              className="scroll-mt-28 border-b border-[var(--nexus-border)] py-14 sm:py-18"
              id={solution.id}
            >
              <div className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
                <div>
                  <div className="flex items-center gap-4">
                    <span className="nexus-control grid size-11 place-items-center rounded-[var(--nexus-radius-control)]">
                      <Icon aria-hidden="true" className="size-5 text-[var(--nexus-text)]" strokeWidth={1.7} />
                    </span>
                    <span className="nexus-subtle text-xs tabular-nums">{solution.number}</span>
                  </div>
                  <p className="nexus-subtle mt-8 text-xs font-medium uppercase tracking-[0.14em]">{solution.status}</p>
                  <h2 className="nexus-heading mt-3 max-w-md font-heading text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                    {solution.title}
                  </h2>
                </div>

                <div className="grid gap-9 sm:grid-cols-3 sm:gap-6">
                  <div>
                    <h3 className="nexus-subtle text-xs font-medium uppercase tracking-[0.13em]">{t.frictionLabel}</h3>
                    <p className="nexus-copy mt-3 text-sm leading-6">{solution.problem}</p>
                  </div>
                  <div>
                    <h3 className="nexus-subtle text-xs font-medium uppercase tracking-[0.13em]">{t.approachLabel}</h3>
                    <p className="nexus-copy mt-3 text-sm leading-6">{solution.approach}</p>
                  </div>
                  <div>
                    <h3 className="nexus-subtle text-xs font-medium uppercase tracking-[0.13em]">{t.outcomeLabel}</h3>
                    <p className="nexus-heading mt-3 text-sm leading-6">{solution.result}</p>
                  </div>
                  <ul className="grid gap-2 sm:col-span-3 sm:grid-cols-2 xl:grid-cols-4" aria-label={solution.title}>
                    {solution.examples.map((example) => (
                      <li className="nexus-control rounded-xl px-4 py-3 text-xs text-[var(--nexus-text-secondary)]" key={example}>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </SectionReveal>
        );
      })}

      <div className="flex flex-col gap-5 py-12 sm:flex-row sm:items-center sm:justify-between">
        <p className="nexus-copy max-w-xl text-sm leading-6">
          {t.closing}
        </p>
        <Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href={localeHref("/contact", locale)}>
          {t.cta} <span aria-hidden="true" className="ms-2 inline-block rtl:-scale-x-100">→</span>
        </Link>
      </div>
    </div>
  );
}
