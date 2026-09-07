"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Industry } from "@/lib/sales-lead";

type TrackedContactLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  industry?: Industry;
};

export default function TrackedContactLink({ industry, ...props }: TrackedContactLinkProps) {
  const pathname = usePathname();
  const params = new URLSearchParams({ source_page: pathname });
  if (industry) params.set("industry", industry);
  return <Link {...props} href={`/contact?${params.toString()}`} />;
}
