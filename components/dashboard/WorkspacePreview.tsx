"use client";

import { useState } from "react";

import AutomationIcon from "@/components/icons/AutomationIcon";
import CompletedIcon from "@/components/icons/CompletedIcon";
import GPTIcon from "@/components/icons/GPTIcon";
import KnowledgeIcon from "@/components/icons/KnowledgeIcon";

const workflowIconContainer =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.045] text-zinc-100";

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

  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">How it operates</p>
          <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">From message to meaningful next step.</h2>
          <p className="mt-5 text-base leading-7 text-zinc-400">A business request moves through knowledge, memory, routing and action—with the work made visible as it happens.</p>
        </div>

        <div className="nexus-surface rounded-[var(--nexus-radius-surface)] p-5 sm:p-8">
          <div className="flex flex-col gap-3 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">Illustrative operating flow</p>
            <p className="text-xs leading-5 text-zinc-500">The live demo shows real emitted workflow events.</p>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-[var(--nexus-radius-control)] border border-white/[0.08] bg-black/20 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">Communication input</p>
              <div aria-label="Illustrative operating-flow stages" className="mt-5 space-y-3 text-left text-sm" role="group">
                {communicationInputs.map((input, index) => {
                  const isSelected = index === selectedInputIndex;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`nexus-focus w-full rounded-xl border px-3 py-3 text-left transition-colors duration-200 ${
                        isSelected
                          ? "border-white/[0.14] bg-white/[0.06]"
                          : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.12] hover:bg-white/[0.04]"
                      }`}
                      key={input.label}
                      onClick={() => setSelectedInputIndex(index)}
                      type="button"
                    >
                      <p className={isSelected ? "font-medium text-white" : "font-medium text-zinc-200"}>{input.label}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">{input.detail}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[var(--nexus-radius-control)] border border-white/[0.08] bg-black/20 p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Visible execution</p>
                  <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.04em] text-white sm:text-3xl">{selectedInput.title}</h3>
                  <p aria-live="polite" className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">{selectedInput.summary}</p>
                </div>
                <span className="rounded-full border border-white/[0.1] px-3 py-1 text-xs text-zinc-300">Illustrative</span>
              </div>

              <ol className="mt-8 space-y-5">
                {flow.map((step, index) => {
                  const Icon = step.icon;
                  const isHighlighted = selectedInput.highlightedStep === index;
                  const isDeemphasized = selectedInput.highlightedStep !== undefined && !isHighlighted;

                  return (
                    <li className={`relative flex gap-4 transition-opacity duration-200 ${isDeemphasized ? "opacity-40" : "opacity-100"}`} key={step.title}>
                      {index < flow.length - 1 && <span aria-hidden="true" className="absolute left-5 top-10 h-7 w-px bg-white/[0.12]" />}
                      <span className={`${workflowIconContainer} ${isHighlighted ? "border-white/[0.18] bg-white/[0.09]" : ""}`}><Icon className="size-5" /></span>
                      <div className="pb-1"><p className="text-sm font-medium text-white">{step.title}</p><p className="mt-1 text-sm leading-6 text-zinc-400">{step.description}</p></div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
