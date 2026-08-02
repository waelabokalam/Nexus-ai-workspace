import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

type MarketingPageProps = {
  children: ReactNode;
};

export default function MarketingPage({ children }: MarketingPageProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#09090b] text-white">
      <a className="nexus-skip-link" href="#main-content">Skip to content</a>
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.045),transparent_70%)]" />
      <SiteHeader />
      <div className="relative z-10" id="main-content">{children}</div>
      <Footer />
    </main>
  );
}
