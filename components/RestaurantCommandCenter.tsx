import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Star,
  SunMedium,
  Sparkles,
  UserRoundCheck,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";

import {
  processApprovalAction,
  updateAttentionAction,
} from "@/app/restaurant/actions";
import RestaurantSubmitButton from "@/components/RestaurantSubmitButton";
import ThemeToggle from "@/components/ThemeToggle";
import NexusCore from "@/components/ui/NexusCore";
import { signOutRestaurant } from "@/lib/restaurant/auth-actions";
import type { getRestaurantCommandCenter } from "@/lib/restaurant/services";
import type {
  Json,
  ManagerAttentionItemRow,
  RestaurantEventRow,
  RestaurantSeverity,
} from "@/lib/supabase/database.types";

type CommandCenterData = Awaited<ReturnType<typeof getRestaurantCommandCenter>>;

const priorityStyles: Record<RestaurantSeverity, string> = {
  info: "border-sky-400/20 bg-sky-400/[0.08] text-sky-300 light:text-sky-700",
  low: "border-zinc-400/20 bg-zinc-400/[0.08] text-zinc-300 light:text-zinc-700",
  medium: "border-amber-400/20 bg-amber-400/[0.08] text-amber-300 light:text-amber-700",
  high: "border-orange-400/20 bg-orange-400/[0.08] text-orange-300 light:text-orange-700",
  critical: "border-red-400/20 bg-red-400/[0.08] text-red-300 light:text-red-700",
};

