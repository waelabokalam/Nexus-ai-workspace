import { ArrowRight, Check, ShieldCheck, UserRound } from "lucide-react";
import SectionReveal from "@/components/marketing/SectionReveal";
import TqMonogram from "@/components/ui/TqMonogram";

const operationInputs = ["Messages", "Invoices", "Customer systems", "Internal tools", "Operational data"];
const nexusActions = ["Understand", "Connect", "Automate", "Watch", "Prioritize"];
const decisionRoutes = [
  { label: "AUTO", detail: "Safe, repeatable work", icon: Check },
  { label: "APPROVAL", detail: "A manager decides", icon: ShieldCheck },
  { label: "HUMAN", detail: "The issue needs judgment", icon: UserRound },
] as const;

export default function HowNexusWorks() {
  return (
    <section className="border-y border-[var(--nexus-border)] px-5 py-20 sm:px-8 sm:py-28" id="how-tqen-works">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="max-w-3xl">
          <p className="nexus-subtle text-sm font-medium">How TQEN systems work</p>
          <h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl">Connect what exists. Improve what happens next.</h2>
          <p className="nexus-copy mt-5 max-w-2xl text-base leading-7">TQEN sits above the tools you already use, watches operations, and surfaces the exceptions that deserve attention.</p>
        </SectionReveal>

        <SectionReveal className="mt-12 overflow-hidden rounded-[var(--nexus-radius-surface)] border border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] p-5 sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto_0.8fr_auto_1fr] lg:items-stretch">
            <div className="nexus-surface rounded-[var(--nexus-radius-control)] p-5">
              <h3 className="nexus-heading text-sm font-medium">Your existing operation</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {operationInputs.map((item) => <span className="nexus-control rounded-lg px-3 py-2 text-xs nexus-copy" key={item}>{item}</span>)}
              </div>
            </div>

            <div aria-hidden="true" className="hidden items-center lg:flex"><ArrowRight className="nexus-subtle size-5" strokeWidth={1.5} /></div>

            <div className="rounded-[var(--nexus-radius-control)] border border-[var(--nexus-border-strong)] bg-[var(--nexus-surface-raised)] p-5">
              <div className="flex items-center gap-3"><TqMonogram size={28} /><h3 className="nexus-heading text-sm font-semibold">TQEN</h3></div>
              <div className="mt-5 flex flex-wrap gap-2">
                {nexusActions.map((item) => <span className="nexus-heading text-xs" key={item}>{item}</span>)}
              </div>
            </div>

            <div aria-hidden="true" className="hidden items-center lg:flex"><ArrowRight className="nexus-subtle size-5" strokeWidth={1.5} /></div>

            <div className="grid gap-2">
              {decisionRoutes.map(({ label, detail, icon: Icon }) => (
                <div className="nexus-surface grid grid-cols-[2rem_1fr] items-center gap-3 rounded-[var(--nexus-radius-control)] px-4 py-3" key={label}>
                  <Icon aria-hidden="true" className="nexus-heading size-4" strokeWidth={1.55} />
                  <div><p className="nexus-heading text-xs font-semibold tracking-[0.04em]">{label}</p><p className="nexus-subtle mt-0.5 text-[11px]">{detail}</p></div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
