export const pgparaStarterPrompts = [
  "Sanal POS nedir?",
  "بدي أعرف كيف أقدر أرسل حوالة",
  "I run an ecommerce business and need to accept card payments.",
  "Can someone from sales contact me about Sanal POS?",
] as const;

export const pgparaSecondaryPrompts = [
  "My transfer failed. Why?",
  "What is the exact transfer fee?",
  "Where can I find a PGPara representative?",
] as const;

export const pgparaCapabilities = [
  {
    title: "Available in this prototype",
    items: ["Product guidance", "Multilingual assistance", "Merchant inquiries", "Safe support guidance"],
  },
  {
    title: "Integration-ready",
    items: ["Transfer status", "Representative lookup", "Authenticated account assistance"],
  },
] as const;

export const pgparaIntegrationTools = [
  {
    title: "Transfer Calculator",
    status: "Integration ready",
    description: "Connects to PGPara's approved calculation service for verified transfer estimates.",
  },
  {
    title: "Transfer Status",
    status: "Integration ready",
    description: "Can connect to PGPara's approved transaction-status service for verified results.",
  },
  {
    title: "Representative Finder",
    status: "Integration ready",
    description: "Can connect to approved PGPara representative and location data.",
  },
] as const;
