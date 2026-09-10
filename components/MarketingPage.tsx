import type { ReactNode } from "react";
import CompanyFooter from "@/components/marketing/CompanyFooter";
import CompanyHeader from "@/components/marketing/CompanyHeader";

type MarketingPageProps = {
  children: ReactNode;
};

export default function MarketingPage({ children }: MarketingPageProps) {
  return (
    <main className="nexus-page min-h-screen overflow-x-hidden text-white">
      <a className="nexus-skip-link" href="#main-content">Skip to content</a>
      <CompanyHeader />
      <div className="relative z-10" id="main-content">{children}</div>
      <CompanyFooter />
    </main>
  );
}
