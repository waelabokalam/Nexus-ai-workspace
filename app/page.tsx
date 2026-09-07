import Hero from "@/components/Hero";
import WorkspacePreview from "@/components/dashboard/WorkspacePreview";
import Footer from "@/components/Footer";
import OperatingPrinciples from "@/components/OperatingPrinciples";
import SiteHeader from "@/components/SiteHeader";
import IndustrySystems from "@/components/IndustrySystems";
import CraveItSpotlight from "@/components/CraveItSpotlight";
import IntelligenceDifferentiator from "@/components/IntelligenceDifferentiator";
import HomeFinalCta from "@/components/HomeFinalCta";


export default function Home() {
  return (
    <main className="nexus-page min-h-screen overflow-x-hidden text-white">
      <a className="nexus-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <div id="main-content">
        <Hero />
        <IndustrySystems />
        <WorkspacePreview />
        <CraveItSpotlight />
        <IntelligenceDifferentiator />
        <OperatingPrinciples />
        <HomeFinalCta />
      </div>
      <Footer />
    </main>
  );
}
