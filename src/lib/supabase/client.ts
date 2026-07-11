import { createBrowserClient } from "@supabase/ssr";

// Client-side Supabase instance — safe to use in "use client" components.
// Reads the anon key, which is public by design; row-level security
// (see supabase/migrations/0001_init.sql) is what actually protects data.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
