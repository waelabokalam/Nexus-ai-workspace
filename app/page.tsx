import Hero from "@/components/Hero";
import WorkspacePreview from "@/components/dashboard/WorkspacePreview";
import Footer from "@/components/Footer";
import OperatingPrinciples from "@/components/OperatingPrinciples";
import SiteHeader from "@/components/SiteHeader";


export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#09090b] text-white">
      <a className="nexus-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <div id="main-content">
      <Hero />
      <OperatingPrinciples />
      <WorkspacePreview />
      </div>
      <Footer />
    </main>
  );
}
