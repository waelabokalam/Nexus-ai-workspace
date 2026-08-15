import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

type MarketingPageProps = {
  children: ReactNode;
};

export default function MarketingPage({ children }: MarketingPageProps) {
  return (
    <main className="nexus-page min-h-screen overflow-x-hidden text-white">
      <a className="nexus-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <div className="relative z-10" id="main-content">{children}</div>
      <Footer />
    </main>
  );
}
