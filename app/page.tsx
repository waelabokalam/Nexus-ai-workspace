import CompanyFooter from "@/components/marketing/CompanyFooter";
import CompanyHeader from "@/components/marketing/CompanyHeader";
import CompanyHero from "@/components/marketing/CompanyHero";
import IndustrySystems from "@/components/marketing/IndustrySystems";
import SolutionsOverview from "@/components/marketing/SolutionsOverview";
import HowNexusWorks from "@/components/marketing/HowNexusWorks";
import RestaurantFlagship from "@/components/marketing/RestaurantFlagship";
import WorkProof from "@/components/marketing/WorkProof";
import NexusAgentInvitation from "@/components/marketing/NexusAgentInvitation";
import CompanyFinalCta from "@/components/marketing/CompanyFinalCta";

export default function Home() {
  return (
    <main className="nexus-page min-h-screen overflow-x-hidden text-white">
      <a className="nexus-skip-link" href="#main-content">Skip to content</a>
      <CompanyHeader />
      <div id="main-content">
        <CompanyHero />
        <IndustrySystems />
        <SolutionsOverview />
        <HowNexusWorks />
        <RestaurantFlagship />
        <WorkProof />
        <NexusAgentInvitation />
        <CompanyFinalCta />
      </div>
      <CompanyFooter />
    </main>
  );
}
