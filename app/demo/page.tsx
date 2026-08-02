import Link from "next/link";
import type { Metadata } from "next";
import DemoGrid from "@/components/demo/DemoGrid";
import DemoHero from "@/components/demo/DemoHero";
import NexusCore from "@/components/ui/NexusCore";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata("Demo Hub", "Experience the live Nexus Customer Support workspace and future business communication scenarios.", "/demo");

export default function DemoPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#09090b] text-white">
      <a className="nexus-skip-link" href="#main-content">Skip to content</a>

      <header className="relative z-10 mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:px-8">
        <Link className="nexus-focus inline-flex items-center gap-3 rounded-lg text-sm font-medium tracking-[-0.02em] text-white" href="/">
          <NexusCore size={30} />
          <span>Nexus</span>
        </Link>

        <div className="flex items-center gap-5">
          <p className="hidden text-right text-[10px] font-medium uppercase leading-4 tracking-[0.16em] text-zinc-600 sm:block">
            Powered by<br />
            <span className="text-zinc-500">Nexus Engine</span>
          </p>
          <Link className="nexus-focus rounded-full border border-white/[0.09] bg-white/[0.035] px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-white/[0.16] hover:bg-white/[0.07] hover:text-white" href="/">
            Back to Home
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24" id="main-content">
        <DemoHero />
        <div className="mt-20 sm:mt-24">
          <DemoGrid />
        </div>

        <section className="mt-24 border-t border-white/[0.08] py-16 text-center sm:mt-32">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">What is live today</p>
          <h2 className="mt-5 font-heading text-3xl font-medium tracking-[-0.045em] text-white sm:text-4xl">A real website workspace, with real emitted workflow events.</h2>
        </section>
      </div>
      <Footer />
    </main>
  );
}
