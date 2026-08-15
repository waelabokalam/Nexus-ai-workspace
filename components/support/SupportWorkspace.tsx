"use client";

import Link from "next/link";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import NexusCore from "@/components/ui/NexusCore";
import ThemeToggle from "@/components/ThemeToggle";
import useSupportChat, { type ChatMessage } from "@/hooks/useSupportChat";
import { messageDirection } from "@/lib/message-direction";
import type { WorkflowStep } from "@/lib/support-stream";

const messageLimit = 12_000;
const prompts = [
  "What are your pricing plans?",
  "مرحبا، كيف يمكنكم مساعدتي؟",
  "Merhaba, hangi hizmetleri sunuyorsunuz?",
  "I want to schedule a meeting tomorrow at 6pm.",
] as const;

export type WorkspaceConfig = {
  theme?: "nexus" | "pgpara";
  brandName?: string;
  assistantName: string;
  headerTitle: string;
  headerSubtext?: string;
  prototypeLabel?: string;
  workspaceTitle: string;
  emptyTitle: string;
  emptyDescription: string;
  prompts: readonly string[];
  secondaryPrompts?: readonly string[];
  capabilityGroups?: readonly { title: string; items: readonly string[] }[];
  integrationTools?: readonly { title: string; status: string; description: string }[];
  composerPlaceholder: string;
  composerLabel?: string;
  endpoint?: string;
  sessionNamespace?: string;
  unavailableMessage?: string;
  preventActionRetry?: boolean;
};

const supportWorkspaceConfig: WorkspaceConfig = {
  assistantName: "Nexus",
  headerTitle: "Customer Support",
  workspaceTitle: "Nexus Support",
  emptyTitle: "Ask a real support question to start a Nexus Engine session.",
  emptyDescription: "Try a product question, switch language, or ask to schedule a meeting. Each prompt uses the same live request path.",
  prompts,
  composerPlaceholder: "Ask about your business, knowledge or scheduling…",
  composerLabel: "Message Nexus Support",
  preventActionRetry: true,
};

function NewConversationIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M7 5.5h7.5A2.5 2.5 0 0 1 17 8v3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M5 10.5A2.5 2.5 0 0 1 7.5 8H12a2.5 2.5 0 0 1 2.5 2.5v4A2.5 2.5 0 0 1 12 17H9l-3.25 2.25L6.5 17A2.5 2.5 0 0 1 5 14.75v-4.25Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M18.5 15v5m-2.5-2.5h5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function formatDuration(durationMs?: number) {
  if (durationMs === undefined) return null;
  return durationMs < 1_000 ? `${durationMs}ms` : `${(durationMs / 1_000).toFixed(1)}s`;
}

function isCalendarUrl(value: string) {
  try {
    const parsedUrl = new URL(value);
    return /(^|\.)calendar\.google\.com$/i.test(parsedUrl.hostname) || (/(^|\.)google\.com$/i.test(parsedUrl.hostname) && parsedUrl.pathname.startsWith("/calendar/"));
  } catch {
    return false;
  }
}

function calendarLinksFrom(content: string) {
  return content.match(/https?:\/\/[^\s]+/g)?.filter(isCalendarUrl) ?? [];
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(https?:\/\/[^\s]+)/g);
  return <>{parts.map((part, index) => {
    if (!/^https?:\/\/[^\s]+$/.test(part)) return <span key={`${part}-${index}`}>{part}</span>;
    if (isCalendarUrl(part)) return <span className="font-medium text-white" key={part}>Google Calendar event</span>;
    return <a className="nexus-focus break-all font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white" href={part} key={part} rel="noreferrer" target="_blank">{part}</a>;
  })}</>;
}

function CalendarActionCard({ href }: { href: string }) {
  return (
    <aside aria-label="Google Calendar event" className="mt-4 rounded-xl border border-white/[0.12] bg-black/20 p-3.5">
      <p className="text-sm font-medium text-white">Google Calendar event</p>
      <p className="mt-1 text-xs leading-5 text-zinc-400">The engine returned this event link. Event details are managed in Google Calendar.</p>
      <a aria-label="Open Calendar event in Google Calendar" className="nexus-focus mt-3 inline-flex min-h-9 items-center rounded-lg border border-white/[0.12] px-3 text-xs font-medium text-white transition hover:bg-white/[0.06]" href={href} rel="noreferrer" target="_blank">Open in Google Calendar</a>
    </aside>
  );
}

