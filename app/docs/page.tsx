import type { Metadata } from "next";
import Link from "next/link";
import MarketingPage from "@/components/MarketingPage";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsNavigation from "@/components/docs/DocsNavigation";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata("Documentation", "A practical guide to the current Nexus website workspace and communication engine capabilities.", "/docs");

const sections = [
  { id: "overview", title: "Overview" },
  { id: "quick-start", title: "Quick Start" },
  { id: "architecture", title: "Architecture" },
  { id: "website-integration", title: "Website Integration" },
  { id: "api-reference", title: "API Reference" },
  { id: "sse-event-reference", title: "SSE Events" },
  { id: "knowledge-base-setup", title: "Knowledge Base" },
  { id: "adaptive-style-memory", title: "Adaptive Style" },
  { id: "google-calendar-setup", title: "Google Calendar" },
  { id: "environment-variables", title: "Environment" },
  { id: "security", title: "Security" },
  { id: "troubleshooting", title: "Troubleshooting" },
] as const;

const requestExample = `POST /api/demo/support
Content-Type: application/json

{
  "conversation_id": "session-conversation-id",
  "customer_id": "session-customer-id",
  "message": "What are your pricing plans?"
}`;

const sseExample = `event: response.delta
data: {"type":"response.delta","payload":{"text":"Here is how…"}}

event: response.completed
data: {"type":"response.completed","payload":{"intent":"faq"}}`;

const environmentExample = `NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_CONTACT_EMAIL=hello@your-domain.com

NEXUS_BACKEND_URL=http://127.0.0.1:8000
NEXUS_DEVELOPMENT_API_KEY=replace-with-server-only-key`;

function DocSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const currentIndex = sections.findIndex((section) => section.id === id);
  const previous = sections[currentIndex - 1];
  const next = sections[currentIndex + 1];

  return (
    <section className="scroll-mt-28 border-b border-white/[0.08] pb-10" id={id} tabIndex={-1}>
      <h2 className="font-heading text-2xl font-medium tracking-[-0.035em] text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-7 text-zinc-400">{children}</div>
      {(previous || next) && (
        <nav aria-label={`${title} documentation navigation`} className="mt-7 flex items-center justify-between gap-4 text-sm">
          {previous ? <Link className="nexus-focus text-zinc-400 transition hover:text-white" href={`#${previous.id}`}>← {previous.title}</Link> : <span />}
          {next ? <Link className="nexus-focus text-right font-medium text-zinc-200 transition hover:text-white" href={`#${next.id}`}>{next.title} →</Link> : <span />}
        </nav>
      )}
    </section>
  );
}

const eventRows = [
  ["request.started", "The browser message reached the engine."],
  ["request.validated", "The request passed the engine’s validation stage."],
  ["memory.loaded", "Conversation context was emitted as loaded."],
  ["intent.detected", "The engine emitted an intent result."],
  ["retrieval.started", "Business-knowledge retrieval began."],
  ["retrieval.completed", "Business-knowledge retrieval completed."],
  ["response.started", "The response stage began."],
  ["response.delta", "Safe assistant text arrived in payload.text."],
  ["response.completed", "The request completed successfully."],
  ["request.failed", "The request failed; the workspace displays a safe recovery message."],
] as const;

