import Link from "next/link";
import { ArrowRight, CheckCircle2, Languages, MessageSquareText, Search } from "lucide-react";
import SectionReveal from "@/components/marketing/SectionReveal";

const abilities = [
  { label: "Explain TQEN", icon: MessageSquareText },
  { label: "Use business knowledge", icon: Search },
  { label: "Speak three languages", icon: Languages },
  { label: "Capture pilot inquiries", icon: CheckCircle2 },
] as const;

export default function NexusAgentInvitation() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28" id="agent">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="nexus-surface grid overflow-hidden rounded-[var(--nexus-radius-surface)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 sm:p-9 lg:p-12">
            <p className="nexus-subtle text-sm font-medium">Talk to our AI about your business</p>
            <h2 className="nexus-heading mt-4 max-w-2xl font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl">If you ask whether we build agents, you are already speaking to ours.</h2>
            <p className="nexus-copy mt-5 max-w-xl text-base leading-7">Describe your operation, ask what TQEN can support, or explore the live communication workflow.</p>
            <Link className="nexus-button-primary nexus-focus mt-8 inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/demo/support">Talk to TQEN <ArrowRight aria-hidden="true" className="ml-2 size-4" strokeWidth={1.6} /></Link>
          </div>

          <div className="border-t border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-12">
            <p className="nexus-heading text-sm font-medium">Current live capabilities</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {abilities.map(({ label, icon: Icon }) => <div className="nexus-surface flex min-h-20 items-center gap-3 rounded-[var(--nexus-radius-control)] px-4" key={label}><Icon aria-hidden="true" className="nexus-heading size-5 shrink-0" strokeWidth={1.5} /><span className="nexus-copy text-sm">{label}</span></div>)}
            </div>
            <p className="nexus-subtle mt-6 text-xs leading-5">The public agent uses the existing TQEN Engine. Responses and workflow events are streamed through the server-side proxy.</p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
