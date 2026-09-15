export interface PricingHeaderCopy {
  eyebrow: string;
  title: string;
  copy: string;
}

export interface EngagementCopy {
  label: string;
  title: string;
  timing: string;
  description: string;
  includes: string[];
  href: string;
  cta: string;
}

export interface PricingScopeCopy {
  title: string;
  paragraphs: string[];
}

export interface PricingCopy {
  header: PricingHeaderCopy;
  engagements: EngagementCopy[];
  scope: PricingScopeCopy;
  metaTitle: string;
  metaDescription: string;
}

export const pricingEn: PricingCopy = {
  header: {
    eyebrow: "Ways to work with TQEN",
    title: "Scope first. Price the real work.",
    copy: "TQEN does not force different businesses into a fixed software package. We define the workflow, integrations and level of operational responsibility before proposing a commercial scope.",
  },
  engagements: [
    {
      label: "Flagship industry system",
      title: "Restaurant pilot",
      timing: "30-day operating pilot",
      description:
        "Run the current TQEN Restaurant system with a real restaurant operation and evaluate what it surfaces for managers.",
      includes: [
        "Command Center setup",
        "Branch and role configuration",
        "Daily Brief and work queues",
        "Reputation and supplier workflows",
        "Pilot review",
      ],
      href: "/restaurants#restaurant-pilot",
      cta: "Explore the pilot",
    },
    {
      label: "Purpose-built technology",
      title: "Custom system",
      timing: "Scoped after discovery",
      description:
        "For an operational problem that needs dedicated software, automation, an agent, an application or a connected workflow.",
      includes: [
        "Workflow discovery",
        "System and interaction design",
        "Build plan and delivery scope",
        "Integration assessment",
        "Launch and handover plan",
      ],
      href: "/contact?intent=custom-system",
      cta: "Discuss your operation",
    },
  ],
  scope: {
    title: "What shapes the scope",
    paragraphs: [
      "Locations, users, data sources, workflows, integration access, deployment constraints and ongoing support all affect delivery.",
      "Any estimate is a proposal for a defined scope, not a generic monthly price or a promise that every external system can be connected.",
    ],
  },
  metaTitle: "Engagements",
  metaDescription:
    "Explore how TQEN scopes restaurant pilots and custom operational systems around real business workflows.",
};

export const pricingAr: PricingCopy = {
  header: {
    eyebrow: "طرق العمل مع TQEN",
    title: "النطاق أولاً. والسعر للعمل الحقيقي.",
    copy: "لا تضع TQEN الأعمال المختلفة في حزمة برمجية ثابتة. نحدّد سير العمل والتكاملات ومستوى المسؤولية التشغيلية قبل اقتراح أي نطاق تجاري.",
  },
  engagements: [
    {
      label: "نظام قطاعي رئيسي",
      title: "تجربة المطاعم",
      timing: "تجربة تشغيلية لمدة 30 يوماً",
      description:
        "شغّل نظام TQEN Restaurant الحالي مع عملية مطعم حقيقية، وقيّم ما يُظهره للمديرين.",
      includes: [
        "إعداد مركز القيادة",
        "تهيئة الفروع والأدوار",
        "الموجز اليومي وقوائم العمل",
        "سير عمل السمعة والموردين",
        "مراجعة التجربة",
      ],
      href: "/restaurants#restaurant-pilot",
      cta: "استكشف التجربة",
    },
    {
      label: "تقنية مبنية لغرض محدد",
      title: "نظام مخصص",
      timing: "يُحدَّد النطاق بعد الاستكشاف",
      description:
        "لمشكلة تشغيلية تحتاج برمجيات مخصصة أو أتمتة أو وكيلاً أو تطبيقاً أو سير عمل متصلاً.",
      includes: [
        "استكشاف سير العمل",
        "تصميم النظام والتفاعل",
        "خطة البناء ونطاق التسليم",
        "تقييم التكاملات",
        "خطة الإطلاق والتسليم",
      ],
      href: "/contact?intent=custom-system",
      cta: "ناقش عملياتك",
    },
  ],
  scope: {
    title: "ما الذي يحدّد النطاق",
    paragraphs: [
      "تؤثر الفروع والمستخدمون ومصادر البيانات وسير العمل والوصول إلى التكاملات وقيود النشر والدعم المستمر كلها على التسليم.",
      "أي تقدير هو مقترح لنطاق محدّد، وليس سعراً شهرياً عاماً ولا وعداً بربط كل نظام خارجي.",
    ],
  },
  metaTitle: "أشكال التعاون",
  metaDescription:
    "استكشف كيف تحدّد TQEN نطاق تجارب المطاعم والأنظمة التشغيلية المخصصة حول سير العمل الحقيقي.",
};
