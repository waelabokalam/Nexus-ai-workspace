import Link from "next/link";
import type { Metadata } from "next";
import MarketingPage from "@/components/MarketingPage";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested TQEN page could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <MarketingPage><section className="mx-auto max-w-3xl px-5 py-28 text-center sm:px-8 sm:py-32"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">404</p><h1 className="nexus-heading mt-5 font-heading text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">This route is not part of TQEN.</h1><p className="nexus-copy mx-auto mt-6 max-w-xl text-lg leading-8">Return to the company overview or explore what TQEN builds.</p><div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><Link className="nexus-button-primary nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/">Home</Link><Link className="nexus-button-secondary nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm" href="/features">What we build</Link></div></section></MarketingPage>;
}
