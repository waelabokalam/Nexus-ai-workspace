import type { Locale } from "@/lib/i18n/routing";

export interface HeaderIndustry {
  path: string;
  label: string;
  meta: string;
}

export interface HeaderSolution {
  path: string;
  label: string;
}

export interface HeaderCopy {
  homeLabel: string;
  primaryNavLabel: string;
  mobileNavLabel: string;
  industriesLabel: string;
  industries: HeaderIndustry[];
  solutionsLabel: string;
  solutions: HeaderSolution[];
  workLabel: string;
  workPath: string;
  aboutLabel: string;
  aboutPath: string;
  contactPath: string;
  talkToUs: string;
  menuLabel: string;
  closeLabel: string;
  companyLabel: string;
}

export interface FooterGroup {
  title: string;
  links: { path: string; label: string }[];
}

export interface FooterCopy {
  homeLabel: string;
  tagline: string;
  contactCta: string;
  contactPath: string;
  groups: FooterGroup[];
  rights: string;
  motto: string;
}

export interface SiteCopy {
  locale: Locale;
  skipLink: string;
  switcherLabel: string;
  switcherTarget: string;
  header: HeaderCopy;
  footer: FooterCopy;
}

const solutionsEn: HeaderSolution[] = [
  { path: "/features#ai-automation", label: "AI and automation" },
  { path: "/features#business-systems", label: "Apps and platforms" },
  { path: "/features#websites", label: "Websites" },
  { path: "/features#integrations", label: "Integrations" },
  { path: "/features#computer-vision", label: "Computer vision" },
  { path: "/features#custom-systems", label: "Custom systems" },
];

export const siteEn: SiteCopy = {
  locale: "en",
  skipLink: "Skip to content",
  switcherLabel: "Switch to Arabic",
  switcherTarget: "AR",
  header: {
    homeLabel: "TQEN home",
    primaryNavLabel: "Primary navigation",
    mobileNavLabel: "Mobile navigation",
    industriesLabel: "Industries",
    industries: [
      { path: "/restaurants", label: "TQEN Restaurant", meta: "Pilot ready" },
      { path: "/#industries", label: "TQEN Retail", meta: "In development" },
      { path: "/#industries", label: "TQEN Vision", meta: "Planned" },
    ],
    solutionsLabel: "Solutions",
    solutions: solutionsEn,
    workLabel: "Work",
    workPath: "/#work",
    aboutLabel: "About",
    aboutPath: "/about",
    contactPath: "/contact",
    talkToUs: "Talk to us",
    menuLabel: "Menu",
    closeLabel: "Close",
    companyLabel: "Company",
  },
  footer: {
    homeLabel: "TQEN home",
    tagline: "Intelligent systems for real business operations.",
    contactCta: "Tell us how your business works",
    contactPath: "/contact",
    groups: [
      {
        title: "Products",
        links: [
          { path: "/restaurants", label: "TQEN Restaurant" },
          { path: "/#industries", label: "TQEN Retail" },
          { path: "/#industries", label: "TQEN Vision" },
        ],
      },
      {
        title: "Explore",
        links: [
          { path: "/#solutions", label: "Solutions" },
          { path: "/#work", label: "Work" },
          { path: "/demo", label: "Demos" },
          { path: "/docs", label: "Agent docs" },
        ],
      },
      {
        title: "Company",
        links: [
          { path: "/about", label: "About" },
          { path: "/contact", label: "Contact" },
          { path: "/privacy", label: "Privacy" },
          { path: "/terms", label: "Terms" },
        ],
      },
    ],
    rights: "All rights reserved.",
    motto: "Software first. AI where it improves the work.",
  },
};

export const siteAr: SiteCopy = {
  locale: "ar",
  skipLink: "تخطَّ إلى المحتوى",
  switcherLabel: "التبديل إلى الإنجليزية",
  switcherTarget: "EN",
  header: {
    homeLabel: "TQEN الرئيسية",
    primaryNavLabel: "التنقل الرئيسي",
    mobileNavLabel: "تنقل الجوال",
    industriesLabel: "القطاعات",
    industries: [
      { path: "/restaurants", label: "TQEN Restaurant", meta: "جاهز للتجربة" },
      { path: "/#industries", label: "TQEN Retail", meta: "قيد التطوير" },
      { path: "/#industries", label: "TQEN Vision", meta: "مخطط له" },
    ],
    solutionsLabel: "الحلول",
    solutions: [
      { path: "/features#ai-automation", label: "الذكاء الاصطناعي والأتمتة" },
      { path: "/features#business-systems", label: "التطبيقات والمنصات" },
      { path: "/features#websites", label: "المواقع الإلكترونية" },
      { path: "/features#integrations", label: "التكاملات" },
      { path: "/features#computer-vision", label: "الرؤية الحاسوبية" },
      { path: "/features#custom-systems", label: "أنظمة مخصصة" },
    ],
    workLabel: "الأعمال",
    workPath: "/#work",
    aboutLabel: "من نحن",
    aboutPath: "/about",
    contactPath: "/contact",
    talkToUs: "تواصل معنا",
    menuLabel: "القائمة",
    closeLabel: "إغلاق",
    companyLabel: "الشركة",
  },
  footer: {
    homeLabel: "TQEN الرئيسية",
    tagline: "أنظمة ذكية للأعمال الحقيقية.",
    contactCta: "أخبرنا كيف يعمل عملك",
    contactPath: "/contact",
    groups: [
      {
        title: "المنتجات",
        links: [
          { path: "/restaurants", label: "TQEN Restaurant" },
          { path: "/#industries", label: "TQEN Retail" },
          { path: "/#industries", label: "TQEN Vision" },
        ],
      },
      {
        title: "استكشف",
        links: [
          { path: "/#solutions", label: "الحلول" },
          { path: "/#work", label: "الأعمال" },
          { path: "/demo", label: "تجارب حيّة" },
          { path: "/docs", label: "توثيق TQEN Agent" },
        ],
      },
      {
        title: "الشركة",
        links: [
          { path: "/about", label: "من نحن" },
          { path: "/contact", label: "تواصل معنا" },
          { path: "/privacy", label: "الخصوصية" },
          { path: "/terms", label: "الشروط" },
        ],
      },
    ],
    rights: "جميع الحقوق محفوظة.",
    motto: "البرمجيات أولاً. والذكاء الاصطناعي حيث يحسّن العمل.",
  },
};

export function siteCopy(locale: Locale): SiteCopy {
  return locale === "ar" ? siteAr : siteEn;
}
