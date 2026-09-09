import { SunMedium } from "lucide-react";

import {
  formatWorkspaceDate,
  type CommandCenterData,
} from "@/components/restaurant/command-center-presentation";

export default function DailyManagerBriefSection({
  data,
}: {
  data: CommandCenterData;
}) {
  const brief = data.dailyBrief;

  return (
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
            {brief.scopeLabel} · {formatWorkspaceDate(brief.generatedForDate, data.organization.default_locale)}
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
  );
}
