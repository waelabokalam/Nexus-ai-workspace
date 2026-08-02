"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DocsNavigationProps = {
  sections: readonly { id: string; title: string }[];
};

export default function DocsNavigation({ sections }: DocsNavigationProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px" },
    );
    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [sections]);

  const links = (
    <ul className="space-y-1">
      {sections.map((section) => (
        <li key={section.id}>
          <Link aria-current={activeId === section.id ? "location" : undefined} className={`nexus-focus block rounded-lg px-3 py-2 text-sm transition ${activeId === section.id ? "bg-white/[0.07] text-white" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"}`} href={`#${section.id}`}>
            {section.title}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <details className="nexus-surface rounded-[var(--nexus-radius-control)] p-2 lg:hidden">
        <summary className="nexus-focus cursor-pointer list-none rounded-lg px-3 py-2 text-sm font-medium text-white">On this page</summary>
        <div className="border-t border-white/[0.08] pt-2">{links}</div>
      </details>
      <aside className="hidden h-fit lg:sticky lg:top-24 lg:block">
        <p className="mb-3 px-3 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">On this page</p>
        <nav aria-label="Documentation navigation" className="border-l border-white/[0.1] pl-2">{links}</nav>
      </aside>
    </>
  );
}
