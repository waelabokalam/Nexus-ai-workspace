"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

type RestaurantSubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  name?: string;
  value?: string;
};

export default function RestaurantSubmitButton({
  children,
  pendingLabel = "Saving…",
  className,
  name,
  value,
}: RestaurantSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className={cn(
        "nexus-focus inline-flex min-h-8 items-center justify-center rounded-lg border border-white/[0.1] px-3 text-xs font-medium text-zinc-200 transition-colors hover:border-white/[0.2] hover:bg-white/[0.07] hover:text-white disabled:cursor-wait disabled:opacity-55 light:border-black/[0.12] light:text-zinc-700 light:hover:border-black/[0.2] light:hover:bg-black/[0.05] light:hover:text-zinc-950",
        className,
      )}
      disabled={pending}
      name={name}
      type="submit"
      value={value}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
