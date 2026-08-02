import type { Metadata } from "next";
import MarketingPage from "@/components/MarketingPage";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata("About", "Why Nexus is building operating infrastructure for business communication.", "/about");

export default function AboutPage() {
  return <MarketingPage><section className="mx-auto max-w-4xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28"><p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">About Nexus</p><h1 className="mt-5 font-heading text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">Business communication is operational work.</h1><div className="mt-10 max-w-3xl space-y-6 text-lg leading-8 text-zinc-400"><p>Nexus is being built for teams that need more than a chatbot. A useful business conversation should understand the question, retrieve relevant knowledge, remember context and move a workflow forward when action is needed.</p><p>The current public experience demonstrates a website support workspace backed by the Nexus Engine. The product is evolving through early-access conversations, with future channels and deployment options evaluated deliberately rather than promised ahead of delivery.</p></div></section></MarketingPage>;
}
