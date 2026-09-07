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
      <span className="nexus-subtle w-[7.25rem] shrink-0">{label}</span>
      <span className="nexus-copy">{values.join(" · ")}</span>
    </div>
  );
}
