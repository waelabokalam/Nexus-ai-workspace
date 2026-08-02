import type { ReactNode } from "react";
import MarketingPage from "@/components/MarketingPage";

type LegalSection = { title: string; content: ReactNode };

export default function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return <MarketingPage><section className="mx-auto max-w-3xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28"><p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">Nexus legal</p><h1 className="mt-5 font-heading text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">{title}</h1><p className="mt-6 text-lg leading-8 text-zinc-400">{intro}</p><p className="mt-4 text-sm text-zinc-500">Applies to the current public Nexus website and demo.</p><div className="mt-14 space-y-10">{sections.map((section) => <section className="border-t border-white/[0.08] pt-7" key={section.title}><h2 className="font-heading text-2xl font-medium tracking-[-0.035em] text-white">{section.title}</h2><div className="mt-3 text-sm leading-7 text-zinc-300">{section.content}</div></section>)}</div></section></MarketingPage>;
}
