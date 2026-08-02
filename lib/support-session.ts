const CONVERSATION_KEY = "nexus-support-conversation-id";
const CUSTOMER_KEY = "nexus-support-customer-id";

function createSupportId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export type SupportSession = {
  conversationId: string;
  customerId: string;
};

function persistSupportSession(storage: Storage, session: SupportSession): SupportSession {
  storage.setItem(CONVERSATION_KEY, session.conversationId);
  storage.setItem(CUSTOMER_KEY, session.customerId);
  return session;
}

export function getOrCreateSupportSession(storage: Storage): SupportSession {
  const conversationId =
    storage.getItem(CONVERSATION_KEY) ?? createSupportId();

  const customerId =
    storage.getItem(CUSTOMER_KEY) ?? createSupportId();

  return persistSupportSession(storage, {
    conversationId,
    customerId,
  });
}

export function createNewSupportSession(storage: Storage): SupportSession {
  return persistSupportSession(storage, {
    conversationId: createSupportId(),
    customerId: createSupportId(),
  });
}
