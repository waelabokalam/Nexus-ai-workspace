"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import NexusCore from "@/components/ui/NexusCore";

const engineSteps = [
  "Understand intent and language",
  "Retrieve business context and memory",
  "Respond or move into an available action",
] as const;

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative px-5 pb-18 pt-20 sm:px-8 sm:pb-24 sm:pt-28 lg:pb-28">
      <motion.span animate={reduceMotion ? undefined : { opacity: [0.18, 0.48, 0.18], scale: [0.92, 1.08, 0.92] }} aria-hidden="true" className="pointer-events-none absolute left-[21%] top-24 size-16 rounded-full bg-white/[0.08] blur-3xl" transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }} />
      <motion.span animate={reduceMotion ? undefined : { opacity: [0.14, 0.32, 0.14], y: [-4, 4, -4] }} aria-hidden="true" className="pointer-events-none absolute right-[19%] top-44 size-2 rounded-full bg-white shadow-[0_0_0_7px_rgba(255,255,255,0.04),0_0_32px_rgba(255,255,255,0.35)]" transition={{ duration: 4.4, ease: "easeInOut", repeat: Infinity }} />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.16fr)_minmax(22rem,0.84fr)] lg:items-end lg:gap-14">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.11] bg-white/[0.035] px-3 py-1.5 text-xs text-zinc-300 shadow-[inset_0_1px_rgba(255,255,255,0.05)]"><motion.span animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55], scale: [0.9, 1, 0.9] }} aria-hidden="true" className="size-1.5 rounded-full bg-zinc-200 shadow-[0_0_0_4px_rgba(255,255,255,0.06)]" transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }} />Nexus Engine <span className="text-zinc-600">/</span> Website workspace live</div>
          <p className="mt-7 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">Business communication, made operational</p>
          <h1 className="mt-5 max-w-4xl font-heading text-5xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-6xl lg:text-[4.6rem]">
            The AI operating system for business communication.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
            Nexus helps businesses understand customer intent, use company knowledge, remember context and move conversations into the right workflow or action.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link className="nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] bg-white px-5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200" href="/demo">
              Try the live demo <span aria-hidden="true" className="ml-2">→</span>
            </Link>
            <Link className="nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] border border-white/[0.14] bg-white/[0.025] px-5 text-sm font-medium text-white transition hover:bg-white/[0.07]" href="/features">
              Explore capabilities
            </Link>
          </div>
        </div>
        <motion.aside className="nexus-frame overflow-hidden rounded-[var(--nexus-radius-surface)] p-1" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} whileHover={reduceMotion ? undefined : { y: -4, scale: 1.005 }}>
          <div className="rounded-[calc(var(--nexus-radius-surface)-0.3rem)] bg-[#111113]/90 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4"><motion.div animate={reduceMotion ? undefined : { rotate: [0, 1.5, 0, -1.5, 0] }} transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}><NexusCore size={38} /></motion.div><span className="rounded-full border border-white/[0.1] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400">Operating layer</span></div>
            <div className="relative mt-8 overflow-hidden border-y border-white/[0.08] py-4">
              <motion.span animate={reduceMotion ? undefined : { x: ["-20%", "120%"] }} aria-hidden="true" className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" transition={{ duration: 3.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.6 }} />
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">Customer request</p>
              <p className="mt-2 text-sm leading-6 text-zinc-200">“Can you help our team understand the right next step?”</p>
            </div>
            <ol className="mt-4 space-y-3">
              {engineSteps.map((step, index) => <motion.li animate={reduceMotion ? undefined : { opacity: [0.52, 1, 0.52] }} className="flex items-center gap-3 text-sm text-zinc-400" key={step} transition={{ delay: index * 0.48, duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.6 }}><span className="grid size-6 shrink-0 place-items-center rounded-full border border-white/[0.1] bg-white/[0.04] text-[11px] font-medium text-zinc-200">0{index + 1}</span>{step}</motion.li>)}
            </ol>
            <div className="mt-6 flex items-center justify-between rounded-xl border border-white/[0.08] bg-black/20 px-3.5 py-3"><span className="text-xs text-zinc-400">Visible execution, not hidden chat.</span><motion.span animate={reduceMotion ? undefined : { opacity: [0.4, 1, 0.4], scale: [0.85, 1, 0.85] }} aria-hidden="true" className="size-2 rounded-full bg-zinc-200 shadow-[0_0_0_4px_rgba(255,255,255,0.06)]" transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }} /></div>
          </div>
        </motion.aside>
        <div className="col-span-full mt-2 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/[0.08] pt-5 text-sm text-zinc-500"><span className="text-zinc-300">Available today</span><span>Adaptive conversations</span><span>Business knowledge</span><span>Conversation memory</span><span>Calendar workflows</span></div>
      </div>
    </section>
  );
}
