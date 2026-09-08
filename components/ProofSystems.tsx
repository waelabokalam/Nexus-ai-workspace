import Link from "next/link";
import ProductStatus, { type ProductStatusValue } from "@/components/ui/ProductStatus";

const proof = [
  { title: "Nexus Agent", status: "live" as ProductStatusValue, description: "A multilingual AI agent with grounded business knowledge, conversation memory and workflow actions.", action: "Try Live Demo", href: "/demo/support" },
  { title: "Crave It / Nexus Direct", status: "live" as ProductStatusValue, description: "A customer and operational system built around a direct food-business workflow.", action: "View Case Study", href: "/case-studies/crave-it" },
  { title: "Restaurant Intelligence", status: "building" as ProductStatusValue, description: "A manager intelligence and automation layer designed around restaurant operations.", action: "Explore Restaurant V1", href: "/restaurants" },
] as const;

export default function ProofSystems() {
  return <section className="relative border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-24 sm:px-8 sm:py-28" id="proof"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Proof</p><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Built, not just imagined.</h2></div><div className="mt-12 grid gap-4 lg:grid-cols-3">{proof.map((item, index) => <article className="nexus-card flex min-h-80 flex-col rounded-[var(--nexus-radius-surface)] p-6" key={item.title}><div className="flex items-start justify-between gap-4"><span className="nexus-subtle text-xs tabular-nums">0{index + 1}</span><ProductStatus status={item.status} /></div><h3 className="nexus-heading mt-10 font-heading text-2xl font-medium tracking-[-0.04em]">{item.title}</h3><p className="nexus-copy mt-4 text-sm leading-6">{item.description}</p><Link className="nexus-focus mt-auto border-t border-[var(--nexus-border)] pt-5 text-sm font-medium text-[var(--nexus-text)]" href={item.href}>{item.action} <span aria-hidden="true" className="ms-1">→</span></Link></article>)}</div></div></section>;
}
