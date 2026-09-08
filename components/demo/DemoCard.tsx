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
  const statusLabel = demo.status === "available" ? "Live" : demo.status === "proof" ? "Proof" : "Prototype";
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      variants={demoCardVariants}
      whileHover={reduceMotion ? undefined : { y: -2, transition: { duration: 0.2, ease: "easeOut" } }}
      className="nexus-card group relative flex min-h-[370px] flex-col overflow-hidden rounded-[var(--nexus-radius-surface)] border-[var(--nexus-border-strong)] p-5 transition-colors duration-200"
      data-demo-id={demo.id}
    >
      <div className="relative flex items-start justify-between gap-4">
        <div className="nexus-control flex size-10 items-center justify-center rounded-xl text-[var(--nexus-text)]">
          <DemoScenarioIcon
            className="size-5 transition-transform duration-300 group-hover:rotate-3"
            icon={demo.icon}
          />
        </div>

        <span className="inline-flex items-center gap-1.5 pt-1 text-xs font-medium text-[var(--nexus-text)]">
          <span className="relative inline-flex size-1.5 rounded-full bg-current" />
          {statusLabel}
        </span>
      </div>

      <div className="relative mt-7">
        <h2 className="nexus-heading font-heading text-2xl font-medium tracking-[-0.03em]">
          {demo.title}
        </h2>
        <p className="nexus-copy mt-3 min-h-12 text-sm leading-6">
          {demo.description}
        </p>
      </div>

      <div className="relative mt-6 flex flex-wrap gap-2">
        {demo.capabilities.map((capability) => (
          <CapabilityChip key={capability}>{capability}</CapabilityChip>
        ))}
      </div>

      <div className="relative mt-5 space-y-1.5 border-t border-[var(--nexus-border)] pt-4">
        <DemoMetadataRow label={demo.availability.label} values={demo.availability.values} />
      </div>

      <Link
        className="nexus-button-primary nexus-focus relative mt-auto inline-flex h-11 w-full items-center justify-center rounded-[var(--nexus-radius-control)] text-sm font-medium"
        href={demo.href ?? "/demo"}
      >
        {demo.status === "proof" ? "View Case Study" : demo.status === "prototype" ? "Open Prototype" : "Open Workspace"} →
      </Link>
    </motion.article>
  );
}
