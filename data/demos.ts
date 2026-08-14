export type DemoIconName =
  | "customer-support"
  | "restaurant"
  | "healthcare"
  | "real-estate"
  | "custom-business"
  | "pgpara";

export type DemoStatus = "available" | "prototype" | "coming-soon" | "planned";

export type Demo = {
  id: string;
  title: string;
  description: string;
  capabilities: string[];
  availability: {
    label: string;
    values: string[];
  };
  href?: string;
  icon: DemoIconName;
  status: DemoStatus;
};

export const demos: Demo[] = [
  {
    id: "pgpara",
    title: "PGPara AI Assistant",
    description: "A concept demo for multilingual product guidance, merchant inquiries and safe financial support responses.",
    capabilities: ["Turkish, Arabic & English", "Merchant Inquiries", "Product Guidance", "Safe Support"],
    availability: { label: "Demo status", values: ["Concept prototype"] },
    href: "/demo/pgpara",
    icon: "pgpara",
    status: "prototype",
  },
  {
    id: "customer-support",
    title: "Customer Support",
    description:
      "Answer customer questions, search company knowledge and book appointments.",
    capabilities: [
      "Multi-language",
      "Google Calendar",
      "Adaptive Tone",
      "Knowledge Base",
    ],
    availability: { label: "Live today", values: ["Website workspace"] },
    href: "/demo/support",
    icon: "customer-support",
    status: "available",
  },
  {
    id: "restaurant",
    title: "Restaurant",
    description: "A future guest-support configuration for questions, reservations and service details.",
    capabilities: ["Reservations", "Menu Q&A", "Business Knowledge"],
    availability: { label: "Release status", values: ["Planned scenario"] },
    icon: "restaurant",
    status: "coming-soon",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    description: "A future service-information and appointment-request configuration for healthcare teams.",
    capabilities: ["Appointments", "Service FAQ", "Calendar Workflows"],
    availability: { label: "Release status", values: ["Planned scenario"] },
    icon: "healthcare",
    status: "coming-soon",
  },
  {
    id: "real-estate",
    title: "Real Estate",
    description: "A future property-information and viewing-request configuration for real estate teams.",
    capabilities: ["Property Search", "Viewing Requests", "Business Knowledge"],
    availability: { label: "Release status", values: ["Planned scenario"] },
    icon: "real-estate",
    status: "coming-soon",
  },
  {
    id: "custom-business",
    title: "Custom Business",
    description: "Nexus is designed to adapt to a company’s knowledge, communication style, languages, policies and enabled workflows.",
    capabilities: ["Business Knowledge", "Communication Style", "Languages", "Workflows & Tools"],
    availability: { label: "Configuration model", values: ["Planned capability"] },
    icon: "custom-business",
    status: "planned",
  },
];
