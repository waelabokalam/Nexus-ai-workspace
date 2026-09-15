import type { Metadata } from "next";
import CompanyHeader from "@/components/marketing/CompanyHeader";
import CompanyHero from "@/components/marketing/CompanyHero";
import IndustrySystems from "@/components/marketing/IndustrySystems";
import SolutionsOverview from "@/components/marketing/SolutionsOverview";
import HowNexusWorks from "@/components/marketing/HowNexusWorks";
import RestaurantFlagship from "@/components/marketing/RestaurantFlagship";
import WorkProof from "@/components/marketing/WorkProof";
import NexusAgentInvitation from "@/components/marketing/NexusAgentInvitation";
import CompanyFinalCta from "@/components/marketing/CompanyFinalCta";
import CompanyFooter from "@/components/marketing/CompanyFooter";
import { arPageMetadata } from "@/app/metadata";
import { homeAr } from "@/lib/i18n/home";
import { siteAr } from "@/lib/i18n/site";

export const metadata: Metadata = arPageMetadata(
  "أنظمة ذكية للأعمال الحقيقية",
  "تبني TQEN أنظمة تشغيلية ذكية — برمجيات وذكاء اصطناعي وأتمتة وذكاء بيانات وتكاملات ورؤية حاسوبية — حول طريقة عمل الشركات فعلياً.",
  "/",
);

export default function ArabicHome() {
  return (
    <main className="nexus-page min-h-screen overflow-x-hidden text-white">
      <a className="nexus-skip-link" href="#main-content">{siteAr.skipLink}</a>
      <CompanyHeader locale="ar" t={siteAr.header} />
      <div id="main-content">
        <CompanyHero locale="ar" model={homeAr.operatingModel} t={homeAr.hero} />
        <IndustrySystems locale="ar" t={homeAr.industries} />
        <SolutionsOverview locale="ar" t={homeAr.solutionsOverview} />
        <HowNexusWorks t={homeAr.howItWorks} />
        <RestaurantFlagship locale="ar" preview={homeAr.productPreview} t={homeAr.flagship} />
        <WorkProof locale="ar" t={homeAr.proof} />
        <NexusAgentInvitation locale="ar" t={homeAr.agentInvite} />
        <CompanyFinalCta locale="ar" t={homeAr.finalCta} />
      </div>
      <CompanyFooter locale="ar" t={siteAr.footer} />
    </main>
  );
}
