import Link from "next/link";

const modules = [
  {
    number: "01",
    title: "Digital presence",
    description: "A branded, mobile-first customer experience that carries the restaurant's information, offering and customer journey.",
    items: ["Branded website", "Restaurant information", "Menus or products", "Promotions", "Supported multilingual content"],
  },
  {
    number: "02",
    title: "Ordering & customer journey",
    description: "Shape ordering, plan-building or request flows around what the restaurant actually sells and how fulfilment works.",
    items: ["Digital order or plan flow", "Customer accounts", "Cart or request flow", "Delivery information", "Order or request status"],
  },
  {
    number: "03",
    title: "Restaurant operations",
    description: "Give the team a clear place to receive work, manage status and keep business information current.",
    items: ["Admin environment", "Incoming orders or requests", "Approval and status workflows", "Customer management", "Operational visibility"],
  },
  {
    number: "04",
    title: "Customer intelligence & CRM",
    description: "Keep the customer record connected to the relationship instead of scattering context across inboxes and spreadsheets.",
    items: ["Customer records", "Order or request history", "Segmentation foundations", "Available communication history", "Lifecycle visibility"],
  },
  {
    number: "05",
    title: "Nexus Agent",
    description: "A customer-facing intelligence layer grounded in approved restaurant knowledge and connected to enabled workflows.",
    items: ["Menu and business questions", "Turkish, Arabic and English", "Intent and memory", "Live reservation workflow", "Human handoff and lead capture"],
    status: "Live",
    href: "/demo/restaurant",
  },
  {
    number: "06",
    title: "Automation",
    description: "Move requests between customers, the restaurant team and connected services with visible, implementation-specific workflows.",
    items: ["Grounded customer answers", "Calendar-backed reservations", "Team handoff", "Lead capture", "Configured notifications and CRM actions"],
  },
] as const;

export default function RestaurantModules() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => (
        <article className="nexus-card flex min-h-[25rem] flex-col rounded-[var(--nexus-radius-surface)] p-6" key={module.title}>
          <div className="flex items-center justify-between gap-3">
            <span className="nexus-subtle text-xs tabular-nums">{module.number}</span>
            {"status" in module ? <span className="nexus-status rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em]">{module.status}</span> : null}
          </div>
          <h3 className="nexus-heading mt-8 font-heading text-xl font-medium tracking-[-0.03em]">{module.title}</h3>
          <p className="nexus-copy mt-3 text-sm leading-6">{module.description}</p>
          <ul className="mt-6 space-y-3 border-t border-white/[0.08] pt-5">
            {module.items.map((item) => (
              <li className="nexus-copy flex gap-2 text-xs leading-5" key={item}>
                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-current opacity-50" />
                {item}
              </li>
            ))}
          </ul>
          {"href" in module ? <Link className="nexus-focus mt-auto pt-6 text-sm font-medium text-[var(--nexus-text)] underline decoration-[var(--nexus-border-strong)] underline-offset-4" href={module.href}>Open the live restaurant demo <span aria-hidden="true">→</span></Link> : null}
        </article>
      ))}
    </div>
  );
}
