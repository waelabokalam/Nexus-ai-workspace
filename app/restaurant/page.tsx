import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";

import RestaurantCommandCenter from "@/components/RestaurantCommandCenter";
import ThemeToggle from "@/components/ThemeToggle";
import NexusCore from "@/components/ui/NexusCore";
import { listRestaurantWorkspaces } from "@/lib/restaurant/auth";
import { signOutRestaurant } from "@/lib/restaurant/auth-actions";
import { getRestaurantCommandCenter } from "@/lib/restaurant/services";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manager Command Center | Nexus Restaurant",
  description: "Restaurant attention, approvals, Nexus outcomes, and activity history.",
  robots: { index: false, follow: false },
};

export default async function RestaurantPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string | string[] }>;
}) {
  const database = await createSupabaseServerClient();
  const { data: auth } = await database.auth.getUser();
  if (!auth.user) redirect("/restaurant/login");

  const memberships = await listRestaurantWorkspaces(database);
  if (!memberships?.length) {
    return (
      <main className="nexus-page flex min-h-screen flex-1 items-center justify-center px-5 py-12 text-white">
        <div className="absolute right-5 top-5"><ThemeToggle /></div>
        <section className="nexus-surface w-full max-w-lg rounded-[var(--nexus-radius-surface)] p-7 text-center sm:p-9">
          <div className="mx-auto flex size-12 items-center justify-center"><NexusCore size={42} /></div>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Nexus Restaurant</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white light:text-zinc-950">No restaurant workspace yet</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400 light:text-zinc-600">
            Your account is authenticated, but it has not been added to a restaurant organization. Ask an owner to add your user account, or run the guarded seed against an approved Restaurant development project.
          </p>
          <form action={signOutRestaurant} className="mt-7">
            <button className="nexus-focus nexus-button-secondary min-h-10 rounded-xl px-4 text-sm font-medium" type="submit">Sign out</button>
          </form>
        </section>
      </main>
    );
  }

  const params = await searchParams;
  const requestedBranch = typeof params.branch === "string" ? params.branch : null;
  const branchId = z.uuid().safeParse(requestedBranch).success ? requestedBranch : null;
  const organizationId = memberships[0].organization_id;

  let data;
  try {
    data = await getRestaurantCommandCenter({ organizationId, branchId }, database);
  } catch (error) {
    if (
      branchId &&
      error instanceof Error &&
      error.message === "The selected branch is not active in this restaurant."
    ) {
      redirect("/restaurant");
    }
    throw error;
  }

  return <RestaurantCommandCenter data={data} />;
}
