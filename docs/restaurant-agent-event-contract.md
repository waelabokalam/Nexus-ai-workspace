# Nexus Restaurant event contract

Restaurant V1 owns the persisted operational model in the Nexus Next.js/Supabase frontend. The existing Nexus Agent backend continues to own RAG, memory, scheduling, lead capture, SSE, and model orchestration. It must not import the frontend data layer or write Restaurant tables directly.

## Future integration boundary

The backend should eventually publish one versioned, provider-neutral normalized event to a trusted frontend ingestion endpoint after a capability outcome is durable and before its final `response.completed` SSE frame.

The current backend integration points are in `src/nexus_sse_adapter.py::stream_events`:

- Lead capture: after the successful `lead_result` branch has persisted its outcome and before the completion event (currently around lines 196–213).
- Scheduling continuation or confirmed scheduling: after continuation/result state is saved and before completion (currently around lines 215–265).
- General knowledge/style response: after a valid result and conversation turn are available and before completion (currently around lines 282–286).

The publisher should be injected behind a small backend interface. Publishing failure policy, retries, and idempotency must be explicit; no Restaurant event should be inferred from transient SSE telemetry in the browser.

## Version 1 envelope

```json
{
  "contractVersion": 1,
  "organizationReference": "backend-owned-stable-tenant-mapping",
  "branchReference": "optional-backend-owned-stable-branch-mapping",
  "occurredAt": "2026-09-08T12:00:00Z",
  "source": "nexus_agent",
  "eventType": "customer_question",
  "category": "customer",
  "title": "Customer question answered",
  "summary": "A concise manager-facing outcome.",
  "severity": "info",
  "requestedHandlingMode": "auto",
  "sourceReference": "request-or-capability-outcome-id",
  "subjectType": "conversation",
  "subjectId": "opaque-non-secret-reference",
  "structuredData": {
    "channel": "web_chat",
    "language": "en"
  },
  "confidence": 0.94,
  "dedupeKey": "nexus-agent:outcome:stable-id"
}
```

The trusted frontend endpoint maps stable backend organization and branch references to internal Restaurant UUIDs. It must never accept a browser-supplied organization mapping. The existing `normalizeRestaurantEvent`, deterministic rule engine, and `ingestRestaurantEvent` service then validate, classify, and atomically persist the event plus any attention, approval, and activity records.

## Safety constraints

- The service-to-service endpoint must use independent authentication and replay protection; it must not expose the Supabase service-role key.
- `dedupeKey` or `sourceReference` is required for retryable publishers.
- Provider-specific details belong only in allowlisted structured data or later connector tables.
- Never include prompts, chain-of-thought, credentials, raw provider payloads, or unnecessary customer-sensitive data.
- Phase 1 does not wire this publisher or execute external actions. Approval decisions only update persisted state and activity history.
