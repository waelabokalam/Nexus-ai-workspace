import type { ReactNode } from "react";

import type { getRestaurantCommandCenter } from "@/lib/restaurant/command-center/service";
import type {
  Json,
  RestaurantEventRow,
  RestaurantSeverity,
} from "@/lib/supabase/database.types";

export type CommandCenterData = Awaited<
  ReturnType<typeof getRestaurantCommandCenter>
>;

export const priorityStyles: Record<RestaurantSeverity, string> = {
  info: "border-sky-400/20 bg-sky-400/[0.08] text-sky-300 light:text-sky-700",
  low: "border-zinc-400/20 bg-zinc-400/[0.08] text-zinc-300 light:text-zinc-700",
  medium: "border-amber-400/20 bg-amber-400/[0.08] text-amber-300 light:text-amber-700",
  high: "border-orange-400/20 bg-orange-400/[0.08] text-orange-300 light:text-orange-700",
  critical: "border-red-400/20 bg-red-400/[0.08] text-red-300 light:text-red-700",
};

export function humanize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function jsonRecord(value: Json): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function displayValue(value: Json | undefined) {
  if (value === undefined || value === null) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function formatMoment(value: string, locale: string, timeZone: string) {
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

export function formatWorkspaceDate(value: string, locale: string) {
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

export function formatMoney(value: number, currency: string, locale: string) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export function branchLabel(
  branches: CommandCenterData["branches"],
  branchId: string | null,
) {
  if (!branchId) return "All branches";
  return branches.find((branch) => branch.id === branchId)?.name ?? "Branch";
}

export function RelatedEvent({
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

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-white/[0.1] px-5 py-10 text-center text-sm text-zinc-500 light:border-black/[0.12]">
      {children}
    </div>
  );
}
