export interface AboutPrinciple {
  title: string;
  description: string;
}

export interface AboutWorkStand {
  title: string;
  description: string;
}

export interface AboutCopy {
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  principles: AboutPrinciple[];
  workStandsTitle: string;
  workStands: AboutWorkStand[];
}

export const aboutEn: AboutCopy = {
  metadataTitle: "About",
  metadataDescription: "TQEN builds serious operational technology around how businesses actually work.",
  eyebrow: "About TQEN",
  title: "Build around the operation.",
  intro:
    "TQEN builds intelligent operational systems that understand business context, handle repetitive work and bring people the decisions that need their judgment.",
  principles: [
    {
      title: "Software first",
      description: "The product must solve the workflow even when AI is not the right tool for every step.",
    },
    {
      title: "AI where useful",
      description: "Agents, retrieval and automation are applied where they create a clearer or faster operating path.",
    },
    {
      title: "People stay in control",
      description: "Safe routine work can move automatically. Sensitive decisions can require approval or human handling.",
    },
    {
      title: "Industry context matters",
      description: "Useful systems reflect the language, roles, constraints and exceptions of the business using them.",
    },
    {
      title: "Connect before replacing",
      description: "Where reliable interfaces exist, TQEN can work with existing tools instead of demanding a complete replacement.",
    },
    {
      title: "Proof over theatre",
      description: "We distinguish what is built, what is in development and what is planned without invented scale or performance claims.",
    },
  ],
  workStandsTitle: "Where the work stands",
  workStands: [
    {
      title: "TQEN Restaurant",
      description: "A real, pilot-ready operational product.",
    },
    {
      title: "TQEN Retail",
      description: "Operational intelligence and loss-prevention work in development.",
    },
    {
      title: "TQEN Vision",
      description: "A planned vision-intelligence direction, not a released product.",
    },
  ],
};

export const aboutAr: AboutCopy = {
  metadataTitle: "من نحن",
  metadataDescription: "تبني TQEN تقنية تشغيلية جادة حول طريقة عمل الشركات فعلياً.",
  eyebrow: "عن TQEN",
  title: "ابنِ حول العملية.",
  intro: "تبني TQEN أنظمة تشغيلية ذكية تفهم سياق العمل، وتتولى العمل المتكرر، وتضع أمام الناس القرارات التي تحتاج تقديرهم.",
  principles: [
    {
      title: "البرمجيات أولاً",
      description: "يجب أن يحل المنتج سير العمل حتى عندما لا يكون الذكاء الاصطناعي الأداة المناسبة لكل خطوة.",
    },
    {
      title: "الذكاء الاصطناعي حيث يفيد",
      description: "نوظف الوكلاء والاسترجاع والأتمتة حيث تخلق مساراً تشغيلياً أوضح أو أسرع.",
    },
    {
      title: "الإنسان يبقى المتحكم",
      description: "العمل الروتيني الآمن يمكن أن يتحرك تلقائياً. والقرارات الحساسة يمكن أن تتطلب موافقة أو معالجة بشرية.",
    },
    {
      title: "سياق القطاع مهم",
      description: "الأنظمة المفيدة تعكس لغة العمل وأدواره وقيوده واستثناءاته.",
    },
    {
      title: "نربط قبل أن نستبدل",
      description: "حيث توجد واجهات موثوقة، تعمل TQEN مع أدواتك الحالية بدل أن تفرض استبدالاً كاملاً.",
    },
    {
      title: "البرهان لا الاستعراض",
      description: "نميّز بين ما هو مبني وما هو قيد التطوير وما هو مخطط له، دون ادعاءات مختلقة عن الحجم أو الأداء.",
    },
  ],
  workStandsTitle: "أين وصل العمل",
  workStands: [
    {
      title: "TQEN Restaurant",
      description: "منتج تشغيلي حقيقي، جاهز للتجربة.",
    },
    {
      title: "TQEN Retail",
      description: "ذكاء تشغيلي ومنع فاقد قيد التطوير.",
    },
    {
      title: "TQEN Vision",
      description: "توجه مخطط له لذكاء الرؤية، وليس منتجاً مُطلقاً.",
    },
  ],
};
