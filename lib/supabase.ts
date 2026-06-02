import { createClient } from "@supabase/supabase-js";

// Server components and API routes — service role key bypasses RLS.
// Returns null when env vars are absent (e.g. during static build on Vercel).
// Checks both NEXT_PUBLIC_SUPABASE_URL (baked in at build time) and
// SUPABASE_URL (runtime-only, set by the Supabase Vercel integration and
// recommended for server-side code).
export function createServerClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Client components — anon key respects RLS
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
