"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import ProductStatus, { type ProductStatusValue } from "@/components/ui/ProductStatus";

type Feature = { title: string; status: ProductStatusValue; problem: string; works: string; outcome: string };
type FeatureSystem = { id: string; eyebrow: string; title: string; features: Feature[] };

const systems: FeatureSystem[] = [
  { id: "manager-intelligence", eyebrow: "Manager Intelligence", title: "Turn fragmented activity into a useful operating view.", features: [
    { title: "Manager Command Center", status: "building", problem: "Important work is scattered across inboxes, platforms, and informal staff updates.", works: "Nexus is being designed to group attention, approvals, handled work, and daily operating signals around one manager view.", outcome: "Managers spend less time assembling the picture before they can act." },
    { title: "Daily Manager Brief", status: "building", problem: "Daily reporting often arrives late or depends on someone manually summarizing every source.", works: "Connected signals are intended to become a concise brief with sources, open work, and recommended next steps.", outcome: "The day can start from a shared operational picture rather than a search for context." },
  ] },
  { id: "nexus-agent", eyebrow: "Nexus Agent", title: "Understand, remember, and respond with business context.", features: [
    { title: "Grounded multilingual conversations", status: "live", problem: "Generic assistants answer without the company’s current information or the customer’s language.", works: "The live website workspace combines intent routing, Qdrant-backed knowledge, and responses in English, Arabic, or Turkish.", outcome: "Customers receive answers grounded in reviewed business information." },
    { title: "Adaptive communication", status: "live", problem: "One rigid communication style feels wrong across formal, casual, and multilingual conversations.", works: "Reviewed style examples shape the form of the response while preserving the underlying business answer.", outcome: "Replies can fit the conversation without inventing a different policy." },
    { title: "Conversation memory", status: "live", problem: "A customer should not need to repeat context with every follow-up.", works: "Nexus carries relevant context across turns in the same session.", outcome: "The conversation progresses as one exchange instead of disconnected prompts." },
  ] },
  { id: "automation", eyebrow: "Automation", title: "Move from understanding to controlled action.", features: [
    { title: "Intent and workflow routing", status: "live", problem: "Questions, complaints, and booking requests should not follow the same path.", works: "The engine classifies intent and routes the request toward response, retrieval, scheduling, or an enabled continuation.", outcome: "Work starts from the actual need instead of a generic reply." },
    { title: "Calendar scheduling", status: "live", problem: "Booking conversations often stop before an operational record exists.", works: "The verified flow enforces scheduling policy, gathers confirmation, creates the Google Calendar event, and returns its real link.", outcome: "An approved conversation can finish as a traceable Calendar action." },
    { title: "Approval and human control", status: "building", problem: "Automation becomes risky when every decision is treated as safe to execute.", works: "Nexus workflows are being structured around explicit AUTO, APPROVAL, and HUMAN operating modes.", outcome: "Teams can automate routine work without surrendering judgment." },
  ] },
  { id: "business-systems", eyebrow: "Business Systems", title: "Build focused software where a workflow needs more than an integration.", features: [
    { title: "Nexus Direct", status: "live", problem: "Some food businesses need a direct customer and operations product, not another marketplace listing.", works: "Crave It demonstrates a connected experience for plans, ordering, customer context, fulfilment, and administration.", outcome: "The direct channel and the work behind it are designed as one focused system." },
    { title: "Restaurant intelligence", status: "building", problem: "Restaurant managers already have software, but its activity rarely becomes one coordinated operating view.", works: "Nexus is being designed as an intelligence layer above POS, delivery, messages, reservations, and reviews.", outcome: "Existing tools can contribute to clearer decisions without being needlessly replaced." },
  ] },
  { id: "integrations", eyebrow: "Integrations", title: "Connect deliberately, with the system of record left intact.", features: [
    { title: "Channel-neutral engine", status: "live", problem: "Business logic should not be rewritten for every customer entry point.", works: "The engine uses a channel-neutral message contract; the website workspaces are the current public surface.", outcome: "New approved channels can reuse the same reasoning and workflow layer." },
    { title: "Operational connectors", status: "next", problem: "Managers cannot coordinate activity that remains trapped in separate platforms.", works: "Future connectors will be scoped around authorized access to restaurant, CRM, reputation, and notification systems.", outcome: "Nexus can coordinate existing tools while respecting system ownership and controls." },
  ] },
  { id: "vision", eyebrow: "Vision", title: "Translate camera activity into signals people can review.", features: [
    { title: "Shoplifting monitor", status: "building", problem: "Store teams cannot continuously inspect every camera feed with equal attention.", works: "The product direction is to surface reviewable activity signals for staff—not make unsupported identity or guilt decisions.", outcome: "Teams can focus human review on moments that may warrant attention." },
  ] },
];

