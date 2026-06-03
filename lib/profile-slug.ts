function slugify(s: string | null | undefined): string {
  return (s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** /profile/julia-zhu-san-francisco-ca-a1b2c3d4 */
export function buildSupabaseSlug(
  firstName: string,
  lastName: string,
  city: string | null,
  state: string | null,
  id: string,
): string {
  const shortId = id.split("-")[0]; // first 8 hex chars of UUID
  return [firstName, lastName, city ?? "", state ?? ""]
    .map(slugify)
    .filter(Boolean)
    .concat(shortId)
    .join("-");
}

/** /profile/julia-zhu-san-francisco-ca */
export function buildEnformionSlug(
  firstName: string,
  lastName: string,
  city: string | null,
  state: string | null,
): string {
  return [firstName, lastName, city ?? "", state ?? ""]
    .map(slugify)
    .filter(Boolean)
    .join("-");
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

const HEX8_RE = /^[a-f0-9]{8}$/i;
const UUID_RE =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

export type ParsedSlug =
  | { type: "uuid"; id: string }
  | { type: "supabase"; shortId: string }
  | { type: "enformion"; first: string; last: string; city: string; state: string };

/**
 * Distinguishes three slug shapes:
 *   - Full UUID                          → uuid lookup (backward compat)
 *   - ends with 8-char hex segment        → Supabase prefix lookup
 *   - everything else                     → Enformion name search
 *
 * Enformion slug structure: first-last-[city-words]-state
 * (assumes single-word first and last name — covers the common case)
 */
export function parseProfileSlug(slug: string): ParsedSlug {
  if (UUID_RE.test(slug)) return { type: "uuid", id: slug };

  const parts = slug.split("-");
  const tail = parts[parts.length - 1] ?? "";

  if (HEX8_RE.test(tail)) return { type: "supabase", shortId: tail };

  // Enformion: [first, last, ...cityWords, state]
  const state = tail.toUpperCase();
  const first = parts[0] ?? "";
  const last  = parts[1] ?? "";
  const city  = parts.slice(2, parts.length - 1).join(" ");

  return { type: "enformion", first, last, city, state };
}