function humanize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function jsonRecord(value: Json): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function displayValue(value: Json | undefined) {
  if (value === undefined || value === null) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function formatMoment(value: string, locale: string, timeZone: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return new Intl.DateTimeFormat("en", {
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }
}

function formatWorkspaceDate(value: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${value}T12:00:00Z`));
  } catch {
    return value;
  }
}

function branchLabel(
  branches: CommandCenterData["branches"],
  branchId: string | null,
) {
  if (!branchId) return "All branches";
  return branches.find((branch) => branch.id === branchId)?.name ?? "Branch";
}

function RelatedEvent({
  event,
  locale,
  timeZone,
}: {
  event?: RestaurantEventRow;
  locale: string;
  timeZone: string;
}) {
  if (!event) return null;
  return (
    <div className="mt-4 grid gap-3 rounded-xl border border-white/[0.08] bg-black/10 p-4 text-sm light:border-black/[0.09] light:bg-black/[0.025] sm:grid-cols-[1fr_auto]">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Related event
        </p>
        <p className="mt-1.5 font-medium text-zinc-200 light:text-zinc-800">{event.title}</p>
        <p className="mt-1 leading-5 text-zinc-400 light:text-zinc-600">{event.summary}</p>
      </div>
      <div className="text-left text-xs text-zinc-500 sm:text-right">
        <p>{humanize(event.source)}</p>
        <p className="mt-1">{formatMoment(event.occurred_at, locale, timeZone)}</p>
      </div>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-white/[0.1] px-5 py-10 text-center text-sm text-zinc-500 light:border-black/[0.12]">
      {children}
    </div>
  );
}

function AttentionActions({
  item,
  organizationId,
  currentUserId,
}: {
  item: ManagerAttentionItemRow;
  organizationId: string;
  currentUserId: string;
}) {
  const hidden = (
    <>
      <input name="organizationId" type="hidden" value={organizationId} />
      <input name="attentionId" type="hidden" value={item.id} />
    </>
  );

  return (
    <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.07] pt-4 light:border-black/[0.08]">
      {item.assigned_to ? (
        <form action={updateAttentionAction}>
          {hidden}
          <input name="status" type="hidden" value="open" />
          <RestaurantSubmitButton pendingLabel="Unassigning…">Unassign</RestaurantSubmitButton>
        </form>
      ) : (
        <form action={updateAttentionAction}>
          {hidden}
          <input name="status" type="hidden" value="assigned" />
          <input name="assignedTo" type="hidden" value={currentUserId} />
          <RestaurantSubmitButton pendingLabel="Assigning…">
            <UserRoundCheck aria-hidden="true" className="mr-1.5 size-3.5" />
            Assign to me
          </RestaurantSubmitButton>
        </form>
      )}
      <form action={updateAttentionAction}>
        {hidden}
        <input name="status" type="hidden" value="resolved" />
        <RestaurantSubmitButton
          className="border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300 hover:bg-emerald-400/[0.14] light:text-emerald-700"
          pendingLabel="Resolving…"
        >
          <CheckCircle2 aria-hidden="true" className="mr-1.5 size-3.5" />
          Resolve
        </RestaurantSubmitButton>
      </form>
      <form action={updateAttentionAction}>
        {hidden}
        <input name="status" type="hidden" value="dismissed" />
        <RestaurantSubmitButton pendingLabel="Dismissing…">Dismiss</RestaurantSubmitButton>
      </form>
    </div>
  );
}

export default function RestaurantCommandCenter({ data }: { data: CommandCenterData }) {
  const { organization, membership, summary } = data;
  const brief = data.dailyBrief;
  const canManage = membership.role === "owner" || membership.role === "manager";
  const eventsById = new Map(data.relatedEvents.map((event) => [event.id, event]));
  const activeAttentionEventIds = new Set(
    data.attentionItems
      .map((item) => item.event_id)
      .filter((eventId): eventId is string => Boolean(eventId)),
  );
  const summaryItems = [
    { label: "Open attention", value: summary.openAttentionItems, icon: AlertTriangle },
    { label: "Waiting approval", value: summary.waitingForApproval, icon: ShieldCheck },
    { label: "Handled by Nexus", value: summary.handledAutomatically, icon: Sparkles },
    { label: "Human escalations", value: summary.humanEscalations, icon: UserRoundCheck },
    { label: "Events today", value: summary.eventsToday, icon: Activity },
  ];

  return (
    <main className="nexus-page min-h-screen flex-1 text-white">
      <a className="nexus-skip-link" href="#command-center-content">Skip to command center</a>

      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#09090B]/90 backdrop-blur-xl light:border-black/[0.09] light:bg-[#f4f4f0]/90">
        <div className="mx-auto flex min-h-16 max-w-[1480px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <NexusCore size={31} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[-0.02em] text-white light:text-zinc-950">
                {organization.name}
              </p>
              <p className="truncate text-[11px] text-zinc-500">
                Nexus Restaurant · {humanize(membership.role)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="max-w-48 truncate text-xs text-zinc-300 light:text-zinc-700">{data.user.email}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-zinc-600">Authenticated</p>
            </div>
            <ThemeToggle />
            <form action={signOutRestaurant}>
              <button className="nexus-focus min-h-9 rounded-lg border border-white/[0.1] px-3 text-xs text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white light:border-black/[0.12] light:text-zinc-700 light:hover:bg-black/[0.05]" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1480px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8" id="command-center-content">
        <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Manager Command Center</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white light:text-zinc-950 sm:text-3xl">Today at a glance</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400 light:text-zinc-600">
              <span>{formatWorkspaceDate(data.localDate, organization.default_locale)}</span>
              <span aria-hidden="true">·</span>
              <span>{data.timeZone}</span>
            </p>
          </div>

          <form className="flex w-full items-center gap-2 lg:w-auto" method="get">
            <label className="sr-only" htmlFor="branch">View branch</label>
            <div className="relative min-w-0 flex-1 lg:min-w-64">
              <MapPin aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <select
                className="nexus-focus min-h-10 w-full appearance-none rounded-xl border border-white/[0.11] bg-white/[0.04] pl-9 pr-9 text-sm text-zinc-200 light:border-black/[0.12] light:bg-white light:text-zinc-800"
                defaultValue={data.selectedBranchId ?? ""}
                id="branch"
                name="branch"
              >
                <option value="">All branches</option>
                {data.branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            </div>
            <button className="nexus-focus nexus-button-secondary min-h-10 rounded-xl px-4 text-sm font-medium" type="submit">Apply</button>
          </form>
        </section>

        <section
          aria-labelledby="daily-manager-brief"
          className="nexus-surface relative mt-7 overflow-hidden rounded-[var(--nexus-radius-surface)] p-5 sm:p-6"
        >
          <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-amber-300/70" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 max-w-3xl">
              <div className="flex items-center gap-2 text-amber-300 light:text-amber-700">
                <SunMedium aria-hidden="true" className="size-4" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">Daily Manager Brief</p>
              </div>
              <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white light:text-zinc-950 sm:text-2xl" id="daily-manager-brief">
                {brief.headline}
              </h2>
              <p className="mt-2 text-xs text-zinc-500">
                {brief.scopeLabel} · {formatWorkspaceDate(brief.generatedForDate, organization.default_locale)}
              </p>

              {brief.priorityItems.length ? (
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {brief.priorityItems.map((item) => (
                    <li className="flex items-start gap-2.5 text-sm leading-5 text-zinc-300 light:text-zinc-700" key={item.kind}>
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 size-2 shrink-0 rounded-full ${
                          item.priority === "critical"
                            ? "bg-red-400"
                            : item.priority === "high"
                              ? "bg-orange-400"
                              : item.priority === "medium"
                                ? "bg-amber-400"
                                : "bg-sky-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-200 light:text-emerald-800">
                  The current persisted view is clear. No operational activity has been recorded today.
                </p>
              )}

              {brief.operationalNotes.length ? (
                <p className="mt-4 text-xs leading-5 text-zinc-500">
                  {brief.operationalNotes.join(" ")}
                </p>
              ) : null}
            </div>

            <dl className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4 lg:w-[31rem]">
              {[
                ["High priority", brief.highPriorityAttentionCount],
                ["Approvals", brief.approvalCount],
                ["Escalations", brief.escalationCount],
                ["Nexus handled", brief.handledCount],
              ].map(([label, value]) => (
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 light:border-black/[0.09] light:bg-black/[0.02]" key={label}>
                  <dt className="text-[10px] leading-4 text-zinc-500">{label}</dt>
                  <dd className="mt-1.5 text-xl font-semibold tabular-nums text-white light:text-zinc-950">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-labelledby="today-summary" className="mt-7">
          <h2 className="sr-only" id="today-summary">Today&apos;s summary</h2>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-5">
            {summaryItems.map((item) => (
              <div className="nexus-card rounded-2xl p-4" key={item.label}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-zinc-500">{item.label}</p>
                  <item.icon aria-hidden="true" className="size-4 text-zinc-500" />
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white light:text-zinc-950">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="reputation-heading"
          className="nexus-card mt-7 rounded-[var(--nexus-radius-surface)] p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">Reputation intelligence</p>
              <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-white light:text-zinc-950" id="reputation-heading">Recent reviews</h2>
              <p className="mt-1 text-xs text-zinc-500">Deterministic classification · Last 7 days · No external replies sent</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/[0.09] px-3 py-1.5 text-xs text-zinc-400 light:border-black/[0.1] light:text-zinc-600">
              <MessageSquareText aria-hidden="true" className="size-3.5" />
              {data.reviews.length} reviews
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {data.reviews.length ? data.reviews.map((review) => {
              const needsAttention = activeAttentionEventIds.has(review.event_id);
              return (
                <article className="rounded-2xl border border-white/[0.085] bg-white/[0.025] p-4 light:border-black/[0.09] light:bg-black/[0.018]" key={review.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-2 py-0.5 text-[10px] font-semibold text-amber-300 light:text-amber-700">
                        <Star aria-hidden="true" className="size-3 fill-current" />
                        {review.rating}/5
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.09em] ${priorityStyles[review.severity]}`}>
                        {review.sentiment}
                      </span>
                      <span className="text-[11px] text-zinc-500">{humanize(review.source)}</span>
                    </div>
                    <time className="text-xs text-zinc-500">{formatMoment(review.reviewed_at, organization.default_locale, data.timeZone)}</time>
                  </div>
                  <p className="mt-3 text-sm font-medium text-zinc-200 light:text-zinc-800">
                    {review.customer_display_name ?? "Anonymous guest"}
                    <span className="font-normal text-zinc-600"> · {branchLabel(data.branches, review.branch_id)}</span>
                  </p>
                  <p className="mt-1.5 line-clamp-3 text-sm leading-5 text-zinc-400 light:text-zinc-600">{review.review_text}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {review.topics.map((topic) => (
                      <span className="rounded-md border border-white/[0.08] bg-black/10 px-2 py-1 text-[10px] text-zinc-500 light:border-black/[0.09] light:bg-black/[0.025]" key={topic}>{humanize(topic)}</span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/[0.07] pt-3 text-[11px] light:border-black/[0.08]">
                    <span className={needsAttention ? "text-orange-300 light:text-orange-700" : "text-zinc-500"}>
                      {needsAttention ? "Needs attention" : "No open attention"}
                    </span>
                    <span className="text-zinc-600">Response: {humanize(review.response_status)}</span>
                  </div>
                  {review.proposed_response ? (
                    <details className="mt-3">
                      <summary className="nexus-focus cursor-pointer list-none rounded-lg text-xs font-medium text-violet-300 light:text-violet-700 [&::-webkit-details-marker]:hidden">
                        {review.response_status === "pending" ? "View proposed response" : "View response record"}
                      </summary>
                      <p className="mt-2 whitespace-pre-wrap rounded-xl border border-violet-400/15 bg-violet-400/[0.05] p-3 text-xs leading-5 text-zinc-300 light:text-zinc-700">
                        {review.approved_response ?? review.proposed_response}
                      </p>
                    </details>
                  ) : null}
                </article>
              );
            }) : <div className="lg:col-span-2"><EmptyState>No reviews recorded for this 7-day view.</EmptyState></div>}
          </div>
        </section>

        <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <div className="space-y-6">
            <section className="nexus-card rounded-[var(--nexus-radius-surface)] p-4 sm:p-5" aria-labelledby="attention-heading">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">Queue</p>
                  <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-white light:text-zinc-950" id="attention-heading">Needs attention</h2>
                </div>
                <span className="rounded-full border border-white/[0.09] px-2.5 py-1 text-xs text-zinc-400 light:border-black/[0.1] light:text-zinc-600">{data.attentionItems.length} open</span>
              </div>

              <div className="mt-4 space-y-2.5">
                {data.attentionItems.length ? data.attentionItems.map((item) => {
                  const relatedEvent = item.event_id ? eventsById.get(item.event_id) : undefined;
                  return (
                    <details className="group rounded-2xl border border-white/[0.085] bg-white/[0.025] p-4 open:bg-white/[0.04] light:border-black/[0.09] light:bg-black/[0.018]" key={item.id}>
                      <summary className="nexus-focus -m-1 flex cursor-pointer list-none items-start justify-between gap-4 rounded-lg p-1 [&::-webkit-details-marker]:hidden">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${priorityStyles[item.priority]}`}>{item.priority}</span>
                            <span className="text-[11px] text-zinc-500">{humanize(item.category)}</span>
                            <span className="text-[11px] text-zinc-600">{branchLabel(data.branches, item.branch_id)}</span>
                          </div>
                          <h3 className="mt-2.5 font-medium text-zinc-100 light:text-zinc-900">{item.title}</h3>
                          <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-400 light:text-zinc-600">{item.summary}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 text-xs text-zinc-500">
                          <span>{formatMoment(item.created_at, organization.default_locale, data.timeZone)}</span>
                          <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
                        </div>
                      </summary>
                      <RelatedEvent event={relatedEvent} locale={organization.default_locale} timeZone={data.timeZone} />
                      {canManage ? (
                        <AttentionActions currentUserId={data.user.id} item={item} organizationId={organization.id} />
                      ) : (
                        <p className="mt-4 border-t border-white/[0.07] pt-4 text-xs text-zinc-500 light:border-black/[0.08]">Managers can assign or close attention items.</p>
                      )}
                    </details>
                  );
                }) : <EmptyState>No open attention items for this view.</EmptyState>}
              </div>
            </section>

            <section className="nexus-card rounded-[var(--nexus-radius-surface)] p-4 sm:p-5" aria-labelledby="approval-heading">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">Decision queue</p>
                  <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-white light:text-zinc-950" id="approval-heading">Waiting for approval</h2>
                </div>
                <ShieldCheck aria-hidden="true" className="size-5 text-zinc-500" />
              </div>

              <div className="mt-4 space-y-3">
                {data.approvals.length ? data.approvals.map((approval) => {
                  const action = jsonRecord(approval.proposed_action);
                  const relatedEvent = approval.event_id ? eventsById.get(approval.event_id) : undefined;
                  return (
                    <article className="rounded-2xl border border-white/[0.085] bg-white/[0.025] p-4 light:border-black/[0.09] light:bg-black/[0.018]" key={approval.id}>
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                            <span className="rounded-full border border-violet-400/20 bg-violet-400/[0.08] px-2 py-0.5 font-semibold uppercase tracking-[0.1em] text-violet-300 light:text-violet-700">Pending</span>
                            <span>{humanize(approval.action_type)}</span>
                            <span>{branchLabel(data.branches, approval.branch_id)}</span>
                          </div>
                          <h3 className="mt-2.5 font-medium text-zinc-100 light:text-zinc-900">{approval.title}</h3>
                          <p className="mt-1 text-sm leading-5 text-zinc-400 light:text-zinc-600">{approval.summary}</p>
                        </div>
                        <time className="shrink-0 text-xs text-zinc-500">{formatMoment(approval.requested_at, organization.default_locale, data.timeZone)}</time>
                      </div>

                      {Object.keys(action).length ? (
                        <dl className="mt-4 grid gap-2 rounded-xl border border-white/[0.07] bg-black/10 p-3 text-xs light:border-black/[0.08] light:bg-black/[0.025] sm:grid-cols-2">
                          {Object.entries(action).map(([key, value]) => (
                            <div className={key === "message" || key === "reason" ? "sm:col-span-2" : ""} key={key}>
                              <dt className="text-zinc-500">{humanize(key)}</dt>
                              <dd className="mt-1 whitespace-pre-wrap leading-5 text-zinc-300 light:text-zinc-700">{displayValue(value)}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}
                      <RelatedEvent event={relatedEvent} locale={organization.default_locale} timeZone={data.timeZone} />

                      {canManage ? (
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.07] pt-4 light:border-black/[0.08]">
                          <form action={processApprovalAction}>
                            <input name="organizationId" type="hidden" value={organization.id} />
                            <input name="approvalId" type="hidden" value={approval.id} />
                            <input name="decision" type="hidden" value="approved" />
                            <RestaurantSubmitButton className="border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300 hover:bg-emerald-400/[0.14] light:text-emerald-700" pendingLabel="Approving…">
                              <CheckCircle2 aria-hidden="true" className="mr-1.5 size-3.5" />Approve
                            </RestaurantSubmitButton>
                          </form>
                          <form action={processApprovalAction}>
                            <input name="organizationId" type="hidden" value={organization.id} />
                            <input name="approvalId" type="hidden" value={approval.id} />
                            <input name="decision" type="hidden" value="rejected" />
                            <RestaurantSubmitButton className="border-red-400/20 bg-red-400/[0.07] text-red-300 hover:bg-red-400/[0.12] light:text-red-700" pendingLabel="Rejecting…">
                              <XCircle aria-hidden="true" className="mr-1.5 size-3.5" />Reject
                            </RestaurantSubmitButton>
                          </form>
                          <details className="w-full pt-1">
                            <summary className="nexus-focus inline-flex cursor-pointer list-none rounded-lg border border-white/[0.1] px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-white/[0.06] light:border-black/[0.12] light:text-zinc-700 [&::-webkit-details-marker]:hidden">Edit proposal</summary>
                            <form action={processApprovalAction} className="mt-3 grid gap-3 rounded-xl border border-white/[0.08] bg-black/10 p-3 light:border-black/[0.09] light:bg-black/[0.025]">
                              <input name="organizationId" type="hidden" value={organization.id} />
                              <input name="approvalId" type="hidden" value={approval.id} />
                              <input name="decision" type="hidden" value="edited" />
                              <input name="editedActionJson" type="hidden" value={JSON.stringify(approval.proposed_action)} />
                              <label className="text-xs font-medium text-zinc-300 light:text-zinc-700" htmlFor={`edited-message-${approval.id}`}>Edited action message</label>
                              <textarea
                                className="nexus-focus min-h-24 rounded-xl border border-white/[0.1] bg-white/[0.035] p-3 text-sm text-zinc-100 light:border-black/[0.12] light:bg-white light:text-zinc-900"
                                defaultValue={typeof action.message === "string" ? action.message : ""}
                                id={`edited-message-${approval.id}`}
                                maxLength={4000}
                                name="editedMessage"
                                placeholder="Describe the manager-approved edit"
                                required
                              />
                              <label className="text-xs font-medium text-zinc-300 light:text-zinc-700" htmlFor={`reviewer-note-${approval.id}`}>Reviewer note <span className="font-normal text-zinc-500">(optional)</span></label>
                              <input
                                className="nexus-focus min-h-10 rounded-xl border border-white/[0.1] bg-white/[0.035] px-3 text-sm text-zinc-100 light:border-black/[0.12] light:bg-white light:text-zinc-900"
                                id={`reviewer-note-${approval.id}`}
                                maxLength={2000}
                                name="reviewerNote"
                                placeholder="Why was this changed?"
                              />
                              <RestaurantSubmitButton className="justify-self-start" pendingLabel="Saving decision…">Save edit and approve</RestaurantSubmitButton>
                            </form>
                          </details>
                        </div>
                      ) : (
                        <p className="mt-4 border-t border-white/[0.07] pt-4 text-xs text-zinc-500 light:border-black/[0.08]">Managers can approve, edit, or reject proposed actions.</p>
                      )}
                    </article>
                  );
                }) : <EmptyState>No manager approvals are waiting.</EmptyState>}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="nexus-card rounded-[var(--nexus-radius-surface)] p-4 sm:p-5" aria-labelledby="handled-heading">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">Recent outcomes</p>
                  <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-white light:text-zinc-950" id="handled-heading">Nexus handled</h2>
                </div>
                <Sparkles aria-hidden="true" className="size-5 text-zinc-500" />
              </div>
              <div className="mt-4 divide-y divide-white/[0.07] light:divide-black/[0.08]">
                {data.handledEvents.length ? data.handledEvents.map((event) => (
                  <div className="flex gap-3 py-3 first:pt-0 last:pb-0" key={event.id}>
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300 light:text-emerald-700">
                      <CheckCircle2 aria-hidden="true" className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">{event.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{event.summary}</p>
                      <p className="mt-1.5 text-[10px] uppercase tracking-[0.1em] text-zinc-600">{branchLabel(data.branches, event.branch_id)} · {formatMoment(event.occurred_at, organization.default_locale, data.timeZone)}</p>
                    </div>
                  </div>
                )) : <EmptyState>No automatic outcomes recorded today.</EmptyState>}
              </div>
            </section>

            <section className="nexus-card rounded-[var(--nexus-radius-surface)] p-4 sm:p-5" aria-labelledby="activity-heading">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">Audit history</p>
                  <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-white light:text-zinc-950" id="activity-heading">Activity</h2>
                </div>
                <Clock3 aria-hidden="true" className="size-5 text-zinc-500" />
              </div>
              <ol className="mt-5 space-y-0">
                {data.activity.length ? data.activity.map((entry, index) => (
                  <li className="relative grid grid-cols-[3.25rem_1rem_1fr] gap-2 pb-5 last:pb-0" key={entry.id}>
                    <time className="pt-0.5 text-[11px] tabular-nums text-zinc-500">{formatMoment(entry.created_at, organization.default_locale, data.timeZone)}</time>
                    <div className="relative flex justify-center">
                      {index < data.activity.length - 1 ? <span aria-hidden="true" className="absolute bottom-[-1.25rem] top-3 w-px bg-white/[0.08] light:bg-black/[0.1]" /> : null}
                      <span className="relative mt-1 size-2 rounded-full border border-zinc-500 bg-[#111113] light:bg-white" />
                    </div>
                    <div>
                      <p className="text-sm leading-5 text-zinc-300 light:text-zinc-700">{entry.description}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-zinc-600">{humanize(entry.actor_type)} · {branchLabel(data.branches, entry.branch_id)}</p>
                    </div>
                  </li>
                )) : <EmptyState>No activity has been recorded yet.</EmptyState>}
              </ol>
            </section>

            <section className="rounded-2xl border border-white/[0.075] bg-white/[0.02] p-4 text-xs leading-5 text-zinc-500 light:border-black/[0.09] light:bg-black/[0.018]">
              <div className="flex items-start gap-3">
                <Building2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <p>
                  Viewing <span className="font-medium text-zinc-300 light:text-zinc-700">{branchLabel(data.branches, data.selectedBranchId)}</span>. Organization-wide events remain visible when they apply to every location.
                </p>
              </div>
            </section>
          </div>
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] py-5 text-[11px] text-zinc-600 light:border-black/[0.09]">
          <p className="flex items-center gap-2"><UtensilsCrossed aria-hidden="true" className="size-3.5" />Nexus Restaurant V1</p>
          <p>Persisted operational data · External review responses are not published</p>
        </footer>
      </div>
    </main>
  );
}