function featureId(systemId: string, title: string) { return `${systemId}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`; }

function FeatureDetail({ feature }: { feature: Feature }) {
  return <div><div className="flex items-center justify-between gap-4"><ProductStatus status={feature.status} /><span className="nexus-subtle text-[10px] uppercase tracking-[0.12em]">Product status</span></div><h3 className="nexus-heading mt-5 font-heading text-2xl font-medium tracking-[-0.04em]">{feature.title}</h3><dl className="mt-8 grid gap-6 text-sm leading-6"><div><dt className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">Business problem</dt><dd className="nexus-copy mt-2">{feature.problem}</dd></div><div><dt className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">How Nexus works</dt><dd className="nexus-copy mt-2">{feature.works}</dd></div><div><dt className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">Business outcome</dt><dd className="nexus-heading mt-2">{feature.outcome}</dd></div></dl></div>;
}

export default function FeatureSystems() {
  const [openBySystem, setOpenBySystem] = useState<Record<string, string>>({});
  const reduceMotion = useReducedMotion();
  return <div className="mt-16 space-y-16 sm:mt-20">{systems.map((system) => {
    const activeId = openBySystem[system.id] ?? featureId(system.id, system.features[0].title);
    const activeFeature = system.features.find((feature) => featureId(system.id, feature.title) === activeId) ?? system.features[0];
    return <section aria-labelledby={`${system.id}-title`} key={system.id}><div className="max-w-3xl border-b border-[var(--nexus-border)] pb-5"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{system.eyebrow}</p><h2 className="nexus-heading mt-3 font-heading text-3xl font-medium tracking-[-0.04em] sm:text-4xl" id={`${system.id}-title`}>{system.title}</h2></div><div className="mt-5 lg:grid lg:grid-cols-[minmax(14rem,0.76fr)_minmax(0,1.24fr)] lg:gap-5"><div className="space-y-2">{system.features.map((feature) => {
      const id = featureId(system.id, feature.title); const isOpen = activeId === id;
      return <article className="nexus-control rounded-[var(--nexus-radius-control)]" key={id}><button aria-controls={`${id}-content`} aria-expanded={isOpen} className={`nexus-focus flex min-h-16 w-full items-center justify-between gap-4 rounded-[var(--nexus-radius-control)] px-5 py-4 text-start ${isOpen ? "bg-[var(--nexus-surface-soft)]" : ""}`} onClick={() => setOpenBySystem((current) => ({ ...current, [system.id]: id }))} type="button"><span className="nexus-heading text-base font-medium">{feature.title}</span><span aria-hidden="true" className={`nexus-subtle text-lg transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>+</span></button><div className="lg:hidden"><AnimatePresence initial={false}>{isOpen && <motion.div animate={{ height: "auto", opacity: 1 }} className="overflow-hidden border-t border-[var(--nexus-border)]" exit={{ height: 0, opacity: 0 }} initial={{ height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}><div className="px-5 pb-5 pt-4"><FeatureDetail feature={feature} /></div></motion.div>}</AnimatePresence></div></article>;
    })}</div><div className="nexus-card hidden min-h-[22rem] rounded-[var(--nexus-radius-surface)] p-7 lg:block"><AnimatePresence initial={false} mode="wait"><motion.div animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} initial={{ opacity: 0, y: 6 }} key={activeId} transition={{ duration: reduceMotion ? 0 : 0.22 }}><FeatureDetail feature={activeFeature} /></motion.div></AnimatePresence></div></div></section>;
  })}</div>;
}
