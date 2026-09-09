import { CheckCircle2, ChevronDown, ShieldCheck, UserRoundCheck, XCircle } from "lucide-react";

import {
  processApprovalAction,
  updateAttentionAction,
} from "@/app/restaurant/actions";
import RestaurantSubmitButton from "@/components/RestaurantSubmitButton";
import {
  branchLabel,
  displayValue,
  EmptyState,
  formatMoment,
  humanize,
  jsonRecord,
  priorityStyles,
  RelatedEvent,
  type CommandCenterData,
} from "@/components/restaurant/command-center-presentation";
import type { ManagerAttentionItemRow } from "@/lib/supabase/database.types";

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

function AttentionSection({ canManage, data }: { canManage: boolean; data: CommandCenterData }) {
  const eventsById = new Map(data.relatedEvents.map((event) => [event.id, event]));

  return (
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
                  <span>{formatMoment(item.created_at, data.organization.default_locale, data.timeZone)}</span>
                  <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
                </div>
              </summary>
              <RelatedEvent event={relatedEvent} locale={data.organization.default_locale} timeZone={data.timeZone} />
              {canManage ? (
                <AttentionActions currentUserId={data.user.id} item={item} organizationId={data.organization.id} />
              ) : (
                <p className="mt-4 border-t border-white/[0.07] pt-4 text-xs text-zinc-500 light:border-black/[0.08]">Managers can assign or close attention items.</p>
              )}
            </details>
          );
        }) : <EmptyState>No open attention items for this view.</EmptyState>}
      </div>
    </section>
  );
}

function ApprovalSection({ canManage, data }: { canManage: boolean; data: CommandCenterData }) {
  const eventsById = new Map(data.relatedEvents.map((event) => [event.id, event]));

  return (
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
                <time className="shrink-0 text-xs text-zinc-500">{formatMoment(approval.requested_at, data.organization.default_locale, data.timeZone)}</time>
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
              <RelatedEvent event={relatedEvent} locale={data.organization.default_locale} timeZone={data.timeZone} />

              {canManage ? (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.07] pt-4 light:border-black/[0.08]">
                  <form action={processApprovalAction}>
                    <input name="organizationId" type="hidden" value={data.organization.id} />
                    <input name="approvalId" type="hidden" value={approval.id} />
                    <input name="decision" type="hidden" value="approved" />
                    <RestaurantSubmitButton className="border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300 hover:bg-emerald-400/[0.14] light:text-emerald-700" pendingLabel="Approving…">
                      <CheckCircle2 aria-hidden="true" className="mr-1.5 size-3.5" />Approve
                    </RestaurantSubmitButton>
                  </form>
                  <form action={processApprovalAction}>
                    <input name="organizationId" type="hidden" value={data.organization.id} />
                    <input name="approvalId" type="hidden" value={approval.id} />
                    <input name="decision" type="hidden" value="rejected" />
                    <RestaurantSubmitButton className="border-red-400/20 bg-red-400/[0.07] text-red-300 hover:bg-red-400/[0.12] light:text-red-700" pendingLabel="Rejecting…">
                      <XCircle aria-hidden="true" className="mr-1.5 size-3.5" />Reject
                    </RestaurantSubmitButton>
                  </form>
                  <details className="w-full pt-1">
                    <summary className="nexus-focus inline-flex cursor-pointer list-none rounded-lg border border-white/[0.1] px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-white/[0.06] light:border-black/[0.12] light:text-zinc-700 [&::-webkit-details-marker]:hidden">Edit proposal</summary>
                    <form action={processApprovalAction} className="mt-3 grid gap-3 rounded-xl border border-white/[0.08] bg-black/10 p-3 light:border-black/[0.09] light:bg-black/[0.025]">
                      <input name="organizationId" type="hidden" value={data.organization.id} />
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
  );
}

export default function WorkQueues({ canManage, data }: { canManage: boolean; data: CommandCenterData }) {
  return (
    <div className="space-y-6">
      <AttentionSection canManage={canManage} data={data} />
      <ApprovalSection canManage={canManage} data={data} />
    </div>
  );
}
