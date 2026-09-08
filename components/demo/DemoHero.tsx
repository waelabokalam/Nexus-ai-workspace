"use client";

import { motion } from "framer-motion";

const metadata = [
  "Two live workspaces",
  "Business knowledge",
  "Calendar workflows",
];

export default function DemoHero() {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl text-center"
      initial={false}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">
        Nexus proof and demos
      </p>
      <h1 className="nexus-heading mt-6 font-heading text-5xl font-semibold tracking-[-0.06em] sm:text-6xl md:text-7xl">
        Experience Nexus
      </h1>
      <p className="nexus-copy mx-auto mt-6 max-w-2xl text-base leading-7 sm:text-lg">
        Try the live Nexus Agent, inspect a restaurant workflow, or explore a real Nexus Direct implementation.
      </p>
      <p className="nexus-subtle mt-3 text-sm tracking-[-0.01em]">
        Live products, proof and independent prototypes are grouped separately.
      </p>

      <motion.div
        animate="visible"
        className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2"
        initial={false}
        variants={{
          hidden: {},
          visible: { transition: { delayChildren: 0.25, staggerChildren: 0.06 } },
        }}
      >
        {metadata.map((item) => (
          <motion.span
            className="nexus-control rounded-full px-3 py-1.5 text-xs font-medium text-[var(--nexus-text-muted)]"
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
