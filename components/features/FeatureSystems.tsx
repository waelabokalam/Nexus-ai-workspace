"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

type Feature = {
  title: string;
  availability: string;
  problem: string;
  works: string;
  outcome: string;
};

type FeatureSystem = {
  id: string;
  eyebrow: string;
  title: string;
  features: Feature[];
};

const systems: FeatureSystem[] = [
  {
    id: "understand",
    eyebrow: "Understand",
    title: "Start with the customer’s actual request.",
    features: [
      {
        title: "Intent routing",
        availability: "Live in the website workspace",
        problem: "A question, an appointment request and a follow-up do not need the same path.",
        works: "The engine classifies intent before choosing a response, retrieval or scheduling workflow.",
        outcome: "Work begins from the customer’s need rather than a generic chat reply.",
      },
    ],
  },
  {
    id: "respond",
    eyebrow: "Respond",
    title: "Make the reply fit the person and language in front of you.",
    features: [
      {
        title: "Adaptive communication",
        availability: "Live in the website workspace",
        problem: "A rigid script can sound distant or inappropriate.",
        works: "Nexus uses style signals and reviewed examples to shape the form of a response without changing the business answer.",
        outcome: "Conversations can remain helpful and appropriate to the person asking.",
      },
      {
        title: "English, Arabic and Turkish",
        availability: "Live in the website workspace",
        problem: "Customers should not have to switch languages to get help.",
        works: "Nexus keeps the response in the supported language of the conversation.",
        outcome: "Teams can serve these supported languages from one workspace.",
      },
    ],
  },
  {
    id: "remember",
    eyebrow: "Remember",
    title: "Keep the conversation connected across turns.",
    features: [
      {
        title: "Conversation memory",
        availability: "Live in the website workspace",
        problem: "Customers lose confidence when they have to repeat themselves.",
        works: "Nexus retains context across turns for the same session.",
        outcome: "Follow-up questions can build on the conversation already in progress.",
      },
    ],
  },
  {
    id: "retrieve",
    eyebrow: "Retrieve",
    title: "Bring grounded company context into the reply.",
    features: [
      {
        title: "Business knowledge",
        availability: "Live in the website workspace",
        problem: "Answers are unreliable when they are disconnected from current company material.",
        works: "Qdrant-backed retrieval brings relevant business knowledge into the response path.",
        outcome: "Responses can be grounded in reviewed information your team provides.",
      },
    ],
  },
  {
    id: "act",
    eyebrow: "Act",
    title: "Move beyond a reply when a workflow needs to continue.",
    features: [
      {
        title: "Calendar and action execution",
        availability: "Available in configured workflows",
        problem: "A booking request often stops at a suggested time.",
        works: "Available scheduling flows gather the needed detail before using the configured Google Calendar integration.",
        outcome: "A conversation can progress into an operational next step.",
      },
      {
        title: "Voice and audio",
        availability: "Available in supported workflows",
        problem: "Some customer requests begin as voice rather than typed text.",
        works: "The engine includes audio transcription capability for supported workflows.",
        outcome: "Voice can enter the same business communication flow as text when enabled.",
      },
    ],
  },
  {
    id: "operate",
    eyebrow: "Operate",
    title: "Make the work visible, without rebuilding it for every channel.",
    features: [
      {
        title: "Live workflow visibility",
        availability: "Live in the website workspace",
        problem: "People should not have to guess whether meaningful work is happening.",
        works: "The website workspace displays only the server-sent workflow events emitted for that request.",
        outcome: "Customers can see the real stages used to process the conversation.",
      },
      {
        title: "Channel-neutral architecture",
        availability: "Website workspace live · other channels planned",
        problem: "Business logic should not be rebuilt for every entry point.",
        works: "Nexus is designed around channel-neutral message contracts, with the public website workspace as the current product surface.",
        outcome: "Future channels can share one operational communication layer as they are released.",
      },
    ],
  },
];

export default function FeatureSystems() {
  const [openBySystem, setOpenBySystem] = useState<Record<string, string>>({ respond: "respond-adaptive-communication" });
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-16 space-y-16 sm:mt-20">
      {systems.map((system) => (
        <section aria-labelledby={`${system.id}-title`} key={system.id}>
          <div className="max-w-3xl border-b border-white/[0.1] pb-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">{system.eyebrow}</p>
            <h2 className="mt-3 font-heading text-3xl font-medium tracking-[-0.04em] text-white sm:text-4xl" id={`${system.id}-title`}>{system.title}</h2>
          </div>
          <div className="mt-5 lg:grid lg:grid-cols-[minmax(14rem,0.76fr)_minmax(0,1.24fr)] lg:gap-5">
            <div className="space-y-2">
              {system.features.map((feature) => {
              const featureId = `${system.id}-${feature.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
              const activeFeatureId = openBySystem[system.id] ?? `${system.id}-${system.features[0].title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
              const isOpen = activeFeatureId === featureId;

              return (
                <article className="nexus-control rounded-[var(--nexus-radius-control)]" key={featureId}>
                  <button aria-controls={`${featureId}-content`} aria-expanded={isOpen} className={`nexus-focus flex min-h-16 w-full items-center justify-between gap-4 rounded-[var(--nexus-radius-control)] px-5 py-4 text-left ${isOpen ? "bg-white/[0.055]" : ""}`} onClick={() => setOpenBySystem((current) => ({ ...current, [system.id]: featureId }))} type="button">
                    <span className="nexus-heading text-base font-medium">{feature.title}</span>
                    <span aria-hidden="true" className={`text-lg text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <div className="lg:hidden">
                  <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} initial={{ height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="overflow-hidden border-t border-white/[0.08]" id={`${featureId}-content`}>
                    <div className="px-5 pb-5 pt-4">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">{feature.availability}</p>
                      <dl className="mt-5 grid gap-4 text-sm leading-6">
                        <div><dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">Business problem</dt><dd className="mt-1.5 text-zinc-400">{feature.problem}</dd></div>
                        <div><dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">How Nexus works</dt><dd className="mt-1.5 text-zinc-300">{feature.works}</dd></div>
                        <div><dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">Business outcome</dt><dd className="mt-1.5 text-zinc-200">{feature.outcome}</dd></div>
                      </dl>
                    </div></motion.div>
                  )}
                  </AnimatePresence>
                  </div>
                </article>
              );
            })}
            </div>
            <div className="nexus-card hidden min-h-[20rem] rounded-[var(--nexus-radius-surface)] p-7 lg:block">
              <AnimatePresence mode="wait" initial={false}>
                {system.features.map((feature) => {
                  const featureId = `${system.id}-${feature.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
                  const activeFeatureId = openBySystem[system.id] ?? `${system.id}-${system.features[0].title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
                  if (activeFeatureId !== featureId) return null;
                  return <motion.div animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} initial={{ opacity: 0, y: 6 }} key={featureId} transition={{ duration: reduceMotion ? 0 : 0.22 }}>
                    <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">{feature.availability}</p>
                    <h3 className="nexus-heading mt-5 font-heading text-2xl font-medium tracking-[-0.04em]">{feature.title}</h3>
                    <dl className="mt-8 grid gap-6 text-sm leading-6">
                      <div><dt className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">Business problem</dt><dd className="nexus-copy mt-2">{feature.problem}</dd></div>
                      <div><dt className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">How Nexus works</dt><dd className="nexus-copy mt-2">{feature.works}</dd></div>
                      <div><dt className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">Business outcome</dt><dd className="nexus-heading mt-2">{feature.outcome}</dd></div>
                    </dl>
                  </motion.div>;
                })}
              </AnimatePresence>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
