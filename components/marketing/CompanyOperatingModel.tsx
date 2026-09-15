import {
  ArrowDown,
  Camera,
  Check,
  Inbox,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import TqMonogram from "@/components/ui/TqMonogram";
import { homeEn, type OperatingModelCopy } from "@/lib/i18n/home";

const signalIcons = [MessageSquareText, ReceiptText, Inbox, Camera] as const;
const routeIcons = [Check, ShieldCheck, UserRound] as const;

export default function CompanyOperatingModel({ t = homeEn.operatingModel }: { t?: OperatingModelCopy }) {
  const signals = t.signals.map((label, index) => ({ label, icon: signalIcons[index] }));
  const routes = t.routes.map((route, index) => ({ ...route, icon: routeIcons[index] }));
  return (
    <div className="nexus-surface relative overflow-hidden rounded-[var(--nexus-radius-surface)] p-4 sm:p-5" aria-label={t.title}>
      <div className="flex items-center justify-between gap-4 border-b border-[var(--nexus-border)] pb-4">
        <p className="nexus-heading text-sm font-medium">{t.title}</p>
        <p className="nexus-subtle text-xs">{t.subtitle}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {signals.map(({ label, icon: Icon }) => (
          <div className="nexus-control flex min-h-16 items-center gap-3 rounded-[var(--nexus-radius-control)] px-3" key={label}>
            <Icon aria-hidden="true" className="nexus-subtle size-4 shrink-0" strokeWidth={1.6} />
            <span className="nexus-copy text-xs leading-5">{label}</span>
          </div>
        ))}
      </div>

      <div className="relative my-4 flex items-center justify-center py-2">
        <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-[var(--nexus-border)]" />
        <div className="relative flex items-center gap-3 rounded-[var(--nexus-radius-control)] border border-[var(--nexus-border)] bg-[var(--nexus-surface)] px-4 py-3">
          <TqMonogram size={28} />
          <div>
            <p className="nexus-heading text-sm font-semibold">{t.name}</p>
            <p className="nexus-subtle mt-0.5 text-[11px]">{t.tagline}</p>
          </div>
        </div>
        <ArrowDown aria-hidden="true" className="nexus-subtle absolute -bottom-2 size-4" strokeWidth={1.6} />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {routes.map(({ label, detail, icon: Icon }) => (
          <div className="rounded-[var(--nexus-radius-control)] border border-[var(--nexus-border)] px-3 py-3" key={label}>
            <Icon aria-hidden="true" className="nexus-heading size-4" strokeWidth={1.6} />
            <p className="nexus-heading mt-3 text-xs font-medium">{label}</p>
            <p className="nexus-subtle mt-1 text-[11px] leading-4">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
