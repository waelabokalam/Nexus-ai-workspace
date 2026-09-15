import type { Demo } from "@/data/demos";
import type { WorkspaceConfig } from "@/components/support/SupportWorkspace";
import { workspaceAr } from "@/lib/i18n/workspace";
import {
  pgparaSecondaryPrompts,
  pgparaStarterPrompts,
} from "@/data/pgpara-demo";
import {
  restaurantSecondaryPrompts,
  restaurantStarterPrompts,
} from "@/data/restaurant-demo";

/* Demo hub + hero copy */

export interface DemoHeroCopy {
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  metadata: string[];
}

export interface DemoHubCopy {
  skipLink: string;
  homeLabel: string;
  poweredBy: string;
  backHome: string;
  hero: DemoHeroCopy;
  bottomEyebrow: string;
  bottomTitle: string;
  bottomDescription: string;
  gridLabel: string;
  metaTitle: string;
  metaDescription: string;
}

export const demoHubEn: DemoHubCopy = {
  skipLink: "Skip to content",
  homeLabel: "TQEN home",
  poweredBy: "Powered by",
  backHome: "Back to Home",
  hero: {
    eyebrow: "Product experiences",
    title: "See the systems at work.",
    description: "These public workspaces demonstrate real TQEN capabilities and one clearly labeled concept integration. No scripted conversations or invented results.",
    note: "The TQEN Agent and Restaurant Guest Assistant use live request paths. PGPara is an independent concept prototype with no implied endorsement.",
    metadata: [
      "Real request paths",
      "Business knowledge",
      "Conversation memory",
      "Visible workflow events",
    ],
  },
  bottomEyebrow: "Current public experiences",
  bottomTitle: "Real request paths. Honest boundaries. No scripted outcomes.",
  bottomDescription: "Use the live workspaces to test knowledge, memory, multilingual communication and configured actions. Availability is stated on every experience.",
  gridLabel: "Available TQEN demos",
  metaTitle: "Product Demos",
  metaDescription: "Experience live TQEN agent and restaurant workflows, plus a clearly labeled independent concept prototype.",
};

export const demoHubAr: DemoHubCopy = {
  skipLink: "تخطَّ إلى المحتوى",
  homeLabel: "TQEN الرئيسية",
  poweredBy: "يعمل بواسطة",
  backHome: "العودة للرئيسية",
  hero: {
    eyebrow: "تجارب المنتجات",
    title: "شاهد الأنظمة أثناء العمل.",
    description: "توضح مساحات العمل العامة هذه قدرات TQEN الحقيقية وتكاملًا مفاهيميًا واحدًا مُعلنًا بوضوح. دون محادثات مُعدّة مسبقًا أو نتائج مخترعة.",
    note: "يستخدم TQEN Agent ومساعد ضيوف المطعم مسارات طلب حيّة. PGPara نموذج مفاهيمي مستقل دون أي تأييد ضمني.",
    metadata: [
      "مسارات طلب حقيقية",
      "معرفة الأعمال",
      "ذاكرة المحادثة",
      "أحداث سير عمل مرئية",
    ],
  },
  bottomEyebrow: "التجارب العامة الحالية",
  bottomTitle: "مسارات طلب حقيقية. حدود واضحة. دون نتائج مُعدّة مسبقًا.",
  bottomDescription: "استخدم مساحات العمل الحيّة لاختبار المعرفة والذاكرة والتواصل متعدد اللغات والإجراءات المُعدّة. حالة التوفر مذكورة في كل تجربة.",
  gridLabel: "تجارب TQEN المتاحة",
  metaTitle: "تجارب المنتجات",
  metaDescription: "جرّب تدفقات عمل TQEN Agent والمطعم الحيّة، إضافة إلى نموذج مفاهيمي مستقل مُعلن بوضوح.",
};

/* Demo cards */

export interface DemoCardCopy {
  live: string;
  prototype: string;
  planned: string;
  comingSoon: string;
  openWorkspace: string;
  plannedConfig: string;
}

export const demoCardEn: DemoCardCopy = {
  live: "Live",
  prototype: "Prototype",
  planned: "Planned",
  comingSoon: "Coming soon",
  openWorkspace: "Open Workspace",
  plannedConfig: "Planned configuration",
};

export const demoCardAr: DemoCardCopy = {
  live: "حي",
  prototype: "نموذج أولي",
  planned: "مخطط له",
  comingSoon: "قريبًا",
  openWorkspace: "افتح مساحة العمل",
  plannedConfig: "إعدادات مخطط لها",
};

