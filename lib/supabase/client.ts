"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createSupabaseBrowserClient() {
  if (!browserClient) {
    const { url, publishableKey } = getSupabasePublicConfig();
    browserClient = createBrowserClient<Database>(url, publishableKey);
  }

  return browserClient;
}
