export const restaurantStarterPrompts = [
  "Masaya ayırtmak istiyorum — yarın akşam 2 kişi.",
  "بدي أحجز طاولة لعيلتي يوم الجمعة، ٦ أشخاص، وبدنا قعدة تراس.",
  "What's on the menu? Is the sea bass grilled?",
  "Do you have anything for vegetarians?",
] as const;

export const restaurantSecondaryPrompts = [
  "How much is the mixed grill for two?",
  "What time do you close?",
  "Is parking available?",
] as const;

export const restaurantCapabilities = [
  {
    title: "Available in this demo",
    items: ["Menu Q&A", "Live table reservations", "Multilingual service"],
  },
  {
    title: "Next",
    items: ["Manager brief", "Approval inbox", "Reputation signals"],
  },
] as const;

export const restaurantIntegrationTools = [
  {
    title: "Google Calendar",
    status: "Building",
    description: "Confirmed reservations are created as real calendar events.",
  },
  {
    title: "Human handoff",
    status: "Live",
    description: "Human routing is part of the restaurant control model.",
  },
  {
    title: "Lead capture",
    status: "Building",
    description: "Structured inquiry capture is being prepared for restaurant teams.",
  },
] as const;
