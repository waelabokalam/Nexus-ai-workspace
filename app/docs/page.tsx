import type { Metadata } from "next";
import Link from "next/link";
import MarketingPage from "@/components/MarketingPage";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsNavigation from "@/components/docs/DocsNavigation";
import { pageMetadata } from "@/app/metadata";
import { docsEn, docsShared, type DocsCopy } from "@/lib/i18n/docs";
import { localeHref, type Locale } from "@/lib/i18n/routing";

export const metadata: Metadata = pageMetadata(docsEn.metaTitle, docsEn.metaDescription, "/docs");

const locale: Locale = "en";

function DocSection({ id, title, t, children }: { id: string; title: string; t: DocsCopy; children: React.ReactNode }) {
  const currentIndex = t.sections.findIndex((section) => section.id === id);
  const previous = t.sections[currentIndex - 1];
  const next = t.sections[currentIndex + 1];

  return (
    <section className="scroll-mt-28 border-b border-white/[0.08] pb-10" id={id} tabIndex={-1}>
      <h2 className="font-heading text-2xl font-medium tracking-[-0.035em] text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-7 text-zinc-400">{children}</div>
      {(previous || next) && (
        <nav aria-label={`${title} ${t.sectionNavSuffix}`} className="mt-7 flex items-center justify-between gap-4 text-sm">
          {previous ? <Link className="nexus-focus text-zinc-400 transition hover:text-white" href={`#${previous.id}`}><span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> {previous.title}</Link> : <span />}
          {next ? <Link className="nexus-focus text-right font-medium text-zinc-200 transition hover:text-white" href={`#${next.id}`}>{next.title} <span aria-hidden="true" className="inline-block rtl:-scale-x-100">→</span></Link> : <span />}
        </nav>
      )}
    </section>
  );
}

export default function DocsPage() {
  const t = docsEn;
  const eventRows = docsShared.eventNames.map((event, index) => ({ event, behavior: t.eventBehaviors[index] ?? "" }));

  return (
    <MarketingPage>
      <div className="mx-auto max-w-7xl px-5 pb-28 pt-20 sm:px-8 sm:pt-28">
        <div className="max-w-3xl">
          <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{t.heroEyebrow}</p>
          <h1 className="nexus-heading mt-5 font-heading text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">{t.heroTitle}</h1>
          <p className="nexus-copy mt-6 text-lg leading-8">{t.heroDescription}</p>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[13.5rem_minmax(0,1fr)]">
          <DocsNavigation sections={t.sections} />
          <article className="space-y-10">
            <DocSection id="overview" title={t.sections[0]?.title ?? "Overview"} t={t}>
              <p>{t.overviewBody}</p>
              <aside className="rounded-[var(--nexus-radius-control)] border border-white/[0.1] bg-white/[0.035] p-4 text-sm leading-6 text-zinc-300" role="note"><strong className="font-medium text-white">{t.overviewNoteTitle}</strong> {t.overviewNoteBody}</aside>
            </DocSection>

            <DocSection id="quick-start" title={t.sections[1]?.title ?? "Quick Start"} t={t}>
              <ol className="list-decimal space-y-2 pl-5">{t.quickStartSteps.map((step, index) => <li key={index}>{step.kind === "link" ? <>{step.before}<Link className="nexus-focus text-white underline decoration-white/30 underline-offset-4" href={localeHref(step.linkHref, locale)}>{step.linkText}</Link>{step.after}</> : step.text}</li>)}</ol>
            </DocSection>

            <DocSection id="architecture" title={t.sections[2]?.title ?? "Architecture"} t={t}>
              <p>{t.architectureBody}</p>
              <p className="text-sm text-zinc-500">{docsShared.architectureFlow}</p>
            </DocSection>

            <DocSection id="website-integration" title={t.sections[3]?.title ?? "Website Integration"} t={t}>
              <p>{t.integrationBody1}</p>
              <p>{t.integrationBody2}</p>
            </DocSection>

            <DocSection id="api-reference" title={t.sections[4]?.title ?? "API Reference"} t={t}>
              <p>{t.apiBodyBefore}<code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-zinc-200">{docsShared.browserEndpointCode}</code>{t.apiBodyAfter}</p>
              <CodeBlock code={docsShared.requestExample} label={t.codeLabels.request} />
              <aside className="rounded-[var(--nexus-radius-control)] border border-white/[0.1] bg-white/[0.025] p-4 text-sm leading-6 text-zinc-300" role="note"><strong className="font-medium text-white">{t.apiNoteTitle}</strong> {t.apiNoteBody}</aside>
            </DocSection>

            <DocSection id="sse-event-reference" title={t.sections[5]?.title ?? "SSE Events"} t={t}>
              <p>{t.sseBody}</p>
              <CodeBlock code={docsShared.sseExample} label={t.codeLabels.stream} />
              <div className="overflow-x-auto rounded-[var(--nexus-radius-control)] border border-white/[0.1]">
                <table className="w-full min-w-[34rem] text-left text-sm leading-6">
                  <thead className="border-b border-white/[0.08] bg-white/[0.025] text-xs font-medium uppercase tracking-[0.14em] text-zinc-400"><tr><th className="px-4 py-3">{t.streamTableEvent}</th><th className="px-4 py-3">{t.streamTableBehavior}</th></tr></thead>
                  <tbody>{eventRows.map(({ event, behavior }) => <tr className="border-b border-white/[0.07] last:border-0" key={event}><td className="px-4 py-3 font-mono text-xs text-zinc-200">{event}</td><td className="px-4 py-3 text-zinc-400">{behavior}</td></tr>)}</tbody>
                </table>
              </div>
              <p><code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-zinc-200">{docsShared.deltaCode}</code> {t.streamDeltaSuffix} <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-zinc-200">{docsShared.completedCode}</code> {t.streamCompletedSuffix} <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-zinc-200">{docsShared.failedCode}</code> {t.streamFailedSuffix}</p>
            </DocSection>

            <DocSection id="knowledge-base-setup" title={t.sections[6]?.title ?? "Knowledge Base"} t={t}><p>{t.knowledgeBody}</p></DocSection>
            <DocSection id="adaptive-style-memory" title={t.sections[7]?.title ?? "Adaptive Style"} t={t}><p>{t.adaptiveBody}</p></DocSection>
            <DocSection id="google-calendar-setup" title={t.sections[8]?.title ?? "Google Calendar"} t={t}><p>{t.calendarBody}</p></DocSection>

            <DocSection id="environment-variables" title={t.sections[9]?.title ?? "Environment"} t={t}>
              <p>{t.envBody}</p>
              <CodeBlock code={docsShared.environmentExample} label={t.codeLabels.env} />
            </DocSection>

            <DocSection id="security" title={t.sections[10]?.title ?? "Security"} t={t}><p>{t.securityBody}</p></DocSection>
            <DocSection id="troubleshooting" title={t.sections[11]?.title ?? "Troubleshooting"} t={t}><p>{t.troubleshootingBody}</p></DocSection>
          </article>
        </div>
      </div>
    </MarketingPage>
  );
}
