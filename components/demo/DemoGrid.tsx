"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { demos } from "@/data/demos";
import DemoCard from "@/components/demo/DemoCard";

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.07,
    },
  },
};

export default function DemoGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      animate="visible"
      aria-label="Available Nexus demos"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      initial={reduceMotion ? false : "hidden"}
      variants={gridVariants}
    >
      {demos.map((demo) => (
        <DemoCard demo={demo} key={demo.id} />
      ))}
    </motion.section>
  );
}
