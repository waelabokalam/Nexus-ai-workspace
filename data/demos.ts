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
    id: "customer-support",
    title: "TQEN Agent",
    description:
      "Talk to the official TQEN Agent for grounded company knowledge, multi-language dialogue, and pilot qualification.",
    capabilities: [
      "Multi-language",
      "Grounded Knowledge",
      "Adaptive Tone",
      "Pilot Qualification",
    ],
    availability: { label: "Live today", values: ["Website workspace"] },
    href: "/demo/support",
    icon: "customer-support",
    status: "available",
  },
  {
    id: "restaurant",
    title: "Restaurant Guest Assistant",
    description: "Experience the guest-facing side of the Restaurant vertical with menu knowledge and reservation workflows.",
    capabilities: ["Reservations", "Menu Q&A", "Business Knowledge"],
    availability: { label: "Live today", values: ["Website workspace"] },
    href: "/demo/restaurant",
    icon: "restaurant",
    status: "available",
  },
  {
    id: "pgpara",
    title: "PGPara AI Assistant",
    description: "A clearly disclosed concept prototype for multilingual product guidance, merchant inquiries and safe financial support responses.",
    capabilities: ["Turkish, Arabic & English", "Merchant Inquiries", "Product Guidance", "Safe Support"],
    availability: { label: "Demo status", values: ["Independent concept prototype"] },
    href: "/demo/pgpara",
    icon: "pgpara",
    status: "prototype",
  },
];
