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
    title: "Integration-ready",
    items: ["Point-of-sale specials", "Delivery ordering", "Loyalty program"],
  },
] as const;

export const restaurantIntegrationTools = [
  {
    title: "Google Calendar",
    status: "Live",
    description: "Confirmed reservations are created as real calendar events.",
  },
  {
    title: "Human handoff",
    status: "Live",
    description: "Guests can ask for staff contact at any point in the conversation.",
  },
  {
    title: "Lead capture",
    status: "Live",
    description: "Large-party and event inquiries are collected for the restaurant team.",
  },
] as const;
