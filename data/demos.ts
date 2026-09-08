export type DemoIconName =
  | "customer-support"
  | "restaurant"
  | "healthcare"
  | "real-estate"
  | "custom-business"
  | "pgpara";

export type DemoStatus = "available" | "prototype" | "proof";
export type DemoGroup = "live" | "proof" | "lab";

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
  group: DemoGroup;
};

export const demos: Demo[] = [
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
    group: "live",
  },
  {
    id: "restaurant",
    title: "Restaurant",
    description: "Guest support for Saray Sofrasi: menu questions in three languages and live table reservations.",
    capabilities: ["Reservations", "Menu Q&A", "Business Knowledge"],
    availability: { label: "Live today", values: ["Website workspace"] },
    href: "/demo/restaurant",
    icon: "restaurant",
    status: "available",
    group: "live",
  },
  {
    id: "crave-it",
    title: "Crave It / Nexus Direct",
    description: "A real customer and operational system built around a direct food-business workflow.",
    capabilities: ["Customer Experience", "Order Workflow", "Administration", "Fulfilment"],
    availability: { label: "Proof", values: ["Nexus Direct implementation"] },
    href: "/case-studies/crave-it",
    icon: "restaurant",
    status: "proof",
    group: "proof",
  },
  {
    id: "pgpara",
    title: "PGPara AI Assistant",
    description: "A disclosed concept prototype for multilingual product guidance, merchant inquiries and safe financial support.",
    capabilities: ["Turkish, Arabic & English", "Merchant Inquiries", "Product Guidance", "Safe Support"],
    availability: { label: "Disclosure", values: ["Independent concept prototype"] },
    href: "/demo/pgpara",
    icon: "pgpara",
    status: "prototype",
    group: "lab",
  },
];