function MessageBubble({ assistantName, message, isSending }: { assistantName: string; message: ChatMessage; isSending: boolean }) {
  const isUser = message.role === "user";
  const calendarLinks = isUser ? [] : calendarLinksFrom(message.content);
  return (
    <article aria-busy={!message.complete} className={`max-w-[92%] rounded-[var(--nexus-radius-control)] px-4 py-3 text-sm leading-6 sm:max-w-[78%] ${isUser ? "self-end bg-white text-zinc-950" : "self-start border border-white/[0.1] bg-white/[0.035] text-zinc-200"}`} dir={messageDirection(message.content)}>
      {message.content ? <div className="whitespace-pre-wrap break-words"><MessageContent content={message.content} /></div> : isSending ? <span className="text-zinc-400">{assistantName} is responding</span> : null}
      {calendarLinks.map((href) => <CalendarActionCard href={href} key={href} />)}
    </article>
  );
}

function WorkflowRow({ step }: { step: WorkflowStep }) {
  if (step.state === "pending") return null;
  const status = step.state === "active" ? "In progress" : step.state === "complete" ? "Complete" : "Not needed";
  const dotClass = step.state === "active" ? "bg-white ring-4 ring-white/[0.12]" : step.state === "complete" ? "bg-zinc-300" : "bg-zinc-600";
  return (
    <li className="flex items-center justify-between gap-3 py-3 text-sm">
      <span className="flex min-w-0 items-center gap-3 text-zinc-200"><span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${dotClass}`} /><span>{step.label}</span></span>
      <span className="shrink-0 text-xs text-zinc-400">{step.state === "complete" && formatDuration(step.durationMs) ? formatDuration(step.durationMs) : status}</span>
    </li>
  );
}

function WorkflowPanel({ workflow, error, capabilityGroups, integrationTools }: { workflow: WorkflowStep[]; error: string | null; capabilityGroups?: WorkspaceConfig["capabilityGroups"]; integrationTools?: WorkspaceConfig["integrationTools"] }) {
  const hasEvents = workflow.some((step) => step.state !== "pending");
  return (
    <div className="nexus-surface rounded-[var(--nexus-radius-surface)] p-5">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">Live workflow</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">Stages appear only when they are emitted by the Nexus Engine.</p>
      {capabilityGroups ? <div className="mt-5 space-y-3 border-t border-white/[0.08] pt-4">{capabilityGroups.map((group) => <section key={group.title}><p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">{group.title}</p><p className="mt-1.5 text-xs leading-5 text-zinc-400">{group.items.join(" · ")}</p></section>)}</div> : null}
      {integrationTools ? <section aria-label="Integration-ready PGPara tools" className="mt-5 border-t border-white/[0.08] pt-4"><p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">PGPara service modules</p><div className="mt-3 space-y-2">{integrationTools.map((tool) => <article className="workspace-tool rounded-xl border border-white/[0.08] bg-black/20 p-3" key={tool.title}><div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-zinc-100">{tool.title}</p><span className="workspace-tool-status shrink-0 rounded-full border border-white/[0.1] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400">{tool.status}</span></div><p className="mt-1.5 text-xs leading-5 text-zinc-400">{tool.description}</p></article>)}</div></section> : null}
      {hasEvents ? <ol className="mt-4 divide-y divide-white/[0.07]">{workflow.map((step) => <WorkflowRow key={step.type} step={step} />)}</ol> : <p className="mt-5 rounded-xl border border-white/[0.08] bg-black/20 p-4 text-sm leading-6 text-zinc-400">Workflow activity will appear here after you send a message.</p>}
      {error && <p className="mt-4 rounded-xl border border-white/[0.12] bg-white/[0.04] p-3 text-sm leading-6 text-zinc-200" role="alert"><span className="font-medium text-white">Request ended.</span> {error}</p>}
    </div>
  );
}

function isActionRequest(message: string) {
  return /\b(book|schedule|appointment|meeting|calendar|randevu|toplantı|takvim|rezervasyon)\b|موعد|حجز|اجتماع/i.test(message);
}

export default function SupportWorkspace({ config = supportWorkspaceConfig }: { config?: WorkspaceConfig }) {
  const [input, setInput] = useState("");
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [confirmingNewConversation, setConfirmingNewConversation] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const shouldFollowRef = useRef(true);
  const cancelResetRef = useRef<HTMLButtonElement>(null);
  const newConversationButtonRef = useRef<HTMLButtonElement>(null);
  const resetDialogRef = useRef<HTMLDivElement>(null);
  const { messages, workflow, isReady, isSending, error, lastFailedMessage, sendMessage, startNewConversation } = useSupportChat({
    endpoint: config.endpoint,
    sessionNamespace: config.sessionNamespace,
    unavailableMessage: config.unavailableMessage,
  });

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript && shouldFollowRef.current) transcript.scrollTop = transcript.scrollHeight;
  }, [messages, isSending]);

  useEffect(() => {
    if (confirmingNewConversation) cancelResetRef.current?.focus();
  }, [confirmingNewConversation]);

  const submitMessage = (value: string) => {
    const message = value.trim();
    if (!message || message.length > messageLimit || isSending) return;
    shouldFollowRef.current = true;
    void sendMessage(message);
    setInput("");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMessage(input);
  };

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage(input);
    }
  };

  const onTranscriptScroll = () => {
    const transcript = transcriptRef.current;
    if (!transcript) return;
    shouldFollowRef.current = transcript.scrollHeight - transcript.scrollTop - transcript.clientHeight < 56;
  };

  const closeResetDialog = (restoreFocus = true) => {
    setConfirmingNewConversation(false);
    if (restoreFocus) window.requestAnimationFrame(() => newConversationButtonRef.current?.focus());
  };

  const completeNewConversation = () => {
    startNewConversation();
    setInput("");
    shouldFollowRef.current = true;
    closeResetDialog();
  };

  const newConversation = () => {
    if (isSending) return;
    if (messages.length > 0) {
      setConfirmingNewConversation(true);
      return;
    }
    completeNewConversation();
  };

  const canRetry = Boolean(lastFailedMessage && (!config.preventActionRetry || !isActionRequest(lastFailedMessage)));
  const liveStatus = error ? "The request could not be completed." : isSending ? `${config.assistantName} is responding.` : messages.length > 0 ? "Response complete." : "";

  const onResetDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeResetDialog();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = resetDialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]");
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <main className="nexus-page nexus-workspace min-h-screen text-white" data-workspace-theme={config.theme ?? "nexus"}>
      <a className="nexus-skip-link" href="#support-workspace">Skip to workspace</a>
      <header className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link aria-label="Return to Demo Hub" className="nexus-focus inline-flex min-w-0 items-center gap-3 rounded-lg text-sm font-medium text-white" href="/demo">{config.theme === "pgpara" ? <span aria-label="PGPara" className="pgpara-wordmark"><strong>PG</strong>Para</span> : <NexusCore size={30} />}<span className="min-w-0"><span className="block truncate">{config.headerTitle}</span>{config.headerSubtext ? <span className="mt-0.5 hidden truncate text-xs font-normal text-zinc-500 sm:block">{config.headerSubtext}</span> : null}</span></Link>
        <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
          <ThemeToggle />
          <button
            aria-label="New conversation"
            className="nexus-focus inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.055] px-2.5 text-sm font-medium text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-white/[0.16] hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-45 sm:px-3"
            disabled={isSending}
            onClick={newConversation}
            ref={newConversationButtonRef}
            type="button"
          >
            <span aria-hidden="true" className="grid size-5 place-items-center rounded-md border border-white/[0.1] bg-black/20 text-zinc-300"><NewConversationIcon className="size-3.5" /></span>
            <span className="sm:hidden">New</span>
            <span className="hidden sm:inline">New conversation</span>
          </button>
          <Link className="nexus-focus inline-flex min-h-9 items-center rounded-lg px-2.5 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white sm:px-3" href="/demo"><span className="sm:hidden">Demo</span><span className="hidden sm:inline">Back to Demo Hub</span></Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-5 pb-6 pt-4 sm:px-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:pb-10 lg:pt-6" id="support-workspace">
        <section className="nexus-surface flex min-h-[38rem] flex-col overflow-hidden rounded-[var(--nexus-radius-surface)] lg:h-[calc(100dvh-7.75rem)] lg:min-h-0">
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-4 sm:px-6">
            <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">{config.prototypeLabel ?? "Live workspace"}</p><h1 className="mt-1.5 font-heading text-xl font-medium tracking-[-0.03em] text-white">{config.workspaceTitle}</h1>{config.headerSubtext ? <p className="mt-1 text-sm text-zinc-400 sm:hidden">{config.headerSubtext}</p> : null}</div>
            <button aria-controls="support-workflow" aria-expanded={workflowOpen} className="nexus-focus min-h-10 rounded-lg border border-white/[0.12] px-3 text-sm text-zinc-200 lg:hidden" onClick={() => setWorkflowOpen((open) => !open)} type="button">Workflow</button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="sr-only" aria-live="polite">{liveStatus}</div>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5 sm:px-6" onScroll={onTranscriptScroll} ref={transcriptRef}>
              {messages.length === 0 && (
                <div className="max-w-2xl py-3 lg:my-auto"><p className="text-base leading-7 text-zinc-300">{config.emptyTitle}</p><p className="mt-2 text-sm leading-6 text-zinc-400">{config.emptyDescription}</p><div className="mt-5 flex flex-wrap gap-2">{config.prompts.map((prompt) => <button className="nexus-focus rounded-lg border border-white/[0.1] bg-white/[0.025] px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-50" disabled={!isReady || isSending} key={prompt} onClick={() => submitMessage(prompt)} type="button">{prompt}</button>)}</div>{config.secondaryPrompts ? <div className="mt-3 flex flex-wrap gap-2">{config.secondaryPrompts.map((prompt) => <button className="nexus-focus rounded-lg px-2 py-1 text-left text-xs text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-300 disabled:opacity-50" disabled={!isReady || isSending} key={prompt} onClick={() => submitMessage(prompt)} type="button">{prompt}</button>)}</div> : null}</div>
              )}
              {messages.map((message) => <MessageBubble assistantName={config.assistantName} isSending={isSending} key={message.id} message={message} />)}
            </div>

            {error && <div className="mx-5 mb-0 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] py-3 text-sm sm:mx-6"><p className="text-zinc-400">Your original message is preserved for recovery.</p>{canRetry ? <button className="nexus-focus rounded-lg border border-white/[0.12] px-3 py-2 font-medium text-white transition hover:bg-white/[0.06]" disabled={isSending} onClick={() => lastFailedMessage && submitMessage(lastFailedMessage)} type="button">Retry message</button> : <p className="text-xs leading-5 text-zinc-500">Action requests are not retried automatically to avoid duplicate external actions.</p>}</div>}

            <form className="border-t border-white/[0.08] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4" onSubmit={onSubmit}>
              <label className="sr-only" htmlFor="support-message">{config.composerLabel ?? "Message Nexus Support"}</label>
              <div className="rounded-[var(--nexus-radius-control)] border border-white/[0.12] bg-black/25 p-2 focus-within:border-white/[0.25] focus-within:ring-2 focus-within:ring-white/[0.08]">
                <textarea autoComplete="off" className="block min-h-12 max-h-32 w-full resize-y bg-transparent px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed" dir="auto" disabled={!isReady || isSending} id="support-message" maxLength={messageLimit} onChange={(event) => setInput(event.target.value)} onKeyDown={onComposerKeyDown} placeholder={isReady ? config.composerPlaceholder : "Preparing your secure session…"} rows={1} value={input} />
                <div className="flex items-center justify-between gap-3 px-3 pb-1"><p className="text-xs text-zinc-500">Enter to send · Shift+Enter for a new line</p><div className="flex items-center gap-3"><span className={`text-xs ${input.length > messageLimit * 0.9 ? "text-zinc-300" : "text-zinc-500"}`}>{input.length.toLocaleString()}/{messageLimit.toLocaleString()}</span><button className="nexus-focus min-h-10 rounded-lg bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40" disabled={!isReady || isSending || !input.trim() || input.length > messageLimit} type="submit">{isSending ? "Sending" : "Send"}</button></div></div>
              </div>
            </form>
          </div>
        </section>

        <aside className={`${workflowOpen ? "block" : "hidden"} lg:block`} id="support-workflow"><WorkflowPanel capabilityGroups={config.capabilityGroups} error={error} integrationTools={config.integrationTools} workflow={workflow} /></aside>
      </div>
      {confirmingNewConversation && (
        <div aria-describedby="new-conversation-description" aria-labelledby="new-conversation-title" aria-modal="true" className="fixed inset-0 z-[60] grid place-items-center bg-black/65 p-5 backdrop-blur-sm" onKeyDown={onResetDialogKeyDown} role="dialog">
          <div className="nexus-surface w-full max-w-sm rounded-[var(--nexus-radius-surface)] p-6 shadow-2xl shadow-black/40" ref={resetDialogRef}>
            <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl border border-white/[0.1] bg-white/[0.05] text-zinc-100"><NewConversationIcon className="size-5" /></span>
            <h2 className="mt-5 font-heading text-xl font-medium tracking-[-0.03em] text-white" id="new-conversation-title">Start a new conversation?</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400" id="new-conversation-description">The current transcript and visible workflow stages will be cleared from this browser. {config.assistantName} receives a new conversation and customer context on your next message.</p>
            <div className="mt-6 flex flex-col-reverse gap-2 border-t border-white/[0.08] pt-4 sm:flex-row sm:justify-end">
              <button className="nexus-focus min-h-10 rounded-lg px-3 text-sm text-zinc-300 transition hover:bg-white/[0.06]" onClick={() => closeResetDialog()} ref={cancelResetRef} type="button">Cancel</button>
              <button className="nexus-focus workspace-primary-action min-h-10 rounded-lg bg-white px-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200" onClick={completeNewConversation} type="button">Start new conversation</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
