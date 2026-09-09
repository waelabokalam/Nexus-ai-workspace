# Restaurant V1 application boundary

Restaurant V1 remains in this Next.js/Supabase application. The separate Nexus Agent backend keeps ownership of RAG, memory, scheduling, SSE, and model orchestration.

The integration boundary is the provider-neutral input accepted by `normalizeRestaurantEvent` and `ingestRestaurantEvent`. A future authenticated backend endpoint should translate an Agent outcome into that contract only after the outcome is known (for example, answered automatically, requested approval, or handed off). The Agent must not write command-center tables individually; ingestion atomically creates the event, attention/approval work, and activity entry through the database RPC.

Ingestion and explicit activity writes are server-only operations. The Next.js service first authenticates the user with the cookie-bound Supabase client, verifies organization membership, and only then invokes the RPC with the server-only service-role client and authenticated actor ID. The database independently verifies that actor membership. `SUPABASE_SERVICE_ROLE_KEY` must exist only in server environment configuration and must never use a `NEXT_PUBLIC_` prefix.

Provider-specific IDs and payload fragments belong in `sourceReference`, `dedupeKey`, and the allowlisted `structuredData` object. Secrets, prompts, model reasoning traces, raw credentials, and unrelated customer payloads must never be included. The V1 rule engine is deterministic and remains the source of handling/status decisions until an explicitly reviewed classifier is introduced.

All reads and writes require an authenticated organization membership. Browser-provided organization and branch IDs are validated by the server data-access layer and must also be enforced by RLS/RPC authorization in the migration.

Membership changes use the owner-only `manage_restaurant_member` RPC. Direct member-table writes are not granted to application roles, and the serialized workflow prevents removal or demotion of an organization's final owner while recording each successful change in activity history.

The development seed is explicitly guarded and idempotent. Re-running it fills missing fixed demo fixtures but does not overwrite event, attention, approval, activity, or membership state, so completed demo workflows stay completed.

## Reviews and reputation

Phase 2.2 adds a second provider-neutral boundary: `normalizeRestaurantReview`,
`classifyRestaurantReview`, and the server-only `ingestRestaurantReview` service.
Future Google, delivery-platform, survey, QR-feedback, and manual-entry adapters
must translate provider payloads into this contract. Core logic does not contain
provider authentication or provider-specific behavior.

Ratings and deterministic keyword rules are authoritative for sentiment, topics,
severity, and handling. A positive review is recorded without attention. A medium
negative review creates attention plus a proposed `customer_response` in the
existing approval queue. High or critical risk language creates a HUMAN escalation
and deliberately omits a response draft. Approval records only internal approval;
no Phase 2.2 code publishes a reply.

`restaurant_reviews` keeps provider identifiers, rating, original text,
classification, deduplication, and response history while linking one-to-one to the
generic operational event. Four negative mentions of the same non-`other` topic at
one branch within seven days create a reputation trend attention event. An existing
open or assigned alert for that branch/topic is reused, preventing duplicate active
alerts.
