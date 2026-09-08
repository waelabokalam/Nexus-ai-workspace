"use client";

import { motion, type Variants } from "framer-motion";
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
  return (
    <div className="space-y-16">
      {([['live', 'Live'], ['proof', 'Case study / proof'], ['lab', 'Prototype / lab']] as const).map(([group, label]) => {
        const items = demos.filter((demo) => demo.group === group);
        if (!items.length) return null;
        return <section aria-labelledby={`demo-${group}`} key={group}><div className="flex items-center gap-4"><h2 className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]" id={`demo-${group}`}>{label}</h2><span aria-hidden="true" className="h-px flex-1 bg-[var(--nexus-border)]" /></div><motion.div animate="visible" className={`mt-5 grid grid-cols-1 gap-4 ${items.length > 1 ? "md:grid-cols-2" : "max-w-2xl"}`} initial={false} variants={gridVariants}>{items.map((demo) => <DemoCard demo={demo} key={demo.id} />)}</motion.div></section>;
      })}
    </div>
  );
}
