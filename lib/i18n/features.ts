export interface FeaturesHeaderCopy {
  eyebrow: string;
  title: string;
  copy: string;
}

export interface FeaturesCopy {
  header: FeaturesHeaderCopy;
  metaTitle: string;
  metaDescription: string;
}

export const featuresEn: FeaturesCopy = {
  header: {
    eyebrow: "What we build",
    title: "Systems that make the operation easier to run.",
    copy: "TQEN combines software, automation and AI only where each one is useful. Every engagement begins with the workflow, the people responsible for it and the decisions that matter.",
  },
  metaTitle: "Features",
  metaDescription:
    "Explore the intelligent systems, automation, applications, integrations and operational technology TQEN builds around real businesses.",
};

export const featuresAr: FeaturesCopy = {
  header: {
    eyebrow: "ماذا نبني",
    title: "أنظمة تجعل تشغيل عملك أسهل.",
    copy: "تجمع TQEN بين البرمجيات والأتمتة والذكاء الاصطناعي فقط حيث يفيد كلٌّ منها فعلاً. ويبدأ كل تعاون من سير العمل، والأشخاص المسؤولين عنه، والقرارات التي تهمّ.",
  },
  metaTitle: "القدرات",
  metaDescription:
    "استكشف الأنظمة الذكية والأتمتة والتطبيقات والتكاملات والتقنيات التشغيلية التي تبنيها TQEN حول الأعمال الحقيقية.",
};
