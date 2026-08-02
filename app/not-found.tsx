import Link from "next/link";
import type { Metadata } from "next";
import MarketingPage from "@/components/MarketingPage";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested Nexus page could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <MarketingPage><section className="mx-auto max-w-3xl px-5 py-28 text-center sm:px-8 sm:py-32"><p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">404</p><h1 className="mt-5 font-heading text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">This route is not part of Nexus.</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-400">Return to the product overview or open the Demo Hub.</p><div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><Link className="nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] bg-white px-5 text-sm font-medium text-zinc-950" href="/">Home</Link><Link className="nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] border border-white/[0.12] px-5 text-sm text-white" href="/demo">Demo</Link></div></section></MarketingPage>;
}
