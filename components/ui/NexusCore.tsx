interface NexusCoreProps {
  size?: number;
}

export default function NexusCore({
  size = 72,
}: NexusCoreProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
      }}
      className="relative"
    >
      <div className="absolute inset-0 rounded-full bg-white/[0.07] blur-xl" />

      {/* metal sphere */}
      <div
        className="
          absolute
          inset-0
          rounded-full
          border
          border-white/[0.16]
          bg-gradient-to-b from-white/[0.2] to-white/[0.04]
          shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_12px_32px_rgba(0,0,0,0.25)]
        "
      />

      <div className="absolute left-[22%] top-[18%] h-[16%] w-[42%] rounded-full bg-white/25 blur-md" />

      {/* engraved N */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="
            font-heading
            text-xl
            font-semibold
            tracking-tight
            text-white/90
          "
        >
          N
        </span>
      </div>
    </div>
  );
}
