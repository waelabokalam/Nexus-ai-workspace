# Restaurant V1 architecture

Restaurant V1 lives in this Next.js/Supabase repository. The separate
`nexus-backend` repository owns conversational AI, RAG, memory, scheduling, and
model orchestration; Restaurant code and the invoice OCR worker do not belong
there.

## Module ownership

- `auth.ts` owns authenticated organization membership and role checks.
- `core/operations.ts` owns generic event ingestion, attention, approvals,
  membership management, and activity workflows.
- `core/data-access.ts` contains the database error and branch-query helpers
  genuinely shared by multiple server-side modules.
- `command-center/service.ts` authorizes and loads the persisted read model,
  then composes feature data without owning feature rules.
- `summary.ts` contains pure, feature-neutral operational selection and summary
  calculations.
- `daily-brief.ts` owns Daily Manager Brief types, prioritization, feature-fact
  aggregation, headline construction, and operational notes.
- `reputation.ts` owns pure review normalization, classification, topic rules,
  severity, and trend detection. `reputation/service.ts` owns authenticated
  review persistence, while `reputation/brief-facts.ts` exposes only the facts
  needed by Daily Brief.
- `invoices.ts` owns extraction contracts, normalization, matching, price rules,
  total anomalies, and manual extraction. `paddle-invoice.ts` is the server-only
  automatic extraction adapter and deterministic OCR parser.
- `invoice-services.ts` owns the authenticated invoice workflow, private
  storage, matching/history queries, persistence, review, and signed downloads.
  `invoices/brief-facts.ts` exposes invoice review/anomaly counts without leaking
  those rules into Daily Brief.
- `services.ts` is a compatibility facade for existing callers; new internal
  code should import the owning module directly.

React components do not query Supabase. `RestaurantCommandCenter.tsx` composes
the page shell and feature sections under `components/restaurant/`. Server
actions call the owning application service, which performs authorization before
database access. Pure rules remain callable from tests without React or network
access.

## Core event boundary

The provider-neutral boundary is `normalizeRestaurantEvent` followed by the
server-only `ingestRestaurantEvent`. A future integration translates its payload
into that contract after an outcome is known; it must not write event,
attention, approval, or activity tables individually. The existing database RPC
creates those records atomically.

Provider IDs and safe payload fragments belong in `sourceReference`,
`dedupeKey`, and allowlisted `structuredData`. Credentials, prompts, reasoning
traces, and unrelated customer data do not. Deterministic Restaurant rules remain
the source of handling and status decisions.

All reads and writes require authenticated organization membership. Browser
organization and branch IDs are validated server-side and independently enforced
by RLS/RPC authorization. Service-role credentials are server-only and must never
use a `NEXT_PUBLIC_` name.

## Daily Manager Brief

The brief consumes normalized operational rows plus review and invoice facts. It
does not ingest reviews, classify reputation, match suppliers, or calculate price
changes. Reputation and Invoice modules remain independent of the brief.

## Reviews and reputation

Future review-provider adapters normalize into `normalizeRestaurantReview` and
`classifyRestaurantReview`, then use `ingestRestaurantReview`. Core logic contains
no provider authentication.

Ratings and deterministic terms decide sentiment, topics, severity, and
handling. Medium negative reviews create attention and a proposed response in the
existing approval queue. High/critical risk creates a HUMAN escalation without a
response draft. Approval records an internal decision only; Restaurant V1 does
not publish external replies.

Repeated negative topics use the existing seven-day threshold and reuse an open
branch/topic alert instead of duplicating it.

## Supplier invoices and OCR

`SupplierInvoiceExtractor` is the provider-neutral extraction boundary.
`ManualSupplierInvoiceExtractor` and `PaddleSupplierInvoiceExtractor` implement
the same contract. The Paddle adapter sends a private file from an authenticated
server route to the isolated FastAPI/PP-StructureV3 worker in
`services/invoice-ocr`; application and domain code do not import PaddleOCR.

Automatic extraction creates an editable draft only. After manager correction,
`ReviewedPaddleDraftSupplierInvoiceExtractor` sends the normalized result through
the existing validation, matching, persistence, event, anomaly, and review flow.
The manual fallback remains available.

Supplier and item matching auto-links exact deterministic normalizations only.
Ambiguous names, incompatible units, material price changes, currency changes,
and total mismatches remain reviewable. Invoice workflows do not perform
purchasing, accounting, inventory, payment, or menu-price actions.

## Adding a future integration

Add a provider adapter at the edge, normalize its data into a stable Restaurant
contract, and call the owning application service. Add provider-neutral facts to
the Command Center read model only when the UI or Daily Brief needs them. Do not
put delivery/POS behavior inside Reputation, Invoice, or Daily Brief modules, and
do not bypass core authorization, RLS, or atomic workflow RPCs.
