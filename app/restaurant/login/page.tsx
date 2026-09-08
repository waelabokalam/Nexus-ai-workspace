import type { Metadata } from "next";

import RestaurantLoginForm from "@/components/RestaurantLoginForm";
import ThemeToggle from "@/components/ThemeToggle";
import NexusCore from "@/components/ui/NexusCore";

export const metadata: Metadata = {
  title: "Restaurant sign in | Nexus",
  description: "Secure access to the Nexus Restaurant Manager Command Center.",
  robots: { index: false, follow: false },
};

export default async function RestaurantLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/restaurant";

  return (
    <main className="nexus-page flex min-h-screen flex-1 items-center justify-center px-5 py-12 text-white sm:px-8">
      <a className="nexus-skip-link" href="#restaurant-login">
        Skip to sign in
      </a>
      <div className="absolute right-5 top-5 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>
      <section
        className="nexus-surface w-full max-w-md rounded-[var(--nexus-radius-surface)] p-6 sm:p-8"
        id="restaurant-login"
      >
        <div className="flex items-center gap-3">
          <NexusCore size={34} />
          <div>
            <p className="text-sm font-semibold tracking-[-0.02em] text-white light:text-zinc-950">
              Nexus Restaurant
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">Manager workspace</p>
          </div>
        </div>

        <div className="mt-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Secure access
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white light:text-zinc-950">
            Sign in to your command center
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400 light:text-zinc-600">
            Restaurant data is available only to members of your organization.
          </p>
        </div>

        <RestaurantLoginForm next={next} />

        <div className="mt-7 border-t border-white/[0.08] pt-5 text-xs leading-5 text-zinc-500 light:border-black/[0.09]">
          Nexus uses your existing restaurant membership to determine workspace and role access.
        </div>
      </section>
    </main>
  );
}
