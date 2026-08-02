"use client";

import { motion, useReducedMotion } from "framer-motion";

const metadata = [
  "One live workspace",
  "Business knowledge",
  "Conversation memory",
  "Calendar workflows",
];

export default function DemoHero() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl text-center"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
        Live product experience
      </p>
      <h1 className="mt-6 font-heading text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl md:text-7xl">
        Experience Nexus
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
        Explore the live Customer Support workspace, then see the business scenarios planned for future releases.
      </p>
      <p className="mt-3 text-sm tracking-[-0.01em] text-zinc-500">
        Customer Support is available now. The remaining scenarios are planned product directions, not functioning demos.
      </p>

      <motion.div
        animate="visible"
        className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2"
        initial={reduceMotion ? false : "hidden"}
        variants={{
          hidden: {},
          visible: { transition: { delayChildren: 0.25, staggerChildren: 0.06 } },
        }}
      >
        {metadata.map((item) => (
          <motion.span
            className="rounded-full border border-white/[0.1] bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-zinc-300"
            key={item}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
          >
            {item}
          </motion.span>
        ))}
      </motion.div>
    </motion.section>
  );
}
