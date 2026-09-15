import Link from "next/link";
import type { Metadata } from "next";
import DemoGrid from "@/components/demo/DemoGrid";
import DemoHero from "@/components/demo/DemoHero";
import TqMonogram from "@/components/ui/TqMonogram";
import CompanyFooter from "@/components/marketing/CompanyFooter";
import ThemeToggle from "@/components/ThemeToggle";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata("Product Demos", "Experience live TQEN agent and restaurant workflows, plus a clearly labeled independent concept prototype.", "/demo");

export default function DemoPage() {
  return (
    <main className="nexus-page relative min-h-screen overflow-x-hidden text-white">
      <a className="nexus-skip-link" href="#main-content">Skip to content</a>

      <header className="relative z-10 mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:px-8">
        <Link aria-label="TQEN home" className="nexus-heading nexus-focus inline-flex items-center gap-3 rounded-lg p-2 text-[15px] font-semibold tracking-[-0.03em] sm:gap-3.5 sm:text-base" href="/">
          <TqMonogram className="h-8 w-auto sm:h-9 lg:h-10" size={40} />
          <span>TQEN</span>
        </Link>

        <div className="flex items-center gap-5">
          <p className="nexus-subtle hidden text-right text-[10px] font-medium uppercase leading-4 tracking-[0.16em] sm:block">
            Powered by<br />
            <span>TQEN Engine</span>
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

        <section className="mt-24 border-t border-[var(--nexus-border)] py-16 text-center sm:mt-32">
          <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Current public experiences</p>
          <h2 className="nexus-heading mt-5 font-heading text-3xl font-medium tracking-[-0.045em] sm:text-4xl">Real request paths. Honest boundaries. No scripted outcomes.</h2>
          <p className="nexus-copy mx-auto mt-4 max-w-2xl text-sm leading-6">Use the live workspaces to test knowledge, memory, multilingual communication and configured actions. Availability is stated on every experience.</p>
        </section>
      </div>
      <CompanyFooter />
    </main>
  );
}
