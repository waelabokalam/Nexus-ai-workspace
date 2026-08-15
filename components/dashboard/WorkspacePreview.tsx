"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import AutomationIcon from "@/components/icons/AutomationIcon";
import CompletedIcon from "@/components/icons/CompletedIcon";
import GPTIcon from "@/components/icons/GPTIcon";
import KnowledgeIcon from "@/components/icons/KnowledgeIcon";

const workflowIconContainer =
  "nexus-workflow-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.045] text-zinc-100";

const flow = [
  { icon: KnowledgeIcon, title: "Business knowledge", description: "Relevant company context is retrieved when the request needs it." },
  { icon: GPTIcon, title: "Intent & memory", description: "The request is understood in the context of the conversation." },
  { icon: AutomationIcon, title: "Workflow action", description: "Nexus responds or moves into an available action flow." },
  { icon: CompletedIcon, title: "Outcome", description: "The response and any emitted workflow stages are visible in the workspace." },
];

const communicationInputs = [
  {
    label: "Website message",
    detail: "Customer request received",
    title: "Business communication",
    summary: "A customer message enters a considered workflow instead of an isolated chat response.",
  },
  {
    label: "Customer context",
    detail: "Language and conversation history",
    title: "Conversation context",
    summary: "Nexus considers the customer’s language and the context already present in the conversation.",
    highlightedStep: 1,
  },
  {
    label: "Business knowledge",
    detail: "Relevant company information",
    title: "Business knowledge",
    summary: "Relevant company information can be retrieved when a request requires an informed answer.",
    highlightedStep: 0,
  },
  {
    label: "Action routing",
    detail: "Response or available next step",
    title: "Action routing",
    summary: "Requests can stay conversational or move into an available action flow when appropriate.",
    highlightedStep: 2,
  },
];

export default function WorkspacePreview() {
  const [selectedInputIndex, setSelectedInputIndex] = useState(0);
  const selectedInput = communicationInputs[selectedInputIndex];
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid max-w-3xl gap-5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">How it operates</p>
          <h2 className="font-heading text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl">From message to a meaningful next step.</h2>
          <p className="max-w-2xl text-base leading-7 text-zinc-400">A business request moves through knowledge, memory, routing and action—with the operational work visible as it happens.</p>
        </div>

        <div className="nexus-frame rounded-[var(--nexus-radius-surface)] p-1">
          <div className="rounded-[calc(var(--nexus-radius-surface)-0.3rem)] bg-[#101012]/85 p-5 sm:p-8">
          <div className="flex flex-col gap-3 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">Nexus operating flow</p>
            <p className="text-xs leading-5 text-zinc-500">The live demo shows actual emitted workflow events.</p>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-[var(--nexus-radius-control)] border border-white/[0.09] bg-black/25 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">Communication input</p>
              <div aria-label="Illustrative operating-flow stages" className="mt-5 space-y-3 text-left text-sm" role="group">
                {communicationInputs.map((input, index) => {
                  const isSelected = index === selectedInputIndex;

                  return (
                    <motion.button
                      aria-pressed={isSelected}
                      className={`nexus-focus w-full rounded-xl border px-3 py-3 text-left transition-colors duration-200 ${
                        isSelected
                          ? "border-white/[0.14] bg-white/[0.06]"
                          : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.12] hover:bg-white/[0.04]"
                      }`}
                      key={input.label}
                      onClick={() => setSelectedInputIndex(index)}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      type="button"
                      whileHover={reduceMotion ? undefined : { x: 3 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                    >
                      <div className="flex items-center justify-between gap-3"><p className={isSelected ? "font-medium text-white" : "font-medium text-zinc-200"}>{input.label}</p><motion.span animate={isSelected ? { opacity: [0.65, 1, 0.65], scale: [0.9, 1, 0.9] } : { opacity: 1, scale: 1 }} className={`size-1.5 rounded-full ${isSelected ? "bg-zinc-200 shadow-[0_0_0_4px_rgba(255,255,255,0.06)]" : "bg-zinc-700"}`} transition={isSelected && !reduceMotion ? { duration: 1.8, ease: "easeInOut", repeat: Infinity } : { duration: 0.2 }} /></div>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">{input.detail}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[var(--nexus-radius-control)] border border-white/[0.09] bg-black/25 p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Visible execution</p>
                  <motion.div animate={{ opacity: 1, y: 0 }} initial={false} key={selectedInput.title} transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}><h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.04em] text-white sm:text-3xl">{selectedInput.title}</h3><p aria-live="polite" className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">{selectedInput.summary}</p></motion.div>
                </div>
                <span className="rounded-full border border-white/[0.1] px-3 py-1 text-xs text-zinc-300">Illustrative</span>
              </div>

              <ol className="mt-8 space-y-5">
                {flow.map((step, index) => {
                  const Icon = step.icon;
                  const isHighlighted = selectedInput.highlightedStep === index;
                  const isDeemphasized = selectedInput.highlightedStep !== undefined && !isHighlighted;

                  return (
                    <motion.li animate={{ opacity: isDeemphasized ? 0.35 : 1, x: isHighlighted && !reduceMotion ? 3 : 0 }} className="relative flex gap-4" key={step.title} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
                      {index < flow.length - 1 && <span aria-hidden="true" className="absolute left-5 top-10 h-7 w-px overflow-hidden bg-white/[0.12]"><motion.span animate={isHighlighted && !reduceMotion ? { y: ["-100%", "250%"] } : { y: "-100%" }} className="absolute inset-x-0 top-0 h-3 bg-white" transition={{ duration: 1.3, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.7 }} /></span>}
                      <motion.span animate={isHighlighted && !reduceMotion ? { scale: [1, 1.08, 1] } : { scale: 1 }} className={`${workflowIconContainer} ${isHighlighted ? "border-white/[0.18] bg-white/[0.09]" : ""}`} transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}><Icon className="size-5" /></motion.span>
                      <div className="pb-1"><p className="text-sm font-medium text-white">{step.title}</p><p className="mt-1 text-sm leading-6 text-zinc-400">{step.description}</p></div>
                    </motion.li>
                  );
                })}
              </ol>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
