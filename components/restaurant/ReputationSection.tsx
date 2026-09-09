import { MessageSquareText, Star } from "lucide-react";

import {
  branchLabel,
  EmptyState,
  formatMoment,
  humanize,
  priorityStyles,
  type CommandCenterData,
} from "@/components/restaurant/command-center-presentation";

export default function ReputationSection({ data }: { data: CommandCenterData }) {
  const activeAttentionEventIds = new Set(
    data.attentionItems
      .map((item) => item.event_id)
      .filter((eventId): eventId is string => Boolean(eventId)),
  );

  return (
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
                <time className="text-xs text-zinc-500">{formatMoment(review.reviewed_at, data.organization.default_locale, data.timeZone)}</time>
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
  );
}