export default function DocsPage() {
  return (
    <MarketingPage>
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">Documentation</p>
          <h1 className="mt-5 font-heading text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">Operate the conversation with confidence.</h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400">A practical guide to the current Nexus website workspace, its streaming behavior and the capabilities that support it.</p>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[13.5rem_minmax(0,1fr)]">
          <DocsNavigation sections={sections} />
          <article className="space-y-10">
            <DocSection id="overview" title="Overview">
              <p>Nexus is an AI operating system for business communication. The public product currently demonstrates a website support workspace connected to the Nexus Engine.</p>
              <aside className="rounded-[var(--nexus-radius-control)] border border-white/[0.1] bg-white/[0.035] p-4 text-sm leading-6 text-zinc-300" role="note"><strong className="font-medium text-white">Current public scope.</strong> Customer Support is the live workspace. Other scenarios, integrations and channels are planned rather than functioning public demos.</aside>
            </DocSection>

            <DocSection id="quick-start" title="Quick Start">
              <ol className="list-decimal space-y-2 pl-5"><li>Open the <Link className="nexus-focus text-white underline decoration-white/30 underline-offset-4" href="/demo">Demo Hub</Link>.</li><li>Choose Customer Support.</li><li>Send a message in English, Arabic or Turkish and observe the real workflow events emitted for that request.</li></ol>
            </DocSection>

            <DocSection id="architecture" title="Architecture">
              <p>The browser sends a message to a Next.js server route. That route keeps development credentials server-side and streams the engine response back to the browser. The workspace renders safe response text and only the events the engine emits.</p>
              <p className="text-sm text-zinc-500">Browser → Next.js support proxy → Nexus Engine stream → Support workspace</p>
            </DocSection>

            <DocSection id="website-integration" title="Website Integration">
              <p>Use the website workspace for a browser-based support experience. Keep backend credentials on the server; the browser should send only the conversation identifier, customer identifier and message.</p>
              <p>The public implementation persists the conversation identifiers in browser session storage, so a refresh can continue the same browser session without creating a public account system.</p>
            </DocSection>

            <DocSection id="api-reference" title="API Reference">
              <p>The browser-facing endpoint is <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-zinc-200">POST /api/demo/support</code>. It accepts JSON and returns a server-sent event stream.</p>
              <CodeBlock code={requestExample} label="Browser request" />
              <aside className="rounded-[var(--nexus-radius-control)] border border-white/[0.1] bg-white/[0.025] p-4 text-sm leading-6 text-zinc-300" role="note"><strong className="font-medium text-white">Authentication stays server-side.</strong> The browser does not receive the development API key. The Next.js proxy adds the private authentication header when it calls the configured engine.</aside>
            </DocSection>

            <DocSection id="sse-event-reference" title="SSE Event Reference">
              <p>Each event is framed as SSE. The workspace uses the event name and safe JSON data to update visible state. It does not fabricate missing retrieval or tool stages.</p>
              <CodeBlock code={sseExample} label="Stream framing" />
              <div className="overflow-x-auto rounded-[var(--nexus-radius-control)] border border-white/[0.1]">
                <table className="w-full min-w-[34rem] text-left text-sm leading-6">
                  <thead className="border-b border-white/[0.08] bg-white/[0.025] text-xs font-medium uppercase tracking-[0.14em] text-zinc-400"><tr><th className="px-4 py-3">Event</th><th className="px-4 py-3">Workspace behavior</th></tr></thead>
                  <tbody>{eventRows.map(([event, behavior]) => <tr className="border-b border-white/[0.07] last:border-0" key={event}><td className="px-4 py-3 font-mono text-xs text-zinc-200">{event}</td><td className="px-4 py-3 text-zinc-400">{behavior}</td></tr>)}</tbody>
                </table>
              </div>
              <p><code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-zinc-200">response.delta.payload.text</code> appends to the active assistant message. <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-zinc-200">response.completed</code> is terminal success; <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm text-zinc-200">request.failed</code> produces a safe recovery message.</p>
            </DocSection>

            <DocSection id="knowledge-base-setup" title="Knowledge Base Setup"><p>Business knowledge is retrieved from Qdrant-backed collections. Keep content current, scoped to the intended business and reviewed for accuracy before it enters a live workflow.</p></DocSection>
            <DocSection id="adaptive-style-memory" title="Adaptive Style Memory"><p>Style examples help Nexus adapt the form of a response while preserving the underlying business answer. Treat examples as reviewed communication guidance, not as a replacement for business policy.</p></DocSection>
            <DocSection id="google-calendar-setup" title="Google Calendar Setup"><p>Scheduling requires a configured Google Calendar integration and an available workflow. Confirm the intended calendar and keep credentials server-side before enabling actions. The public workspace only displays the event URL the engine returns; event details remain in Google Calendar.</p></DocSection>

            <DocSection id="environment-variables" title="Environment Variables">
              <p>Configure public website settings separately from server-only engine settings. Do not expose service credentials through browser-prefixed variables or client code.</p>
              <CodeBlock code={environmentExample} label="Sanitized configuration" />
            </DocSection>

            <DocSection id="security" title="Security"><p>The public demo keeps the engine key in the server proxy and presents safe error messages instead of provider details. Production access controls, retention and deployment requirements should be assessed for each engagement.</p></DocSection>
            <DocSection id="troubleshooting" title="Troubleshooting"><p>If the workspace cannot start, confirm the server can reach the streaming engine and that the server-only variables are configured. If a stream stops, check safe server logs and ensure the engine emits a terminal completion or failure event. Do not retry a failed action request automatically, because that could duplicate an external Calendar action.</p></DocSection>
          </article>
        </div>
      </div>
    </MarketingPage>
  );
}
