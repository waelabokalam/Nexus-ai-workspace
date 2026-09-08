"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import ProductStatus, { type ProductStatusValue } from "@/components/ui/ProductStatus";

type Feature = { title: string; status?: ProductStatusValue; problem: string; works: string; outcome: string };
type FeatureSystem = { id: string; eyebrow: string; title: string; features: Feature[] };

const systems: FeatureSystem[] = [
  { id: "ai-agents", eyebrow: "AI Agents", title: "Understand people and business knowledge—then move work forward.", features: [
    { title: "Nexus Agent", status: "live", problem: "Generic assistants lose business context and stop at a reply.", works: "The live agent combines approved knowledge, memory, adaptive communication, multilingual support and enabled actions.", outcome: "Customers get grounded help and the business gets a workflow that can continue." },
  ] },
  { id: "automation", eyebrow: "Automation", title: "Remove repetitive work without removing human control.", features: [
    { title: "Workflow automation", problem: "Teams repeatedly check, route and follow up on the same kinds of work.", works: "Nexus structures the signal, applies policy and sends the work toward an approved action or person.", outcome: "Routine work moves consistently instead of waiting in another inbox." },
    { title: "Approvals and handoff", status: "building", problem: "Not every decision is safe to automate.", works: "AUTO, APPROVAL and HUMAN modes keep consequential work under explicit business control.", outcome: "Automation creates leverage without hiding responsibility." },
  ] },
  { id: "business-systems", eyebrow: "Business Systems", title: "Build software around the workflow—not the template.", features: [
    { title: "Nexus Direct", status: "live", problem: "Some businesses need a direct customer channel connected to the work behind it.", works: "Crave It demonstrates one focused system spanning customer experience, orders, fulfilment and administration.", outcome: "The customer journey and operating workflow work as one product." },
    { title: "Vertical systems", problem: "Generic software rarely matches the operating details of every industry.", works: "Nexus combines a shared technology foundation with interfaces and logic shaped around the vertical.", outcome: "The software fits the operation instead of forcing the operation to fit the software." },
  ] },
  { id: "computer-vision", eyebrow: "Computer Vision", title: "Turn camera activity into signals people can review.", features: [
    { title: "Intelligent monitoring", status: "building", problem: "Teams cannot inspect every camera feed with equal attention.", works: "The product direction is to surface reviewable operational signals—not make unsupported identity or guilt decisions.", outcome: "People can focus review on moments that may warrant attention." },
  ] },
  { id: "manager-intelligence", eyebrow: "Combined example", title: "Restaurant Manager Intelligence brings the capabilities together.", features: [
    { title: "Manager Command Center", status: "building", problem: "Restaurant activity is scattered across messages, platforms and staff updates.", works: "AI agents, automation and business-system design combine into attention, approval and daily-brief views.", outcome: "Managers start from a useful operating picture instead of assembling one manually." },
  ] },
];

function featureId(systemId: string, title: string) { return `${systemId}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`; }

function FeatureDetail({ feature }: { feature: Feature }) {
  return <div>{feature.status ? <div className="flex items-center justify-between gap-4"><ProductStatus status={feature.status} /><span className="nexus-subtle text-[10px] uppercase tracking-[0.12em]">Product status</span></div> : null}<dl className={`grid gap-6 text-sm leading-6 ${feature.status ? "mt-8" : ""}`}><div><dt className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">Business problem</dt><dd className="nexus-copy mt-2">{feature.problem}</dd></div><div><dt className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">How Nexus works</dt><dd className="nexus-copy mt-2">{feature.works}</dd></div><div><dt className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">Business outcome</dt><dd className="nexus-heading mt-2">{feature.outcome}</dd></div></dl></div>;
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
