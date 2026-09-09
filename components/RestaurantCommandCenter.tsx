import {
  Activity,
  AlertTriangle,
  ChevronDown,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  UtensilsCrossed,
} from "lucide-react";

import DailyManagerBriefSection from "@/components/restaurant/DailyManagerBriefSection";
import OutcomeActivitySections from "@/components/restaurant/OutcomeActivitySections";
import ReputationSection from "@/components/restaurant/ReputationSection";
import SupplierInvoicesSection from "@/components/restaurant/SupplierInvoicesSection";
import WorkQueues from "@/components/restaurant/WorkQueues";
import {
  formatWorkspaceDate,
  humanize,
  type CommandCenterData,
} from "@/components/restaurant/command-center-presentation";
import ThemeToggle from "@/components/ThemeToggle";
import NexusCore from "@/components/ui/NexusCore";
import { signOutRestaurant } from "@/lib/restaurant/auth-actions";

export default function RestaurantCommandCenter({ data }: { data: CommandCenterData }) {
  const { organization, membership, summary } = data;
  const canManage = membership.role === "owner" || membership.role === "manager";
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

        <DailyManagerBriefSection data={data} />

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

        <SupplierInvoicesSection canManage={canManage} data={data} />
        <ReputationSection data={data} />

        <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <WorkQueues canManage={canManage} data={data} />
          <OutcomeActivitySections data={data} />
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] py-5 text-[11px] text-zinc-600 light:border-black/[0.09]">
          <p className="flex items-center gap-2"><UtensilsCrossed aria-hidden="true" className="size-3.5" />Nexus Restaurant V1</p>
          <p>Persisted operational data · External review responses are not published</p>
        </footer>
      </div>
    </main>
  );
}
