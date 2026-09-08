import Link from "next/link";
import type { Metadata } from "next";
import DemoGrid from "@/components/demo/DemoGrid";
import DemoHero from "@/components/demo/DemoHero";
import NexusCore from "@/components/ui/NexusCore";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata("Nexus Systems Demo", "Experience live Nexus agents, inspect working product proof, and explore a clearly disclosed concept prototype.", "/demo");

export default function DemoPage() {
  return (
    <main className="nexus-page relative min-h-screen overflow-x-hidden text-white">
      <a className="nexus-skip-link" href="#main-content">Skip to content</a>

      <header className="relative z-10 mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:px-8">
        <Link className="nexus-heading nexus-focus inline-flex items-center gap-3 rounded-lg text-sm font-medium tracking-[-0.02em]" href="/">
          <NexusCore size={30} />
          <span>Nexus</span>
        </Link>

        <div className="flex items-center gap-5">
          <p className="nexus-subtle hidden text-right text-[10px] font-medium uppercase leading-4 tracking-[0.16em] sm:block">
            Powered by<br />
            <span>Nexus Engine</span>
          </p>
          <ThemeToggle />
          <Link className="nexus-button-secondary nexus-focus rounded-full px-4 py-2 text-sm" href="/">
            Back to Home
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24" id="main-content">
        <DemoHero />
        <div className="mt-20 sm:mt-24">
          <DemoGrid />
        </div>

      </div>
      <Footer />
    </main>
  );
}
