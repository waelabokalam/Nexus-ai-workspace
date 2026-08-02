type DemoMetadataRowProps = {
  label: string;
  values: string[];
};

export default function DemoMetadataRow({
  label,
  values,
}: DemoMetadataRowProps) {
  return (
    <div className="flex items-start gap-3 text-xs leading-5">
      <span className="w-[7.25rem] shrink-0 text-zinc-600">{label}</span>
      <span className="text-zinc-400">{values.join(" · ")}</span>
    </div>
  );
}
