export interface ContactOption {
  title: string;
  description: string;
}

export interface ContactCopy {
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  options: ContactOption[];
  directLabel: string;
  emailHint: string;
  sendEmail: string;
  copyEmail: string;
  copied: string;
  prodTitle: string;
  prodCopy: string;
  devTitle: string;
  devCopy: string;
  agentCta: string;
  agentHref: string;
  featuresCta: string;
  featuresHref: string;
}

export const contactEn: ContactCopy = {
  metadataTitle: "Contact",
  metadataDescription: "Tell TQEN how your business works and discuss the right operational system, pilot or product scope.",
  eyebrow: "Talk to TQEN",
  title: "Tell us how your business works.",
  intro:
    "Describe the work that repeats, the tools involved and the decisions your team still needs to make. We can identify what may be worth automating, connecting or rebuilding.",
  options: [
    {
      title: "Restaurant pilot",
      description: "Run the current operational product with a real restaurant for 30 days.",
    },
    {
      title: "Custom system",
      description: "Scope an application, platform, agent, automation or connected workflow.",
    },
    {
      title: "Retail direction",
      description: "Discuss operational intelligence or loss-prevention needs while the vertical is in development.",
    },
  ],
  directLabel: "Direct contact",
  emailHint:
    "Include your industry, current process, the main bottleneck and the result you want. A useful first reply can then focus on scope rather than a generic sales call.",
  sendEmail: "Send email",
  copyEmail: "Copy email",
  copied: "Email copied",
  prodTitle: "Contact route",
  prodCopy: "Direct email is being configured. You can still explore the live product experiences or review the current system capabilities.",
  devTitle: "Development configuration",
  devCopy: "Set NEXT_PUBLIC_CONTACT_EMAIL to enable the public email actions. No contact address is displayed until a real address is configured.",
  agentCta: "Talk to the TQEN Agent",
  agentHref: "/demo/support",
  featuresCta: "Explore what we build",
  featuresHref: "/features",
};

export const contactAr: ContactCopy = {
  metadataTitle: "تواصل معنا",
  metadataDescription: "أخبر TQEN كيف يعمل عملك وناقش النظام التشغيلي أو التجربة أو نطاق المنتج المناسب.",
  eyebrow: "تواصل مع TQEN",
  title: "أخبرنا كيف يعمل عملك.",
  intro: "صف العمل المتكرر والأدوات المستخدمة والقرارات التي ما زال فريقك يحتاج اتخاذها. سنحدد ما يستحق الأتمتة أو الربط أو إعادة البناء.",
  options: [
    {
      title: "تجربة المطاعم",
      description: "شغّل المنتج التشغيلي الحالي مع مطعم حقيقي لمدة 30 يوماً.",
    },
    {
      title: "نظام مخصص",
      description: "حدد نطاق تطبيق أو منصة أو وكيل أو أتمتة أو سير عمل متصل.",
    },
    {
      title: "توجه التجزئة",
      description: "ناقش احتياجات الذكاء التشغيلي أو منع الفاقد بينما القطاع قيد التطوير.",
    },
  ],
  directLabel: "تواصل مباشر",
  emailHint: "اذكر قطاعك وعمليتك الحالية والاختناق الرئيسي والنتيجة التي تريدها. ليتركز الرد الأول المفيد على النطاق بدل مكالمة مبيعات عامة.",
  sendEmail: "أرسل بريداً",
  copyEmail: "انسخ البريد",
  copied: "تم نسخ البريد",
  prodTitle: "قناة التواصل",
  prodCopy: "البريد المباشر قيد الإعداد. يمكنك استكشاف التجارب الحية أو مراجعة القدرات الحالية.",
  devTitle: "إعداد التطوير",
  devCopy: "اضبط NEXT_PUBLIC_CONTACT_EMAIL لتفعيل إجراءات البريد العامة. لن يظهر أي عنوان حتى يتم ضبط عنوان حقيقي.",
  agentCta: "تحدث إلى TQEN Agent",
  agentHref: "/demo/support",
  featuresCta: "استكشف ما نبنيه",
  featuresHref: "/features",
};
