import type { DemoIconName } from "@/data/demos";
import type { ReactNode } from "react";

type DemoScenarioIconProps = {
  icon: DemoIconName;
  className?: string;
};

const strokeProps = {
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 2,
};

export default function DemoScenarioIcon({
  icon,
  className,
}: DemoScenarioIconProps) {
  const shapes = {
    "customer-support": (
      <>
        <circle cx="12" cy="12" r="2.5" {...strokeProps} />
        <circle cx="5" cy="8" fill="currentColor" r="1.5" />
        <circle cx="19" cy="8" fill="currentColor" r="1.5" />
        <path d="M7 9.2 10 10.8M17 9.2 14 10.8M8 17c1.1 1.5 2.4 2.2 4 2.2s2.9-.7 4-2.2" {...strokeProps} />
      </>
    ),
    restaurant: (
      <>
        <circle cx="12" cy="12" r="2.5" {...strokeProps} />
        <path d="M5 8.5C7 5.8 9.3 4.5 12 4.5s5 .9 7 3.5M5 15.5c2 2.7 4.3 4 7 4s5-.9 7-4M7.5 10.3 10 11.2M16.5 10.3 14 11.2" {...strokeProps} />
      </>
    ),
    healthcare: (
      <>
        <circle cx="12" cy="12" r="2.5" {...strokeProps} />
        <circle cx="6" cy="6" fill="currentColor" r="1.5" />
        <circle cx="18" cy="18" fill="currentColor" r="1.5" />
        <path d="M7.5 7.5 10.2 10.2M13.8 13.8l2.7 2.7M18 6v4M16 8h4" {...strokeProps} />
      </>
    ),
    "real-estate": (
      <>
        <circle cx="12" cy="12" r="2.5" {...strokeProps} />
        <path d="M4.5 11.2 12 5l7.5 6.2M6.5 10.5v7h11v-7M10 17.5V14h4v3.5" {...strokeProps} />
      </>
    ),
    "custom-business": (
      <>
        <circle cx="12" cy="12" r="2.5" {...strokeProps} />
        <circle cx="5.5" cy="8" fill="currentColor" r="1.5" />
        <circle cx="18.5" cy="8" fill="currentColor" r="1.5" />
        <circle cx="12" cy="19" fill="currentColor" r="1.5" />
        <path d="m7 9.1 3.1 1.7m6.9-1.7-3.1 1.7m-1.9 3.7v2.9" {...strokeProps} />
      </>
    ),
  } satisfies Record<DemoIconName, ReactNode>;

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {shapes[icon]}
    </svg>
  );
}
