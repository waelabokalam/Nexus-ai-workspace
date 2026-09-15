export interface CraveItHeroCopy {
  eyebrow: string;
  badge: string;
  subtitle: string;
  copy: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface CraveItProblemCopy {
  eyebrow: string;
  title: string;
  customerTitle: string;
  customerCopy: string;
  businessTitle: string;
  businessCopy: string;
  pullQuote: string;
}

export interface CraveItBuiltItem {
  title: string;
  description: string;
}

export interface CraveItBuiltCopy {
  eyebrow: string;
  title: string;
  items: CraveItBuiltItem[];
}

export interface CraveItProofCopy {
  eyebrow: string;
  title: string;
  copy: string;
}

export interface CraveItFinalCopy {
  title: string;
  copy: string;
  cta: string;
}

export interface CraveItMapCopy {
  subtitle: string;
  badge: string;
  customerTitle: string;
  customerFlow: string[];
  operationTitle: string;
  operationFlow: string[];
  note: string;
}

export interface CraveItCopy {
  hero: CraveItHeroCopy;
  problem: CraveItProblemCopy;
  built: CraveItBuiltCopy;
  proof: CraveItProofCopy;
  final: CraveItFinalCopy;
  map: CraveItMapCopy;
}

export interface CraveItMetaCopy {
  title: string;
  description: string;
}

export const craveItMetaEn: CraveItMetaCopy = {
  title: "Crave It Case Study",
  description: "How TQEN connected a customer-facing food experience with the operational workflow required to run it.",
};

export const craveItMetaAr: CraveItMetaCopy = {
  title: "دراسة حالة Crave It",
  description: "كيف ربطت TQEN تجربة طعام موجهة للعملاء بسير العمل التشغيلي اللازم لإدارتها.",
};

export const craveItEn: CraveItCopy = {
  hero: {
    eyebrow: "Case study",
    badge: "Built system",
    subtitle: "A direct-commerce system designed with the operation behind it.",
    copy: "Crave It connects a customer journey for food plans and orders with the administrative, fulfilment and communication work required after submission.",
    primaryCta: "Discuss a custom system",
    secondaryCta: "Explore what we build",
  },
  problem: {
    eyebrow: "The problem",
    title: "A polished website was only half the job.",
    customerTitle: "For the customer",
    customerCopy: "The offering needed to be easy to understand, configure and submit from a phone.",
    businessTitle: "For the business",
    businessCopy: "Every submission needed to arrive with enough context for the team to review, manage and continue the work.",
    pullQuote: "The product had to connect intent on the front end with operational clarity on the back end.",
  },
  built: {
    eyebrow: "What TQEN built",
    title: "One system across both sides of the experience.",
    items: [
      {
        title: "Customer experience",
        description: "A mobile-aware path for understanding the offering and choosing the right next step.",
      },
      {
        title: "Plan and order flow",
        description: "Structured capture of the information required to move a customer request forward.",
      },
      {
        title: "Customer context",
        description: "Account and request information carried into the operational side of the system.",
      },
      {
        title: "Admin operations",
        description: "A dedicated environment for receiving, reviewing and managing business activity.",
      },
      {
        title: "Workflow continuity",
        description: "A connected path from the public experience into fulfilment and communication.",
      },
    ],
  },
  proof: {
    eyebrow: "The proof",
    title: "A useful digital channel must include the work after the click.",
    copy: "Crave It demonstrates how TQEN approaches custom systems: understand the customer path, understand fulfilment, then design one product around both. No performance metrics are claimed here; the proof is the connected system itself.",
  },
  final: {
    title: "What should your system connect?",
    copy: "Tell us where customer intent, internal work and existing tools stop lining up.",
    cta: "Talk to TQEN",
  },
  map: {
    subtitle: "Connected product system",
    badge: "Built",
    customerTitle: "Customer journey",
    customerFlow: ["Discover", "Choose", "Submit", "Continue"],
    operationTitle: "Business operation",
    operationFlow: ["Receive", "Review", "Manage", "Fulfil"],
    note: "One data and workflow layer connects the public experience to the work behind it.",
  },
};

export const craveItAr: CraveItCopy = {
  hero: {
    eyebrow: "دراسة حالة",
    badge: "نظام مبني",
    subtitle: "نظام بيع مباشر مصمم مع العملية خلفه.",
    copy: "يربط Crave It رحلة عميل لخطط الطعام والطلبات مع العمل الإداري والتنفيذي والتواصلي المطلوب بعد الإرسال.",
    primaryCta: "ناقش نظاماً مخصصاً",
    secondaryCta: "استكشف ما نبنيه",
  },
  problem: {
    eyebrow: "المشكلة",
    title: "موقع مصقول لم يكن سوى نصف العمل.",
    customerTitle: "للعميل",
    customerCopy: "كان يجب أن يكون العرض سهل الفهم والتهيئة والإرسال من الجوال.",
    businessTitle: "للعمل",
    businessCopy: "كان كل إرسال يحتاج أن يصل بسياق كافٍ ليراجعه الفريق ويديره ويتابع العمل.",
    pullQuote: "كان على المنتج أن يربط النيّة في الواجهة بالوضوح التشغيلي في الخلفية.",
  },
  built: {
    eyebrow: "ما بنته TQEN",
    title: "نظام واحد على طرفي التجربة.",
    items: [
      {
        title: "تجربة العميل",
        description: "مسار ملائم للجوال لفهم العرض واختيار الخطوة التالية الصحيحة.",
      },
      {
        title: "تدفق الخطط والطلبات",
        description: "التقاط منظم للمعلومات اللازمة لدفع طلب العميل إلى الأمام.",
      },
      {
        title: "سياق العميل",
        description: "معلومات الحساب والطلب تُحمل إلى الجانب التشغيلي من النظام.",
      },
      {
        title: "عمليات الإدارة",
        description: "بيئة مخصصة لاستلام النشاط التجاري ومراجعته وإدارته.",
      },
      {
        title: "استمرارية سير العمل",
        description: "مسار متصل من التجربة العامة إلى التنفيذ والتواصل.",
      },
    ],
  },
  proof: {
    eyebrow: "الدليل",
    title: "القناة الرقمية المفيدة يجب أن تشمل العمل بعد النقرة.",
    copy: "يُظهر Crave It كيف تتعامل TQEN مع الأنظمة المخصصة: نفهم مسار العميل ونفهم التنفيذ، ثم نصمم منتجاً واحداً حول الاثنين. لا ندّعي هنا أي مقاييس أداء؛ الدليل هو النظام المتصل نفسه.",
  },
  final: {
    title: "ما الذي يجب أن يربطه نظامك؟",
    copy: "أخبرنا أين تتوقف نيّة العملاء والعمل الداخلي والأدوات الحالية عن التوافق.",
    cta: "تحدث إلى TQEN",
  },
  map: {
    subtitle: "منظومة منتج متصلة",
    badge: "مبني",
    customerTitle: "رحلة العميل",
    customerFlow: ["اكتشاف", "اختيار", "إرسال", "متابعة"],
    operationTitle: "تشغيل العمل",
    operationFlow: ["استلام", "مراجعة", "إدارة", "تنفيذ"],
    note: "طبقة بيانات وسير عمل واحدة تربط التجربة العامة بالعمل خلفها.",
  },
};
