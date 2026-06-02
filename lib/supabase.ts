import { createClient } from "@supabase/supabase-js";

// Server components and API routes.
// Prefers the service role key (bypasses RLS) but falls back to the anon key
// so the server client works on Vercel with only the NEXT_PUBLIC_* vars set.
// Returns null only when the URL itself is missing (true build-time absence).
export function createServerClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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
