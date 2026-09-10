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

const solutions = [
  {
    id: "ai-automation",
    number: "01",
    title: "AI agents and automation",
    status: "Available in scoped workflows",
    icon: Bot,
    problem: "Teams lose time moving information between messages, tools and repetitive decisions.",
    approach: "Nexus maps the real workflow, gives the system the right business context, and defines what it may handle, what needs approval and what stays human.",
    result: "Routine work moves forward without hiding the decisions that still need a person.",
    examples: ["Customer and team agents", "Workflow routing", "Knowledge and memory", "Approvals and handoff"],
  },
  {
    id: "business-systems",
    number: "02",
    title: "Business systems",
    status: "Built to scope",
    icon: PanelsTopLeft,
    problem: "Critical operations often live across spreadsheets, inboxes and disconnected software.",
    approach: "Nexus designs an operational system around the team, its roles and the information required to run the work.",
    result: "People get one clear place to understand activity, resolve exceptions and maintain control.",
    examples: ["Command centers", "Internal tools", "Customer portals", "Multi-location platforms"],
  },
  {
    id: "websites",
    number: "03",
    title: "Apps, platforms and websites",
    status: "Built to scope",
    icon: AppWindow,
    problem: "A digital experience fails when it looks polished but stops before the operational work begins.",
    approach: "Nexus designs the customer-facing experience and the system behind it as one connected product.",
    result: "The interface becomes a useful part of the operation, not a brochure disconnected from fulfilment.",
    examples: ["Web applications", "Mobile experiences", "Direct-commerce systems", "Premium business websites"],
  },
  {
    id: "integrations",
    number: "04",
    title: "Integrations and connected workflows",
    status: "Dependent on available APIs",
    icon: Blocks,
    problem: "Replacing every existing tool is expensive, disruptive and often unnecessary.",
    approach: "Where safe interfaces exist, Nexus connects the systems a business already uses and adds a control layer above them.",
    result: "Information can move with less manual re-entry while the underlying tools remain in place.",
    examples: ["Calendars", "Business data sources", "Notification paths", "Provider-neutral connections"],
  },
  {
    id: "computer-vision",
    number: "05",
    title: "Computer vision",
    status: "Retail direction in development",
    icon: Eye,
    problem: "Some operational signals happen in physical spaces and are missed until after the cost is visible.",
    approach: "Nexus is developing carefully scoped monitoring systems that turn permitted visual signals into reviewable operational events.",
    result: "Teams can investigate relevant events without treating every camera feed as something a person must constantly watch.",
    examples: ["Loss-prevention signals", "Operational monitoring", "Human review", "Privacy-aware system design"],
  },
  {
    id: "custom-systems",
    number: "06",
    title: "Custom operational systems",
    status: "Discovery and scoped delivery",
    icon: Workflow,
    problem: "The most important workflow may not fit a standard product category.",
    approach: "Nexus studies how the business actually works, then chooses the smallest useful combination of software, automation and AI.",
    result: "The solution fits the operation instead of forcing the operation into a generic template.",
    examples: ["Custom SaaS", "CRM workflows", "Operations platforms", "Purpose-built automation"],
  },
] as const;

export default function SolutionSystems() {
  return (
    <div className="mt-20 border-t border-[var(--nexus-border)]">
      {solutions.map((solution) => {
        const Icon = solution.icon;
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
                    <h3 className="nexus-subtle text-xs font-medium uppercase tracking-[0.13em]">The friction</h3>
                    <p className="nexus-copy mt-3 text-sm leading-6">{solution.problem}</p>
                  </div>
                  <div>
                    <h3 className="nexus-subtle text-xs font-medium uppercase tracking-[0.13em]">How Nexus works</h3>
                    <p className="nexus-copy mt-3 text-sm leading-6">{solution.approach}</p>
                  </div>
                  <div>
                    <h3 className="nexus-subtle text-xs font-medium uppercase tracking-[0.13em]">The outcome</h3>
                    <p className="nexus-heading mt-3 text-sm leading-6">{solution.result}</p>
                  </div>
                  <ul className="grid gap-2 sm:col-span-3 sm:grid-cols-2 xl:grid-cols-4" aria-label={`${solution.title} examples`}>
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
          The right system starts with the operation, not a predetermined technology stack.
        </p>
        <Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/contact">
          Tell us how your business works <span aria-hidden="true" className="ml-2">→</span>
        </Link>
      </div>
    </div>
  );
}
