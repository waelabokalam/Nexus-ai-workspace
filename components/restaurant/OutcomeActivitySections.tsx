import { Building2, CheckCircle2, Clock3, Sparkles } from "lucide-react";

import {
  branchLabel,
  EmptyState,
  formatMoment,
  humanize,
  type CommandCenterData,
} from "@/components/restaurant/command-center-presentation";

export default function OutcomeActivitySections({ data }: { data: CommandCenterData }) {
  const { organization } = data;

  return (
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
  );
}