export function demoCardCopy(locale: "en" | "ar"): DemoCardCopy {
  return locale === "ar" ? demoCardAr : demoCardEn;
}

/** Arabic demo entries. Titles, hrefs and statuses mirror data/demos.ts; only display copy is translated. */
export const demosAr: Demo[] = [
  {
    id: "customer-support",
    title: "TQEN Agent",
    description: "تحدث مع TQEN Agent الرسمي لمعرفة موثوقة عن الشركة وحوار متعدد اللغات وتأهيل التجارب.",
    capabilities: ["متعدد اللغات", "معرفة موثوقة", "نبرة متكيفة", "تأهيل التجارب"],
    availability: { label: "متاح اليوم", values: ["مساحة عمل الموقع"] },
    href: "/demo/support",
    icon: "customer-support",
    status: "available",
  },
  {
    id: "restaurant",
    title: "Restaurant Guest Assistant",
    description: "جرّب الواجهة المخصصة للضيوف في قطاع المطاعم مع معرفة القائمة وتدفقات الحجوزات.",
    capabilities: ["الحجوزات", "أسئلة القائمة", "معرفة الأعمال"],
    availability: { label: "متاح اليوم", values: ["مساحة عمل الموقع"] },
    href: "/demo/restaurant",
    icon: "restaurant",
    status: "available",
  },
  {
    id: "pgpara",
    title: "PGPara AI Assistant",
    description: "نموذج مفاهيمي مُعلن بوضوح لإرشادات المنتجات متعددة اللغات واستفسارات التجار وردود دعم مالي آمنة.",
    capabilities: ["التركية والعربية والإنجليزية", "استفسارات التجار", "إرشادات المنتجات", "دعم آمن"],
    availability: { label: "حالة التجربة", values: ["نموذج مفاهيمي مستقل"] },
    href: "/demo/pgpara",
    icon: "pgpara",
    status: "prototype",
  },
];

/* Workspace page metadata */

export const supportMetaAr = {
  title: "TQEN Agent",
  description: "جرّب مساحة عمل TQEN Agent الحيّة مع رؤية حقيقية لسير العمل.",
};

export const restaurantMetaAr = {
  title: "تجربة مطعم Saray Sofrasi",
  description: "اسأل عن القائمة بالتركية أو العربية أو الإنجليزية واحجز طاولة حقيقية عبر مساحة عمل مطاعم TQEN.",
};

export const pgparaMetaAr = {
  title: "نموذج PGPara AI Assistant",
  description: "تجربة مفاهيمية للمساعدة متعددة اللغات في منتجات PGPara ودعم العملاء.",
};

/* Arabic workspace configs */

// Mirrors the default English prompts in SupportWorkspace (already multilingual).
const supportArPrompts = [
  "What does TQEN do?",
  "What is TQEN Restaurant?",
  "مرحبا، كيف يمكنكم مساعدتي؟",
  "Merhaba, hangi hizmetleri sunuyorsunuz?",
] as const;

export const supportArWorkspace: WorkspaceConfig = {
  locale: "ar",
  strings: workspaceAr,
  assistantName: "TQEN Agent",
  headerTitle: "TQEN Agent",
  workspaceTitle: "TQEN Agent",
  emptyTitle: "اطرح سؤالًا لبدء جلسة مع TQEN Agent.",
  emptyDescription: "جرّب سؤالًا عن TQEN أو بدّل اللغة أو اسأل عن منصاتنا. كل رسالة تستخدم مسار الطلب الحيّ نفسه.",
  prompts: supportArPrompts,
  composerPlaceholder: "اسأل عن TQEN أو القدرات أو التجربة…",
  composerLabel: "راسل TQEN Agent",
  endpoint: "/api/demo/support",
  sessionNamespace: "support",
  unavailableMessage: "تعذّرت إتمام طلبك في تجربة الدعم. حاول مجددًا.",
  preventActionRetry: true,
};

export const restaurantArCapabilities = [
  {
    title: "متاح في هذه التجربة",
    items: ["أسئلة القائمة", "حجوزات طاولات مباشرة", "خدمة متعددة اللغات"],
  },
  {
    title: "جاهز للتكامل",
    items: ["عروض نقاط البيع", "طلبات التوصيل", "برنامج الولاء"],
  },
] as const;

