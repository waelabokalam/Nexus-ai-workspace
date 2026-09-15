import type { ReactNode } from "react";
import { LocaleDir } from "@/components/LocaleDir";

/**
 * Arabic route shell: correct RTL + Arabic language from the first server
 * paint (no client JS needed for layout), then syncs documentElement.
 */
export default function ArabicLayout({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" lang="ar">
      <LocaleDir locale="ar" />
      {children}
    </div>
  );
}
