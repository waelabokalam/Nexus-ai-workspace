export interface HeroCopy {
  eyebrow: string;
  titleA: string;
  titleB: string;
  copy: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface OperatingModelCopy {
  title: string;
  subtitle: string;
  signals: string[];
  name: string;
  tagline: string;
  routes: { label: string; detail: string }[];
}

export interface IndustrySecondary {
  title: string;
  status: string;
  description: string;
  action: string;
  href: string;
}

export interface IndustriesCopy {
  eyebrow: string;
  title: string;
  copy: string;
  flagshipStatus: string;
  flagshipTitle: string;
  flagshipCopy: string;
  flagshipPoints: string[];
  flagshipLink: string;
  secondary: IndustrySecondary[];
}

export interface Capability {
  title: string;
  description: string;
}

export interface SolutionsOverviewCopy {
  title: string;
  copy: string;
  capabilities: Capability[];
  note: string;
  link: string;
}

export interface SolutionDetail {
  id: string;
  number: string;
  title: string;
  status: string;
  problem: string;
  approach: string;
  result: string;
  examples: string[];
}

export interface SolutionSystemsCopy {
  frictionLabel: string;
  approachLabel: string;
  outcomeLabel: string;
  solutions: SolutionDetail[];
  closing: string;
  cta: string;
}

export interface HowItWorksCopy {
  eyebrow: string;
  title: string;
  copy: string;
  operationTitle: string;
  inputs: string[];
  systemName: string;
  actions: string[];
  routes: { label: string; detail: string }[];
}

export interface FlagshipCopy {
  status: string;
  title: string;
  copy: string;
  capabilities: string[];
  link: string;
}

export interface ProofShowcase {
  tag: string;
  title: string;
  definition: string;
  builtLabel: string;
  built: string[];
  valueLabel: string;
  value: string[];
  primaryCta: string;
  primaryHref: string;
  external?: boolean;
  secondaryCta?: string;
  secondaryHref?: string;
}

export interface ProofCopy {
  eyebrow: string;
  title: string;
  copy: string;
  flagshipStatus: string;
  flagshipLive: string;
  flagshipTitle: string;
  flagshipCopy: string;
  flagshipPoints: string[];
  flagshipScopeLabel: string;
  flagshipScope: string[];
  flagshipLink: string;
  crave: ProofShowcase;
  velvet: ProofShowcase;
  stripLabel: string;
}

export interface AgentInviteCopy {
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
  capabilitiesTitle: string;
  abilities: string[];
  note: string;
}

export interface FinalCtaCopy {
  title: string;
  copy: string;
  cta: string;
}

export interface ProductPreviewCopy {
  name: string;
  role: string;
  sample: string;
  briefLabel: string;
  briefTitle: string;
  branches: string;
  attentionTitle: string;
  attention: { title: string; detail: string }[];
  routingTitle: string;
  routing: { term: string; detail: string }[];
}

export interface HomeCopy {
  hero: HeroCopy;
  operatingModel: OperatingModelCopy;
  industries: IndustriesCopy;
  solutionsOverview: SolutionsOverviewCopy;
  solutionSystems: SolutionSystemsCopy;
  howItWorks: HowItWorksCopy;
  flagship: FlagshipCopy;
  proof: ProofCopy;
  agentInvite: AgentInviteCopy;
  finalCta: FinalCtaCopy;
  productPreview: ProductPreviewCopy;
}

export const homeEn: HomeCopy = {
  hero: {
    eyebrow: "TQEN · Intelligent systems for real business operations",
    titleA: "Intelligent systems.",
    titleB: "Built around your operation.",
    copy: "TQEN connects software, AI, automation, data intelligence, integrations and computer vision to handle repetitive work and bring the right decisions to your team.",
    primaryCta: "Explore what we build",
    secondaryCta: "Explore TQEN Restaurant",
  },
  operatingModel: {
    title: "Your operation",
    subtitle: "Connected, not replaced",
    signals: ["Customer requests", "Invoices and costs", "Internal workflows", "Operational signals"],
    name: "TQEN",
    tagline: "Understand, connect, act",
    routes: [
      { label: "Automate", detail: "Safe repeatable work" },
      { label: "Ask approval", detail: "Sensitive next steps" },
      { label: "Bring a person", detail: "Important decisions" },
    ],
  },
  industries: {
    eyebrow: "TQEN product architecture",
    title: "Industry depth where operations demand it.",
    copy: "We package repeatable operational intelligence by industry, starting with TQEN Restaurant.",
    flagshipStatus: "Pilot ready",
    flagshipTitle: "TQEN Restaurant",
    flagshipCopy: "Run every location without carrying every location in your head. A manager command center for daily priorities, approvals, reputation, supplier costs and operational history.",
    flagshipPoints: ["Daily brief", "Attention queues", "Supplier intelligence"],
    flagshipLink: "Explore TQEN Restaurant",
    secondary: [
      {
        title: "TQEN Retail",
        status: "In development",
        description: "Operational alerts, loss prevention, pricing, inventory and customer workflows for multi-location retail.",
        action: "Discuss retail operations",
        href: "/contact?industry=retail",
      },
      {
        title: "TQEN Vision",
        status: "Planned",
        description: "Carefully scoped computer vision that turns permitted visual signals into reviewable operational events.",
        action: "Share a vision workflow",
        href: "/contact?industry=vision",
      },
    ],
  },
  solutionsOverview: {
    title: "Systems designed around the operation.",
    copy: "We start with the work, then choose the software, automation and intelligence needed to improve it.",
    capabilities: [
      { title: "AI agents", description: "Conversation systems grounded in business knowledge and real workflows." },
      { title: "Workflow automation", description: "Repeatable work handled with clear approval and escalation boundaries." },
      { title: "Business systems", description: "Operational software built around the way the team already works." },
      { title: "Apps and platforms", description: "Customer portals, internal tools, web apps and mobile products." },
      { title: "Websites", description: "Premium public experiences connected to the operation behind them." },
      { title: "Integrations", description: "Existing tools connected through stable, provider-neutral boundaries." },
      { title: "Computer vision", description: "Operational monitoring designed around review, evidence and human control." },
      { title: "Custom systems", description: "Focused software for workflows that do not fit an off-the-shelf product." },
    ],
    note: "A website or app is one part of the system. The value comes from how it connects to the work behind it.",
    link: "Explore capabilities",
  },
  solutionSystems: {
    frictionLabel: "The friction",
    approachLabel: "How TQEN works",
    outcomeLabel: "The outcome",
    solutions: [
      {
        id: "ai-automation",
        number: "01",
        title: "AI agents and automation",
        status: "Available in scoped workflows",
        problem: "Teams lose time moving information between messages, tools and repetitive decisions.",
        approach: "TQEN maps the real workflow, gives the system the right business context, and defines what it may handle, what needs approval and what stays human.",
        result: "Routine work moves forward without hiding the decisions that still need a person.",
        examples: ["Customer and team agents", "Workflow routing", "Knowledge and memory", "Approvals and handoff"],
      },
      {
        id: "business-systems",
        number: "02",
        title: "Business systems",
        status: "Built to scope",
        problem: "Critical operations often live across spreadsheets, inboxes and disconnected software.",
        approach: "TQEN designs an operational system around the team, its roles and the information required to run the work.",
        result: "People get one clear place to understand activity, resolve exceptions and maintain control.",
        examples: ["Command centers", "Internal tools", "Customer portals", "Multi-location platforms"],
      },
      {
        id: "websites",
        number: "03",
        title: "Apps, platforms and websites",
        status: "Built to scope",
        problem: "A digital experience fails when it looks polished but stops before the operational work begins.",
        approach: "TQEN designs the customer-facing experience and the system behind it as one connected product.",
        result: "The interface becomes a useful part of the operation, not a brochure disconnected from fulfilment.",
        examples: ["Web applications", "Mobile experiences", "Direct-commerce systems", "Premium business websites"],
      },
      {
        id: "integrations",
        number: "04",
        title: "Integrations and connected workflows",
        status: "Dependent on available APIs",
        problem: "Replacing every existing tool is expensive, disruptive and often unnecessary.",
        approach: "Where safe interfaces exist, TQEN connects the systems a business already uses and adds a control layer above them.",
        result: "Information can move with less manual re-entry while the underlying tools remain in place.",
        examples: ["Calendars", "Business data sources", "Notification paths", "Provider-neutral connections"],
      },
      {
        id: "computer-vision",
        number: "05",
        title: "Computer vision",
        status: "Retail direction in development",
        problem: "Some operational signals happen in physical spaces and are missed until after the cost is visible.",
        approach: "TQEN is developing carefully scoped monitoring systems that turn permitted visual signals into reviewable operational events.",
        result: "Teams can investigate relevant events without treating every camera feed as something a person must constantly watch.",
        examples: ["Loss-prevention signals", "Operational monitoring", "Human review", "Privacy-aware system design"],
      },
      {
        id: "custom-systems",
        number: "06",
        title: "Custom operational systems",
        status: "Discovery and scoped delivery",
        problem: "The most important workflow may not fit a standard product category.",
        approach: "TQEN studies how the business actually works, then chooses the smallest useful combination of software, automation and AI.",
        result: "The solution fits the operation instead of forcing the operation into a generic template.",
        examples: ["Custom SaaS", "CRM workflows", "Operations platforms", "Purpose-built automation"],
      },
    ],
    closing: "The right system starts with the operation, not a predetermined technology stack.",
    cta: "Tell us how your business works",
  },
  howItWorks: {
    eyebrow: "How TQEN systems work",
    title: "Connect what exists. Improve what happens next.",
    copy: "TQEN sits above the tools you already use, watches operations, and surfaces the exceptions that deserve attention.",
    operationTitle: "Your existing operation",
    inputs: ["Messages", "Invoices", "Customer systems", "Internal tools", "Operational data"],
    systemName: "TQEN",
    actions: ["Understand", "Connect", "Automate", "Watch", "Prioritize"],
    routes: [
      { label: "AUTO", detail: "Safe, repeatable work" },
      { label: "APPROVAL", detail: "A manager decides" },
      { label: "HUMAN", detail: "The issue needs judgment" },
    ],
  },
  flagship: {
    status: "TQEN Restaurant · Pilot ready",
    title: "Run every location without carrying every location in your head.",
    copy: "The Manager Command Center brings operational exceptions, approvals, reputation signals and supplier costs into one review surface. TQEN watches operations and surfaces what changed, what is abnormal, and what needs a manager, an owner, or no one.",
    capabilities: [
      "Daily Manager Brief",
      "Attention and approval queues",
      "Reputation intelligence",
      "Supplier invoice intelligence",
      "Automatic invoice extraction",
      "Multi-branch roles and activity history",
    ],
    link: "Explore TQEN Restaurant",
  },
  proof: {
    eyebrow: "Selected work",
    title: "Proof, not promises.",
    copy: "Our flagship product, plus brands we built for.",
    flagshipStatus: "Flagship product",
    flagshipLive: "Built product",
    flagshipTitle: "TQEN Restaurant",
    flagshipCopy: "A real multi-branch operational command center for attention, approvals, reputation and supplier intelligence.",
    flagshipPoints: ["Daily brief", "Attention queues", "Supplier intelligence"],
    flagshipScopeLabel: "Live in pilot",
    flagshipScope: ["Manager Command Center", "Daily Manager Brief", "Reputation intelligence", "Supplier cost intelligence"],
    flagshipLink: "View the product",
    crave: {
      tag: "Selected work",
      title: "Crave It",
      definition: "End-to-end digital ordering and subscription system.",
      builtLabel: "What we built",
      built: ["Customer ordering experience", "Subscription & meal-plan flow", "Admin and fulfilment workflow", "One connected customer-to-operations system"],
      valueLabel: "Business value",
      value: ["Orders, subscriptions and admin move in one flow — less manual coordination", "The owner sees incoming requests clearly instead of chasing messages", "Repetitive order handling drops as volume grows"],
      primaryCta: "Visit Crave It",
      primaryHref: "https://craveitsyria.com/en",
      external: true,
      secondaryCta: "Read the case study",
      secondaryHref: "/case-studies/crave-it",
    },
    velvet: {
      tag: "Selected work",
      title: "Velvet",
      definition: "Brand, website and ordering experience.",
      builtLabel: "What we built",
      built: ["Brand identity & digital brand treatment", "Customer-facing website", "Product presentation", "Ordering experience"],
      valueLabel: "Business value",
      value: ["A professional digital presence that carries the brand", "A clearer path from discovery to order, with less friction", "Fewer repetitive product questions — one place to send customers"],
      primaryCta: "Visit Velvet",
      primaryHref: "https://velvets.fit/",
      external: true,
    },
    stripLabel: "Built for",
  },
  agentInvite: {
    eyebrow: "Talk to our AI about your business",
    title: "If you ask whether we build agents, you are already speaking to ours.",
    copy: "Describe your operation, ask what TQEN can support, or explore the live communication workflow.",
    cta: "Talk to TQEN",
    capabilitiesTitle: "Current live capabilities",
    abilities: ["Explain TQEN", "Use business knowledge", "Speak three languages", "Capture pilot inquiries"],
    note: "The public agent uses the existing TQEN Engine. Responses and workflow events are streamed through the server-side proxy.",
  },
  finalCta: {
    title: "Tell us how your business works.",
    copy: "We will identify a focused place to automate, connect or improve.",
    cta: "Talk to TQEN",
  },
  productPreview: {
    name: "TQEN Restaurant",
    role: "Manager Command Center",
    sample: "Sample workspace",
    briefLabel: "Daily Manager Brief",
    briefTitle: "Start with what needs attention.",
    branches: "All branches",
    attentionTitle: "Needs attention",
    attention: [
      { title: "Supplier invoice needs review", detail: "A material price change is waiting for a manager." },
      { title: "Service issue is recurring", detail: "Reputation signals show the same theme across recent feedback." },
    ],
    routingTitle: "Decision routing",
    routing: [
      { term: "AUTO", detail: "Safe work completed" },
      { term: "APPROVAL", detail: "Manager review required" },
      { term: "HUMAN", detail: "Escalated for judgment" },
    ],
  },
};

export const homeAr: HomeCopy = {
  hero: {
    eyebrow: "TQEN · أنظمة ذكية للأعمال الحقيقية",
    titleA: "أنظمة ذكية.",
    titleB: "مصممة حول طريقة عملك.",
    copy: "تربط TQEN بين البرمجيات والذكاء الاصطناعي والأتمتة وذكاء البيانات والتكاملات والرؤية الحاسوبية، لتتولى العمل المتكرر وتضع القرارات المهمة أمام فريقك.",
    primaryCta: "استكشف ما نبنيه",
    secondaryCta: "استكشف TQEN Restaurant",
  },
  operatingModel: {
    title: "عملك",
    subtitle: "متصل، لا مستبدَل",
    signals: ["طلبات العملاء", "الفواتير والتكاليف", "سير العمل الداخلي", "إشارات تشغيلية"],
    name: "TQEN",
    tagline: "نفهم ونربط وننفّذ",
    routes: [
      { label: "أتمتة", detail: "عمل آمن ومتكرر" },
      { label: "اطلب الموافقة", detail: "للخطوات الحساسة" },
      { label: "أشرك الإنسان", detail: "للقرارات المهمة" },
    ],
  },
  industries: {
    eyebrow: "بنية منتجات TQEN",
    title: "عمق قطاعي حيث تتطلب العمليات ذلك.",
    copy: "نحوّل الذكاء التشغيلي المتكرر إلى منتجات قطاعية، بدءاً من TQEN Restaurant.",
    flagshipStatus: "جاهز للتجربة",
    flagshipTitle: "TQEN Restaurant",
    flagshipCopy: "أدر كل فرع دون أن تحمل كل فرع في رأسك. مركز قيادة للمدير: الأولويات اليومية والموافقات والسمعة وتكاليف الموردين وسجل العمليات.",
    flagshipPoints: ["الموجز اليومي", "قوائم الانتباه", "ذكاء الموردين"],
    flagshipLink: "استكشف TQEN Restaurant",
    secondary: [
      {
        title: "TQEN Retail",
        status: "قيد التطوير",
        description: "تنبيهات تشغيلية ومنع الفاقد والتسعير والمخزون وسير عمل العملاء لتجارة التجزئة متعددة الفروع.",
        action: "ناقش عمليات التجزئة",
        href: "/contact?industry=retail",
      },
      {
        title: "TQEN Vision",
        status: "مخطط له",
        description: "رؤية حاسوبية مضبوطة بعناية تحوّل الإشارات المرئية المسموحة إلى أحداث تشغيلية قابلة للمراجعة.",
        action: "اقترح حالة استخدام",
        href: "/contact?industry=vision",
      },
    ],
  },
  solutionsOverview: {
    title: "أنظمة مصممة حول العمليات.",
    copy: "نبدأ من العمل نفسه، ثم نختار البرمجيات والأتمتة والذكاء اللازم لتحسينه.",
    capabilities: [
      { title: "وكلاء الذكاء الاصطناعي", description: "أنظمة محادثة مبنية على معرفة العمل وسير العمل الحقيقية." },
      { title: "أتمتة سير العمل", description: "عمل متكرر يُنجز ضمن حدود واضحة للموافقة والتصعيد." },
      { title: "أنظمة الأعمال", description: "برمجيات تشغيلية مبنية حول طريقة عمل الفريق الحالية." },
      { title: "التطبيقات والمنصات", description: "بوابات عملاء وأدوات داخلية وتطبيقات ويب وجوال." },
      { title: "المواقع الإلكترونية", description: "تجارب عامة راقية متصلة بالعمليات خلفها." },
      { title: "التكاملات", description: "ربط الأدوات الحالية عبر حدود مستقرة ومحايدة." },
      { title: "الرؤية الحاسوبية", description: "مراقبة تشغيلية مصممة حول المراجعة والدليل والتحكم البشري." },
      { title: "أنظمة مخصصة", description: "برمجيات مركّزة لسير عمل لا يناسبه أي منتج جاهز." },
    ],
    note: "الموقع أو التطبيق جزء واحد من المنظومة. القيمة تأتي من ارتباطه بالعمل خلفه.",
    link: "استكشف القدرات",
  },
  solutionSystems: {
    frictionLabel: "المشكلة",
    approachLabel: "كيف تعمل TQEN",
    outcomeLabel: "النتيجة",
    solutions: [
      {
        id: "ai-automation",
        number: "01",
        title: "وكلاء الذكاء الاصطناعي والأتمتة",
        status: "متاح ضمن سير عمل محدد",
        problem: "تضيع وقت الفرق في نقل المعلومات بين الرسائل والأدوات والقرارات المتكررة.",
        approach: "ترسم TQEN سير العمل الحقيقي، وتزوّد النظام بسياق العمل الصحيح، وتحدد ما يجوز له إنجازه وما يحتاج موافقة وما يبقى بشرياً.",
        result: "يتقدم العمل الروتيني دون إخفاء القرارات التي ما زالت تحتاج إنساناً.",
        examples: ["وكلاء العملاء والفرق", "توجيه سير العمل", "المعرفة والذاكرة", "الموافقات والتسليم"],
      },
      {
        id: "business-systems",
        number: "02",
        title: "أنظمة الأعمال",
        status: "يُبنى حسب النطاق",
        problem: "تعيش العمليات الحرجة غالباً بين جداول البيانات والبريد وأنظمة منفصلة.",
        approach: "تصمم TQEN نظاماً تشغيلياً حول الفريق وأدواره والمعلومات اللازمة لإنجاز العمل.",
        result: "يحصل الناس على مكان واحد واضح لفهم النشاط وحل الاستثناءات والحفاظ على التحكم.",
        examples: ["مراكز القيادة", "الأدوات الداخلية", "بوابات العملاء", "منصات متعددة الفروع"],
      },
      {
        id: "websites",
        number: "03",
        title: "التطبيقات والمنصات والمواقع",
        status: "يُبنى حسب النطاق",
        problem: "التجربة الرقمية تفشل عندما تبدو مصقولة لكنها تتوقف قبل بدء العمل التشغيلي.",
        approach: "تصمم TQEN تجربة العميل والنظام خلفها كمنتج واحد متصل.",
        result: "تصبح الواجهة جزءاً مفيداً من العملية، لا مجرد واجهة منفصلة عن التنفيذ.",
        examples: ["تطبيقات الويب", "تجارب الجوال", "أنظمة البيع المباشر", "مواقع أعمال راقية"],
      },
      {
        id: "integrations",
        number: "04",
        title: "التكاملات وسير العمل المتصل",
        status: "يعتمد على الواجهات المتاحة",
        problem: "استبدال كل أداة حالية مكلف ومربك وغالباً غير ضروري.",
        approach: "حيث توجد واجهات آمنة، تربط TQEN الأنظمة التي يستخدمها العمل أصلاً وتضيف طبقة تحكم فوقها.",
        result: "تتحرك المعلومات دون إعادة إدخال يدوية، وتبقى الأدوات الأساسية في مكانها.",
        examples: ["التقويمات", "مصادر بيانات الأعمال", "مسارات التنبيه", "ربط محايد للمزودين"],
      },
      {
        id: "computer-vision",
        number: "05",
        title: "الرؤية الحاسوبية",
        status: "توجه التجزئة قيد التطوير",
        problem: "بعض الإشارات التشغيلية تحدث في أماكن فعلية وتُفقد حتى تظهر تكلفتها.",
        approach: "تطوّر TQEN أنظمة مراقبة مضبوطة بعناية تحوّل الإشارات المرئية المسموحة إلى أحداث تشغيلية قابلة للمراجعة.",
        result: "تستطيع الفرق التحقيق في الأحداث المهمة دون معاملة كل كاميرا كشيء يجب مراقبته باستمرار.",
        examples: ["إشارات منع الفاقد", "المراقبة التشغيلية", "المراجعة البشرية", "تصميم يراعي الخصوصية"],
      },
      {
        id: "custom-systems",
        number: "06",
        title: "أنظمة تشغيلية مخصصة",
        status: "استكشاف وتسليم محدد النطاق",
        problem: "سير العمل الأهم قد لا يناسب أي فئة منتجات معيارية.",
        approach: "تدرس TQEN كيف يعمل العمل فعلياً، ثم تختار أصغر تركيبة مفيدة من البرمجيات والأتمتة والذكاء.",
        result: "يناسب الحل العملية بدل أن تُجبر العملية على قالب عام.",
        examples: ["برمجيات مخصصة", "سير عمل علاقات العملاء", "منصات العمليات", "أتمتة مبنية لغرض محدد"],
      },
    ],
    closing: "النظام الصحيح يبدأ من العملية، لا من تقنية محددة سلفاً.",
    cta: "أخبرنا كيف يعمل عملك",
  },
  howItWorks: {
    eyebrow: "كيف تعمل أنظمة TQEN",
    title: "اربط ما هو موجود. وحسّن ما سيحدث.",
    copy: "تجلس TQEN فوق الأدوات التي تستخدمها، تراقب العمليات، وتُظهر الاستثناءات التي تستحق الانتباه.",
    operationTitle: "عمليتك الحالية",
    inputs: ["الرسائل", "الفواتير", "أنظمة العملاء", "الأدوات الداخلية", "البيانات التشغيلية"],
    systemName: "TQEN",
    actions: ["نفهم", "نربط", "نؤتمت", "نراقب", "نرتّب الأولويات"],
    routes: [
      { label: "AUTO", detail: "عمل آمن ومتكرر" },
      { label: "APPROVAL", detail: "يقرر المدير" },
      { label: "HUMAN", detail: "تحتاج المسألة إلى تقدير" },
    ],
  },
  flagship: {
    status: "TQEN Restaurant · جاهز للتجربة",
    title: "أدر كل فرع دون أن تحمل كل فرع في رأسك.",
    copy: "يجمع مركز قيادة المدير الاستثناءات التشغيلية والموافقات وإشارات السمعة وتكاليف الموردين في شاشة مراجعة واحدة. تراقب TQEN العمليات وتُظهر ما تغيّر، وما هو شاذ، وما يمكن أن تتولاه، وما يحتاج مديراً أو مالكاً أو لا أحد.",
    capabilities: [
      "الموجز اليومي للمدير",
      "قوائم الانتباه والموافقة",
      "ذكاء السمعة",
      "ذكاء فواتير الموردين",
      "الاستخراج التلقائي للفواتير",
      "أدوار الفروع وسجل النشاط",
    ],
    link: "استكشف TQEN Restaurant",
  },
  proof: {
    eyebrow: "أعمال مختارة",
    title: "براهين، لا وعود.",
    copy: "منتجنا الرئيسي، وعلامات بنيناها.",
    flagshipStatus: "المنتج الرئيسي",
    flagshipLive: "منتج مبني",
    flagshipTitle: "TQEN Restaurant",
    flagshipCopy: "مركز قيادة تشغيلي حقيقي متعدد الفروع للانتباه والموافقات والسمعة وذكاء الموردين.",
    flagshipPoints: ["الموجز اليومي", "قوائم الانتباه", "ذكاء الموردين"],
    flagshipScopeLabel: "حي في التجربة",
    flagshipScope: ["مركز قيادة المدير", "الموجز اليومي للمدير", "ذكاء السمعة", "ذكاء تكاليف الموردين"],
    flagshipLink: "شاهد المنتج",
    crave: {
      tag: "عمل مختار",
      title: "Crave It",
      definition: "نظام طلب واشتراك رقمي متكامل.",
      builtLabel: "ما بنيناه",
      built: ["تجربة طلب للعملاء", "تدفق الاشتراك وخطط الوجبات", "سير الإدارة والتنفيذ", "منظومة واحدة تربط العملاء بالعمليات"],
      valueLabel: "القيمة للأعمال",
      value: ["الطلبات والاشتراكات والإدارة تتحرك في تدفق واحد — تنسيق يدوي أقل", "يرى المالك الطلبات الواردة بوضوح بدل ملاحقة الرسائل", "معالجة الطلبات المتكررة تنخفض مع نمو الحجم"],
      primaryCta: "زيارة Crave It",
      primaryHref: "https://craveitsyria.com/en",
      external: true,
      secondaryCta: "اقرأ دراسة الحالة",
      secondaryHref: "/case-studies/crave-it",
    },
    velvet: {
      tag: "عمل مختار",
      title: "Velvet",
      definition: "الهوية والموقع وتجربة الطلب.",
      builtLabel: "ما بنيناه",
      built: ["الهوية والمعالجة الرقمية للعلامة", "موقع موجّه للعملاء", "عرض المنتجات", "تجربة الطلب"],
      valueLabel: "القيمة للأعمال",
      value: ["حضور رقمي احترافي يحمل العلامة", "طريق أوضح من الاكتشاف إلى الطلب باحتكاك أقل", "أسئلة متكررة أقل — مكان واحد ترسل إليه العملاء"],
      primaryCta: "زيارة Velvet",
      primaryHref: "https://velvets.fit/",
      external: true,
    },
    stripLabel: "بنينا لـ",
  },
  agentInvite: {
    eyebrow: "تحدث إلى ذكائنا الاصطناعي عن عملك",
    title: "إذا سألت هل نبني الوكلاء، فأنت تتحدث إلى وكيلنا أصلاً.",
    copy: "صف عملياتك، واسأل عمّا يمكن أن تدعمه TQEN، أو استكشف سير التواصل الحي.",
    cta: "تحدث إلى TQEN",
    capabilitiesTitle: "قدرات حيّة حالياً",
    abilities: ["يشرح TQEN", "يستخدم معرفة العمل", "يتحدث ثلاث لغات", "يلتقط استفسارات التجربة"],
    note: "يستخدم الوكيل العام محرك TQEN الحالي. تُبث الردود وأحداث سير العمل عبر البوابة الخادمية.",
  },
  finalCta: {
    title: "أخبرنا كيف يعمل عملك.",
    copy: "سنحدد موضعاً مركّزاً للأتمتة أو الربط أو التحسين.",
    cta: "تحدث إلى TQEN",
  },
  productPreview: {
    name: "TQEN Restaurant",
    role: "مركز قيادة المدير",
    sample: "مساحة عمل تجريبية",
    briefLabel: "الموجز اليومي للمدير",
    briefTitle: "ابدأ بما يحتاج الانتباه.",
    branches: "كل الفروع",
    attentionTitle: "يحتاج الانتباه",
    attention: [
      { title: "فاتورة مورد تحتاج مراجعة", detail: "تغيّر سعري مهم بانتظار مدير." },
      { title: "مشكلة خدمة متكررة", detail: "إشارات السمعة تُظهر نفس الموضوع في التقييمات الأخيرة." },
    ],
    routingTitle: "توجيه القرارات",
    routing: [
      { term: "AUTO", detail: "عمل آمن مكتمل" },
      { term: "APPROVAL", detail: "يتطلب مراجعة مدير" },
      { term: "HUMAN", detail: "مُصعّد للتقدير البشري" },
    ],
  },
};
