type CapabilityChipProps = {
  children: string;
};

export default function CapabilityChip({ children }: CapabilityChipProps) {
  return (
    <span className="nexus-status rounded-full px-2.5 py-1 text-[11px] font-medium tracking-[0.01em]">
      {children}
    </span>
  );
}
