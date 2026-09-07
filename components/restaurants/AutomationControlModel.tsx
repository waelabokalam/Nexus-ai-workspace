const modes = [
  { label: "AUTO", title: "Handle within policy", description: "Routine, approved work can complete automatically and remain visible in the log." },
  { label: "APPROVAL", title: "Prepare, then ask", description: "Nexus proposes the action and waits for a manager before anything consequential happens." },
  { label: "HUMAN", title: "Route to a person", description: "Sensitive, ambiguous, or explicitly requested conversations move to restaurant staff." },
] as const;

export default function AutomationControlModel() {
  return <div className="grid gap-3 lg:grid-cols-3">{modes.map((mode, index) => <article className="nexus-card min-h-60 rounded-[var(--nexus-radius-surface)] p-6" key={mode.label}><div className="flex items-center justify-between"><span className="nexus-product-status">{mode.label}</span><span className="nexus-subtle text-xs tabular-nums">0{index + 1}</span></div><h3 className="nexus-heading mt-9 font-heading text-xl font-medium tracking-[-0.03em]">{mode.title}</h3><p className="nexus-copy mt-3 text-sm leading-6">{mode.description}</p></article>)}</div>;
}
