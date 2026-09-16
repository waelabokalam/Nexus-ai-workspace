export interface LegalSectionCopy {
  title: string;
  body: string;
}

export interface PrivacyCopy {
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  appliesNote: string;
  title: string;
  intro: string;
  infoTitle: string;
  infoBody: string;
  sessionTitle: string;
  sessionBody: string;
  questionsTitle: string;
  questionsBefore: string;
  questionsLinkLabel: string;
  questionsAfter: string;
  contactHref: string;
}

export interface TermsCopy {
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  appliesNote: string;
  title: string;
  intro: string;
  sections: LegalSectionCopy[];
}

export const privacyEn: PrivacyCopy = {
  metadataTitle: "Privacy",
  metadataDescription: "TQEN privacy information for the public website and demo.",
  eyebrow: "TQEN legal",
  appliesNote: "Applies to the current public TQEN website and demo.",
  title: "Privacy",
  intro: "This page describes the current public TQEN website and demo at a high level. It is not a claim of a completed enterprise privacy programme.",
  infoTitle: "Information in the demo",
  infoBody:
    "Messages submitted to the support demo are sent through the TQEN website proxy to the configured development engine so a response can be generated. Avoid entering sensitive, confidential, regulated or personal information in the public demo.",
  sessionTitle: "Session identifiers",
  sessionBody:
    "The demo creates conversation and customer identifiers in your browser session storage to keep messages in the same session together. They are not designed as an account or identity system.",
  questionsTitle: "Privacy questions",
  questionsBefore: "Use the ",
  questionsLinkLabel: "contact page",
  questionsAfter:
    " when a public contact address is configured. Specific retention, processing and deployment terms should be agreed before a production deployment, including a verified route for privacy requests.",
  contactHref: "/contact",
};

export const privacyAr: PrivacyCopy = {
  metadataTitle: "الخصوصية",
  metadataDescription: "معلومات خصوصية TQEN للموقع العام والتجربة.",
  eyebrow: "معلومات TQEN القانونية",
  appliesNote: "ينطبق على موقع TQEN العام الحالي والتجربة.",
  title: "الخصوصية",
  intro: "تصف هذه الصفحة موقع TQEN العام الحالي والتجربة بشكل عام. وهي ليست ادعاءً باكتمال برنامج خصوصية مؤسسي.",
  infoTitle: "المعلومات في التجربة",
  infoBody: "تُرسل الرسائل المُدخلة في تجربة الدعم عبر بوابة موقع TQEN إلى محرك التطوير المُعدّ لتوليد الرد. تجنّب إدخال معلومات حساسة أو سرية أو خاضعة لتنظيم أو شخصية في التجربة العامة.",
  sessionTitle: "معرّفات الجلسة",
  sessionBody: "تنشئ التجربة معرّفات محادثة وعميل في تخزين جلسة المتصفح للحفاظ على رسائل الجلسة معاً. وهي ليست مصممة كنظام حسابات أو هوية.",
  questionsTitle: "أسئلة الخصوصية",
  questionsBefore: "استخدم ",
  questionsLinkLabel: "صفحة التواصل",
  questionsAfter: " عندما يكون عنوان التواصل العام مُعدّاً. يجب الاتفاق على شروط الاحتفاظ والمعالجة والنشر قبل أي نشر إنتاجي، بما يشمل قناة موثقة لطلبات الخصوصية.",
  contactHref: "/contact",
};

export const termsEn: TermsCopy = {
  metadataTitle: "Terms",
  metadataDescription: "Terms for using the TQEN public website and demo.",
  eyebrow: "TQEN legal",
  appliesNote: "Applies to the current public TQEN website and demo.",
  title: "Terms",
  intro: "These terms apply to the current public TQEN website and early-access demo.",
  sections: [
    {
      title: "Demo use",
      body: "The demo is provided for evaluation. Do not rely on demo output as legal, medical, financial or other professional advice, and do not submit information that should not be used in a public evaluation environment.",
    },
    {
      title: "Early-access product",
      body: "Features, availability and plan descriptions may change. A production deployment, support commitment, data-processing terms or commercial subscription requires a separate written agreement.",
    },
    {
      title: "Acceptable use",
      body: "Do not use the website or demo to abuse services, probe for credentials, interfere with availability, submit unlawful content or attempt to access systems or data without permission.",
    },
  ],
};

export const termsAr: TermsCopy = {
  metadataTitle: "الشروط",
  metadataDescription: "شروط استخدام موقع TQEN العام والتجربة.",
  eyebrow: "معلومات TQEN القانونية",
  appliesNote: "ينطبق على موقع TQEN العام الحالي والتجربة.",
  title: "الشروط",
  intro: "تنطبق هذه الشروط على موقع TQEN العام الحالي وتجربة الوصول المبكر.",
  sections: [
    {
      title: "استخدام التجربة",
      body: "التجربة مقدمة للتقييم. لا تعتمد على مخرجاتها كنصيحة قانونية أو طبية أو مالية أو مهنية، ولا تُدخل معلومات لا يجوز استخدامها في بيئة تقييم عامة.",
    },
    {
      title: "منتج الوصول المبكر",
      body: "قد تتغير الميزات والتوفر ووصف الخطط. يتطلب النشر الإنتاجي أو التزام الدعم أو شروط معالجة البيانات أو الاشتراك التجاري اتفاقاً مكتوباً منفصلاً.",
    },
    {
      title: "الاستخدام المقبول",
      body: "لا تستخدم الموقع أو التجربة لإساءة استخدام الخدمات أو البحث عن بيانات اعتماد أو التأثير على التوفر أو تقديم محتوى غير قانوني أو محاولة الوصول إلى أنظمة أو بيانات دون إذن.",
    },
  ],
};
