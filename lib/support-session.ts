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

function sessionKeys(namespace: string) {
  if (namespace === "support") {
    return { conversation: CONVERSATION_KEY, customer: CUSTOMER_KEY };
  }

  return {
    conversation: `nexus-${namespace}-conversation-id`,
    customer: `nexus-${namespace}-customer-id`,
  };
}

function persistDemoSession(storage: Storage, namespace: string, session: SupportSession): SupportSession {
  const keys = sessionKeys(namespace);
  storage.setItem(keys.conversation, session.conversationId);
  storage.setItem(keys.customer, session.customerId);
  return session;
}

export function getOrCreateDemoSession(storage: Storage, namespace = "support"): SupportSession {
  const keys = sessionKeys(namespace);
  const conversationId =
    storage.getItem(keys.conversation) ?? createSupportId();

  const customerId =
    storage.getItem(keys.customer) ?? createSupportId();

  return persistDemoSession(storage, namespace, {
    conversationId,
    customerId,
  });
}

export function createNewDemoSession(storage: Storage, namespace = "support"): SupportSession {
  return persistDemoSession(storage, namespace, {
    conversationId: createSupportId(),
    customerId: createSupportId(),
  });
}

export function getOrCreateSupportSession(storage: Storage): SupportSession {
  return getOrCreateDemoSession(storage);
}

export function createNewSupportSession(storage: Storage): SupportSession {
  return createNewDemoSession(storage);
}
