"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import type { Demo } from "@/data/demos";
import CapabilityChip from "@/components/demo/CapabilityChip";
import DemoMetadataRow from "@/components/demo/DemoMetadataRow";
import DemoScenarioIcon from "@/components/demo/DemoScenarioIcon";

type DemoCardProps = {
  demo: Demo;
};

const demoCardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function DemoCard({ demo }: DemoCardProps) {
  const isAvailable = demo.status === "available";
  const statusLabel = isAvailable ? "Live" : demo.status === "planned" ? "Planned" : "Coming soon";
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      variants={demoCardVariants}
      whileHover={reduceMotion ? undefined : { y: -2, transition: { duration: 0.2, ease: "easeOut" } }}
      className={`group relative flex min-h-[370px] flex-col overflow-hidden rounded-[var(--nexus-radius-surface)] border bg-white/[0.025] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.18)] transition-colors duration-200 hover:border-white/[0.18] ${
        isAvailable ? "border-white/[0.17]" : "border-white/[0.1]"
      }`}
    >
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex size-10 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.045] text-zinc-100">
          <DemoScenarioIcon
            className="size-5 transition-transform duration-300 group-hover:rotate-3"
            icon={demo.icon}
          />
        </div>

        <span className={`inline-flex items-center gap-1.5 pt-1 text-xs font-medium ${isAvailable ? "text-zinc-200" : "text-zinc-500"}`}>
          {isAvailable ? (
            <span className="relative flex size-1.5">
              <span className="relative inline-flex size-1.5 rounded-full bg-zinc-200" />
            </span>
          ) : (
            <span className="size-1.5 rounded-full bg-zinc-700" />
          )}
          {statusLabel}
        </span>
      </div>

      <div className="relative mt-7">
        <h2 className="font-heading text-2xl font-medium tracking-[-0.03em] text-white">
          {demo.title}
        </h2>
        <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">
          {demo.description}
        </p>
      </div>

      <div className="relative mt-6 flex flex-wrap gap-2">
        {demo.capabilities.map((capability) => (
          <CapabilityChip key={capability}>{capability}</CapabilityChip>
        ))}
      </div>

      <div className="relative mt-5 space-y-1.5 border-t border-white/[0.06] pt-4">
        <DemoMetadataRow label={demo.availability.label} values={demo.availability.values} />
      </div>

      {isAvailable ? (
        <Link
          className="nexus-focus relative mt-auto inline-flex h-11 w-full items-center justify-center rounded-[var(--nexus-radius-control)] bg-white text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
          href="/demo/support"
        >
          Open Workspace →
        </Link>
      ) : (
        <button
          aria-disabled="true"
          className="relative mt-auto inline-flex h-11 w-full cursor-default items-center justify-center rounded-[var(--nexus-radius-control)] border border-white/[0.08] bg-white/[0.025] text-sm font-medium text-zinc-400"
          disabled
          type="button"
        >
          {demo.status === "planned" ? "Planned configuration" : "Coming soon"}
        </button>
      )}
    </motion.article>
  );
}
