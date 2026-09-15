import Link from "next/link";
import { ArrowRight, CheckCircle2, Languages, MessageSquareText, Search } from "lucide-react";
import SectionReveal from "@/components/marketing/SectionReveal";
import { localeHref, type Locale } from "@/lib/i18n/routing";
import { homeEn, type AgentInviteCopy } from "@/lib/i18n/home";

const abilityIcons = [MessageSquareText, Search, Languages, CheckCircle2] as const;

export default function NexusAgentInvitation({
  t = homeEn.agentInvite,
  locale = "en",
}: {
  t?: AgentInviteCopy;
  locale?: Locale;
}) {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28" id="agent">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="nexus-surface grid overflow-hidden rounded-[var(--nexus-radius-surface)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 sm:p-9 lg:p-12">
            <p className="nexus-subtle text-sm font-medium">{t.eyebrow}</p>
            <h2 className="nexus-heading mt-4 max-w-2xl font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl">{t.title}</h2>
            <p className="nexus-copy mt-5 max-w-xl text-base leading-7">{t.copy}</p>
            <Link className="nexus-button-primary nexus-focus mt-8 inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href={localeHref("/demo/support", locale)}>{t.cta} <ArrowRight aria-hidden="true" className="ms-2 inline-block size-4 rtl:-scale-x-100" strokeWidth={1.6} /></Link>
          </div>

          <div className="border-t border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] p-6 sm:p-9 lg:border-s lg:border-t-0 lg:p-12">
            <p className="nexus-heading text-sm font-medium">{t.capabilitiesTitle}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {t.abilities.map((label, index) => {
                const Icon = abilityIcons[index];
                return <div className="nexus-surface flex min-h-20 items-center gap-3 rounded-[var(--nexus-radius-control)] px-4" key={label}><Icon aria-hidden="true" className="nexus-heading size-5 shrink-0" strokeWidth={1.5} /><span className="nexus-copy text-sm">{label}</span></div>;
              })}
            </div>
            <p className="nexus-subtle mt-6 text-xs leading-5">{t.note}</p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
