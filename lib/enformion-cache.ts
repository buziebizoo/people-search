// Server-side persistent cache for Enformion person lookups, backed by the
// `enformion_cache` Supabase table. Complements the in-memory cache in
// lib/enformion.ts by surviving cold starts and deduplicating API charges
// across instances. All operations fail soft — a cache miss/error never
// breaks a search.

import { createServerClient } from "@/lib/supabase";
import type { EnformionPerson } from "@/lib/enformion";

const TTL_DAYS = 90;

/** Lowercase, hyphenated cache key, e.g. "john-smith-charlotte-nc". */
export function buildCacheKey(
  first: string,
  last: string,
  city: string,
  state: string,
): string {
  return [first, last, city, state]
    .map((part) =>
      (part ?? "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    )
    .filter(Boolean)
    .join("-");
}

/** Return cached person results if present and not expired, else null. */
export async function getCachedPerson(
  first: string,
  last: string,
  city: string,
  state: string,
): Promise<EnformionPerson[] | null> {
  const supabase = createServerClient();
  if (!supabase) return null;

  const cacheKey = buildCacheKey(first, last, city, state);
  if (!cacheKey) return null;

  const { data, error } = await supabase
    .from("enformion_cache")
    .select("person_data, expires_at")
    .eq("cache_key", cacheKey)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error || !data || !data.person_data) return null;
  console.log(`[enformion-cache] hit: ${cacheKey}`);
  return data.person_data as EnformionPerson[];
}

/** Upsert person results into the cache, refreshing the 90-day expiry. */
export async function setCachedPerson(
  first: string,
  last: string,
  city: string,
  state: string,
  data: EnformionPerson[],
): Promise<void> {
  const supabase = createServerClient();
  if (!supabase) return;

  const cacheKey = buildCacheKey(first, last, city, state);
  if (!cacheKey) return;

  const now = Date.now();
  const expiresAt = new Date(now + TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from("enformion_cache")
    .upsert(
      {
        cache_key: cacheKey,
        person_data: data,
        created_at: new Date(now).toISOString(),
        expires_at: expiresAt,
      },
      { onConflict: "cache_key" },
    );

  if (error) {
    console.error("[enformion-cache] set failed:", error.message);
  }
}
