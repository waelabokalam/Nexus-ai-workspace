type CapabilityChipProps = {
  children: string;
};

export default function CapabilityChip({ children }: CapabilityChipProps) {
  return (
    <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-[11px] font-medium tracking-[0.01em] text-zinc-400">
      {children}
    </span>
  );
}