export const restaurantArIntegrationTools = [
  {
    title: "Google Calendar",
    status: "حي",
    description: "تُنشأ الحجوزات المؤكدة كأحداث تقويم حقيقية.",
  },
  {
    title: "التحويل للموظف",
    status: "حي",
    description: "يمكن للضيوف طلب التواصل مع الموظفين في أي وقت أثناء المحادثة.",
  },
  {
    title: "جمع بيانات التواصل",
    status: "حي",
    description: "تُجمع استفسارات المجموعات الكبيرة والفعاليات لفريق المطعم.",
  },
] as const;

export const restaurantArWorkspace: WorkspaceConfig = {
  locale: "ar",
  strings: workspaceAr,
  brandName: "Saray Sofrasi",
  assistantName: "Saray Assistant",
  headerTitle: "Saray Sofrasi",
  headerSubtext: "خدمة ضيوف وحجوزات مدعومة بالذكاء الاصطناعي",
  workspaceTitle: "Saray Sofrasi — تجربة المطعم",
  emptyTitle: "اسأل عن القائمة أو احجز طاولة لبدء جلسة مباشرة مع TQEN Engine.",
  emptyDescription: "اسأل بالتركية أو العربية أو الإنجليزية. الحجوزات المؤكدة تُنشأ كأحداث تقويم حقيقية.",
  prompts: restaurantStarterPrompts,
  secondaryPrompts: restaurantSecondaryPrompts,
  capabilityGroups: restaurantArCapabilities,
  integrationTools: restaurantArIntegrationTools,
  composerPlaceholder: "اسأل عن القائمة أو الدوام أو احجز طاولة…",
  composerLabel: "راسل Saray Sofrasi",
  endpoint: "/api/demo/restaurant",
  sessionNamespace: "restaurant",
  unavailableMessage: "تعذّرت إتمام طلبك في تجربة المطعم. حاول مجددًا.",
};

export const pgparaArCapabilities = [
  {
    title: "متاح في هذا النموذج الأولي",
    items: ["إرشادات المنتجات", "مساعدة متعددة اللغات", "استفسارات التجار", "إرشادات دعم آمنة"],
  },
  {
    title: "جاهز للتكامل",
    items: ["حالة التحويل", "البحث عن ممثل", "مساعدة الحسابات الموثقة"],
  },
] as const;

export const pgparaArIntegrationTools = [
  {
    title: "حاسبة التحويل",
    status: "جاهز للتكامل",
    description: "يتصل بخدمة الحساب المعتمدة لدى PGPara لتقديرات تحويل موثقة.",
  },
  {
    title: "حالة التحويل",
    status: "جاهز للتكامل",
    description: "يمكنه الاتصال بخدمة حالة المعاملات المعتمدة لدى PGPara لنتائج موثقة.",
  },
  {
    title: "البحث عن ممثل",
    status: "جاهز للتكامل",
    description: "يمكنه الاتصال ببيانات ممثلي PGPara ومواقعهم المعتمدة.",
  },
] as const;

export const pgparaArWorkspace: WorkspaceConfig = {
  theme: "pgpara",
  locale: "ar",
  strings: workspaceAr,
  brandName: "PGPara",
  assistantName: "PGPara AI Assistant",
  headerTitle: "PGPara AI Assistant",
  headerSubtext: "مساعدة المنتجات والعملاء بالذكاء الاصطناعي",
  prototypeLabel: "نموذج PGPara الأولي · تجربة مفاهيمية",
  workspaceTitle: "PGPara AI Assistant",
  emptyTitle: "استكشف منتجات PGPara ودعم التجار عبر تدفق مساعدة ذكي حقيقي.",
  emptyDescription: "اسأل بالتركية أو العربية أو الإنجليزية. تقدم هذه التجربة المفاهيمية إرشادات المنتجات وردود دعم آمنة، ولا تصل إلى بيانات الحسابات أو المعاملات.",
  prompts: pgparaStarterPrompts,
  secondaryPrompts: pgparaSecondaryPrompts,
  capabilityGroups: pgparaArCapabilities,
  integrationTools: pgparaArIntegrationTools,
  composerPlaceholder: "اسأل عن منتجات PGPara أو التحويلات أو خدمات التجار…",
  composerLabel: "راسل PGPara AI Assistant",
  endpoint: "/api/demo/pgpara",
  sessionNamespace: "pgpara",
  unavailableMessage: "تعذّر على نموذج PGPara الأولي إتمام طلبك. حاول مجددًا.",
};
