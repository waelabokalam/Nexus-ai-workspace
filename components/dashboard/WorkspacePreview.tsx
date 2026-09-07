"use client";

import { motion, useReducedMotion } from "framer-motion";

import NexusCore from "@/components/ui/NexusCore";

const coreCapabilities = [
  "AI agents",
  "Automation",
  "CRM",
  "Analytics",
  "Identity & permissions",
  "Notifications",
  "Integrations",
  "Vision",
  "Cloud infrastructure",
] as const;

const industryLayers = [
  { name: "Restaurant systems", state: "Live" },
  { name: "Retail systems", state: "In development" },
  { name: "Fitness systems", state: "Planned" },
  { name: "Future verticals", state: "Extensible" },
] as const;

export default function WorkspacePreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative px-5 py-24 sm:px-8 sm:py-32" id="nexus-core">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Nexus Core</p>
            <h2 className="nexus-heading mt-4 max-w-xl font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              One core. Specialized systems.
            </h2>
          </div>
          <p className="nexus-copy max-w-2xl text-base leading-7 lg:justify-self-end">
            Nexus combines shared infrastructure with industry-specific modules. That means each product can feel purpose-built without rebuilding intelligence, automation and operational foundations every time.
          </p>
        </div>

        <div className="nexus-frame mt-12 overflow-hidden rounded-[var(--nexus-radius-surface)] p-1">
          <div className="nexus-surface rounded-[calc(var(--nexus-radius-surface)-0.3rem)] p-5 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
              <div className="relative overflow-hidden rounded-[var(--nexus-radius-control)] border border-white/[0.09] bg-black/25 p-6 sm:p-8">
                <motion.div
                  animate={reduceMotion ? undefined : { opacity: [0.3, 0.75, 0.3], scale: [0.95, 1.08, 0.95] }}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-3xl"
                  transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }}
                />

                <div className="relative flex flex-col items-center text-center">
                  <NexusCore size={64} />
                  <p className="nexus-heading mt-5 text-xs font-semibold uppercase tracking-[0.2em]">Nexus Core</p>
                  <p className="nexus-copy mt-3 max-w-sm text-sm leading-6">The reusable intelligence and operational layer behind every Nexus industry system.</p>
                </div>

                <div className="relative mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {coreCapabilities.map((capability, index) => (
                    <motion.div
                      className="nexus-control flex min-h-14 items-center justify-center rounded-xl px-3 text-center text-xs text-[var(--nexus-text-muted)]"
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      key={capability}
                      transition={{ delay: index * 0.04, duration: 0.35 }}
                      viewport={{ once: true, amount: 0.5 }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      {capability}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col rounded-[var(--nexus-radius-control)] border border-white/[0.09] bg-black/25 p-6 sm:p-8">
                <div>
                  <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Industry layer</p>
                  <h3 className="nexus-heading mt-3 font-heading text-2xl font-medium tracking-[-0.04em]">Configured around the operation.</h3>
                </div>

                <div className="mt-8 space-y-3">
                  {industryLayers.map((industry, index) => (
                    <motion.div
                      className="nexus-control relative flex items-center justify-between gap-4 overflow-hidden rounded-xl px-4 py-4"
                      key={industry.name}
                      whileHover={reduceMotion ? undefined : { x: 3 }}
                    >
                      <motion.span
                        animate={reduceMotion ? undefined : { x: ["-120%", "420%"] }}
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-transparent via-white/[0.045] to-transparent"
                        transition={{ delay: index * 0.7, duration: 3.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 }}
                      />
                      <span className="nexus-heading relative text-sm font-medium">{industry.name}</span>
                      <span className="nexus-subtle relative text-[10px] font-medium uppercase tracking-[0.1em]">{industry.state}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="nexus-control mt-8 rounded-xl px-4 py-4 lg:mt-auto">
                  <p className="nexus-copy text-xs leading-5">Shared technology creates leverage. Industry-specific software creates fit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
