export interface RestaurantHeroCopy {
  status: string;
  titleA: string;
  titleB: string;
  copy: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface RestaurantManagementCopy {
  title: string;
  copy: string;
  briefTitle: string;
  briefCopy: string;
  briefColumns: string[];
  briefNote: string;
  exceptionTitle: string;
  exceptionCopy: string;
}

export interface RestaurantIntelligenceCopy {
  title: string;
  reputationTitle: string;
  reputationCopy: string;
  supplierTitle: string;
  supplierCopy: string;
  extractionTitle: string;
  extractionCopy: string;
  reviewTitle: string;
  reviewCopy: string;
}

export interface ControlRoute {
  term: string;
  detail: string;
}

export interface RestaurantControlCopy {
  orgTitle: string;
  orgCopy: string;
  branchNote: string;
  historyNote: string;
  controlTitle: string;
  routes: ControlRoute[];
}

export interface RestaurantIntegrationCopy {
  title: string;
  copy: string;
  builtTitle: string;
  built: string[];
  nextTitle: string;
  nextCopy: string;
  next: string[];
}

export interface RestaurantPilotCopy {
  title: string;
  copy: string;
  primaryCta: string;
  secondaryCta: string;
  examinesTitle: string;
  checks: string[];
}

export interface RestaurantsCopy {
  hero: RestaurantHeroCopy;
  management: RestaurantManagementCopy;
  intelligence: RestaurantIntelligenceCopy;
  control: RestaurantControlCopy;
  integration: RestaurantIntegrationCopy;
  pilot: RestaurantPilotCopy;
}

export interface RestaurantMetaCopy {
  title: string;
  description: string;
}

export const restaurantMetaEn: RestaurantMetaCopy = {
  title: "TQEN Restaurant Operations",
  description:
    "TQEN Restaurant is a pilot-ready Manager Command Center for attention, approvals, reputation, supplier costs, invoice extraction and multi-branch operations.",
};

export const restaurantMetaAr: RestaurantMetaCopy = {
  title: "عمليات TQEN Restaurant",
  description:
    "TQEN Restaurant مركز قيادة للمدير جاهز للتجربة: الانتباه والموافقات والسمعة وتكاليف الموردين واستخراج الفواتير وعمليات الفروع المتعددة.",
};

export const restaurantsEn: RestaurantsCopy = {
  hero: {
    status: "TQEN Restaurant · Pilot ready",
    titleA: "Run every location without",
    titleB: "carrying every location in your head.",
    copy: "A command center for attention, approvals, reputation, supplier costs and the daily decisions that need management.",
    primaryCta: "Apply for a 30-day pilot",
    secondaryCta: "See the command center",
  },
  management: {
    title: "One place to see what changed, what matters, and who should act.",
    copy: "TQEN Restaurant turns persisted operational events into a daily management view. It watches operations and surfaces the exceptions that deserve attention: what changed, what is abnormal, what TQEN can handle, what needs a manager, and what needs the owner. It does not replace judgment or hide important work.",
    briefTitle: "Daily Manager Brief",
    briefCopy:
      "Each business day begins with the current operational picture: high-priority attention, pending approvals, human escalations and work already handled by TQEN.",
    briefColumns: ["Needs attention", "Waiting for approval", "Handled by TQEN"],
    briefNote: "Only persisted operational events appear here.",
    exceptionTitle: "Exception-first management",
    exceptionCopy:
      "Owners and managers review the work that needs a decision instead of repeatedly checking every source system.",
  },
  intelligence: {
    title: "Operational intelligence that leads to reviewable work.",
    reputationTitle: "Reputation intelligence",
    reputationCopy:
      "Reviews are normalized into sentiment, topics and severity. Repeated negative themes become visible, while high-risk issues remain human decisions.",
    supplierTitle: "Supplier cost intelligence",
    supplierCopy:
      "Reviewed invoices build supplier and item price history. Material changes, mismatched totals, currency changes and ambiguous items stay visible for manager review.",
    extractionTitle: "Automatic invoice extraction",
    extractionCopy:
      "Private invoice files are extracted into an editable draft. A manager reviews and corrects the draft before it enters the supplier intelligence workflow.",
    reviewTitle: "Review before persistence",
    reviewCopy: "Extraction does not authorize purchasing, accounting, payment or menu-price changes.",
  },
  control: {
    orgTitle: "Built for real organizations.",
    orgCopy:
      "Organizations, branches, owner, manager and staff roles, authenticated access, and row-level data boundaries are part of the product today.",
    branchNote: "Multi-branch context stays explicit in the workspace.",
    historyNote: "Activity history records operational decisions.",
    controlTitle: "Humans remain in control.",
    routes: [
      { term: "AUTO", detail: "Safe, deterministic work can complete automatically." },
      { term: "APPROVAL", detail: "Sensitive work waits for an authorized decision." },
      { term: "HUMAN", detail: "High-risk issues move directly to people." },
    ],
  },
  integration: {
    title: "Built product, clear integration boundaries.",
    copy: "TQEN can connect existing restaurant systems through provider adapters. We do not claim integrations before they are configured and verified.",
    builtTitle: "Built and pilot ready",
    built: [
      "Manager Command Center",
      "Daily Manager Brief",
      "Attention and approval workflows",
      "Reputation intelligence",
      "Supplier invoice intelligence",
      "Automatic invoice extraction",
      "Multi-branch roles",
      "Activity and audit history",
    ],
    nextTitle: "Integration dependent",
    nextCopy: "These connections are implemented only after access, scope and provider behavior are confirmed.",
    next: ["POS providers", "Delivery platforms", "WhatsApp manager delivery", "Other external restaurant systems"],
  },
  pilot: {
    title: "Run TQEN with your restaurant for 30 days.",
    copy: "The pilot establishes a focused operational baseline and shows where the product can remove checking, surface issues, and support better decisions.",
    primaryCta: "Apply for a pilot",
    secondaryCta: "Existing pilot access",
    examinesTitle: "What the pilot examines",
    checks: [
      "Management time spent checking systems",
      "Operational issues surfaced for review",
      "Repetitive work that can be handled safely",
      "Supplier and cost changes caught",
      "Recurring customer issues detected",
    ],
  },
};

export const restaurantsAr: RestaurantsCopy = {
  hero: {
    status: "TQEN Restaurant · جاهز للتجربة",
    titleA: "أدر كل فرع دون",
    titleB: "أن تحمل كل فرع في رأسك.",
    copy: "مركز قيادة للانتباه والموافقات والسمعة وتكاليف الموردين والقرارات اليومية التي تحتاج إدارة.",
    primaryCta: "قدّم على تجربة ٣٠ يوماً",
    secondaryCta: "شاهد مركز القيادة",
  },
  management: {
    title: "مكان واحد يعرض ما تغيّر وما يهم ومن يجب أن يتحرك.",
    copy: "يحوّل TQEN Restaurant الأحداث التشغيلية المحفوظة إلى عرض إداري يومي. يراقب العمليات ويُظهر الاستثناءات التي تستحق الانتباه: ما تغيّر، وما هو شاذ، وما يمكن أن تتولاه TQEN، وما يحتاج مديراً، وما يحتاج المالك. لا يستبدل التقدير ولا يُخفي العمل المهم.",
    briefTitle: "الموجز اليومي للمدير",
    briefCopy: "يبدأ كل يوم عمل بالصورة التشغيلية الحالية: الانتباه عالي الأولوية والموافقات المعلّقة والتصعيدات البشرية والعمل الذي أنجزته TQEN.",
    briefColumns: ["يحتاج انتباهاً", "بانتظار الموافقة", "أنجزته TQEN"],
    briefNote: "تظهر هنا الأحداث التشغيلية المحفوظة فقط.",
    exceptionTitle: "إدارة تبدأ من الاستثناء",
    exceptionCopy: "يراجع المالكون والمديرون العمل الذي يحتاج قراراً بدل تفقّد كل نظام مصدر باستمرار.",
  },
  intelligence: {
    title: "ذكاء تشغيلي يقود إلى عمل قابل للمراجعة.",
    reputationTitle: "ذكاء السمعة",
    reputationCopy: "تُصنَّف التقييمات حسب التوجه والموضوع ودرجة الخطورة. تصبح المواضيع السلبية المتكررة مرئية، وتبقى المسائل عالية الخطورة قرارات بشرية.",
    supplierTitle: "ذكاء تكاليف الموردين",
    supplierCopy: "تبني الفواتير المراجَعة سجل أسعار للموردين والأصناف. تبقى التغيّرات الجوهرية والفروقات في الإجماليات وتغيّرات العملة والبنود الغامضة ظاهرة لمراجعة المدير.",
    extractionTitle: "الاستخراج التلقائي للفواتير",
    extractionCopy: "تُستخرج ملفات الفواتير الخاصة إلى مسودة قابلة للتحرير. يراجع المدير المسودة ويصححها قبل دخولها سير ذكاء الموردين.",
    reviewTitle: "مراجعة قبل الحفظ",
    reviewCopy: "الاستخراج لا يفوّض الشراء أو المحاسبة أو الدفع أو تغيير أسعار القائمة.",
  },
  control: {
    orgTitle: "مبني لمنظمات حقيقية.",
    orgCopy: "المنظمات والفروع وأدوار المالك والمدير والموظفين والدخول الموثّق وحدود البيانات على مستوى الصفوف — كلها جزء من المنتج اليوم.",
    branchNote: "يبقى سياق الفروع المتعددة واضحاً في مساحة العمل.",
    historyNote: "يسجّل سجل النشاط القرارات التشغيلية.",
    controlTitle: "يبقى الإنسان مسيطراً.",
    routes: [
      { term: "AUTO", detail: "العمل الآمن والمحدد يمكن أن يكتمل تلقائياً." },
      { term: "APPROVAL", detail: "العمل الحسّاس ينتظر قراراً مخوّلاً." },
      { term: "HUMAN", detail: "المسائل عالية الخطورة تذهب مباشرة إلى الناس." },
    ],
  },
  integration: {
    title: "منتج مبني، وحدود تكامل واضحة.",
    copy: "يمكن أن تربط TQEN أنظمة المطاعم الحالية عبر مهايئات المزودين. لا ندّعي أي تكامل قبل تهيئته والتحقق منه.",
    builtTitle: "مبني وجاهز للتجربة",
    built: [
      "مركز قيادة المدير",
      "الموجز اليومي للمدير",
      "سير عمل الانتباه والموافقة",
      "ذكاء السمعة",
      "ذكاء فواتير الموردين",
      "الاستخراج التلقائي للفواتير",
      "أدوار الفروع المتعددة",
      "سجل النشاط والتدقيق",
    ],
    nextTitle: "يعتمد على التكامل",
    nextCopy: "تُنفَّذ هذه التكاملات فقط بعد تأكيد الوصول والنطاق وسلوك المزود.",
    next: ["مزودو نقاط البيع", "منصات التوصيل", "إرسال التنبيهات للمدير عبر واتساب", "أنظمة المطاعم الخارجية الأخرى"],
  },
  pilot: {
    title: "شغّل TQEN في مطعمك لمدة ٣٠ يوماً.",
    copy: "تؤسس التجربة خط أساس تشغيلياً مركّزاً وتُظهر أين يمكن للمنتج أن يخفف التفقّد ويُظهر المشكلات ويدعم قرارات أفضل.",
    primaryCta: "قدّم على التجربة",
    secondaryCta: "دخول التجربة الحالي",
    examinesTitle: "ما الذي تفحصه التجربة",
    checks: [
      "وقت الإدارة في تفقّد الأنظمة",
      "المشكلات التشغيلية التي تُرفع للمراجعة",
      "العمل المتكرر الذي يمكن إنجازه بأمان",
      "تغيّرات الموردين والتكاليف المرصودة",
      "مشكلات العملاء المتكررة المرصودة",
    ],
  },
};
