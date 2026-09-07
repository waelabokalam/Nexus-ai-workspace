const customerChannels = ["Website", "Mobile experience", "Nexus Agent"] as const;
const operatingModules = ["Orders / requests", "CRM", "Operations", "Automation", "Analytics"] as const;

function DownConnector() {
  return (
    <div aria-hidden="true" className="flex h-14 flex-col items-center justify-center">
      <span className="h-8 w-px bg-[var(--nexus-border-strong)]" />
      <span className="-mt-1 rotate-45 border-b border-r border-[var(--nexus-text-subtle)] p-1" />
    </div>
  );
}

export default function RestaurantArchitecture() {
  return (
    <div className="nexus-frame rounded-[var(--nexus-radius-surface)] p-1">
      <div className="nexus-surface rounded-[calc(var(--nexus-radius-surface)-0.3rem)] p-5 sm:p-8 lg:p-10">
        <div className="text-center">
          <p className="nexus-subtle text-[10px] font-medium uppercase tracking-[0.16em]">Customer</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {customerChannels.map((channel) => <div className="nexus-control rounded-xl px-4 py-3 text-sm font-medium text-[var(--nexus-text)]" key={channel}>{channel}</div>)}
          </div>
        </div>

        <DownConnector />

        <div className="rounded-[var(--nexus-radius-control)] border border-[var(--nexus-border-strong)] bg-[var(--nexus-surface-raised)] px-5 py-7 text-center shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
          <p className="nexus-subtle text-[10px] font-medium uppercase tracking-[0.18em]">Operating layer</p>
          <p className="nexus-heading mt-2 font-heading text-2xl font-medium tracking-[-0.04em]">Nexus Restaurant System</p>
          <p className="nexus-copy mx-auto mt-2 max-w-xl text-xs leading-5">Connects customer interactions with the restaurant workflow and the tools enabled for that implementation.</p>
        </div>

        <DownConnector />

        <div>
          <p className="nexus-subtle text-center text-[10px] font-medium uppercase tracking-[0.16em]">Connected operations</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {operatingModules.map((module) => <div className="nexus-control flex min-h-16 items-center justify-center rounded-xl px-3 text-center text-xs font-medium text-[var(--nexus-text)]" key={module}>{module}</div>)}
          </div>
        </div>

        <DownConnector />

        <div className="nexus-control rounded-xl px-4 py-4 text-center">
          <p className="nexus-subtle text-[10px] font-medium uppercase tracking-[0.16em]">Restaurant team</p>
          <p className="nexus-heading mt-1 text-sm font-medium">One operational view of the customer journey and the work behind it.</p>
        </div>
      </div>
    </div>
  );
}
