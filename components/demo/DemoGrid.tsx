"use client";

import { motion, type Variants } from "framer-motion";
import { demos, type Demo } from "@/data/demos";
import { demoHubEn } from "@/lib/i18n/demo";
import type { Locale } from "@/lib/i18n/routing";
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

export default function DemoGrid({ items = demos, locale = "en", label = demoHubEn.gridLabel }: { items?: Demo[]; locale?: Locale; label?: string }) {
  return (
    <motion.section
      animate="visible"
      aria-label={label}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      initial={false}
      variants={gridVariants}
    >
      {items.map((demo) => (
        <DemoCard demo={demo} key={demo.id} locale={locale} />
      ))}
    </motion.section>
  );
}
