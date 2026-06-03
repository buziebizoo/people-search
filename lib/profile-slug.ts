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

export type NameParts = { first: string; last: string; city: string; state: string };

export type ParsedSlug =
  | { type: "uuid"; id: string }
  | { type: "supabase"; shortId: string } & NameParts
  | { type: "enformion" } & NameParts;

/**
 * Slug structures:
 *   - Full UUID                              → backward-compat uuid lookup
 *   - first-last-[city...]-state-{hex8}      → Supabase record (shortId + name parts)
 *   - first-last-[city...]-state             → Enformion search (name parts only)
 *
 * Name parsing assumes single-word first and last name (covers the common case).
 * City words are everything between last name and state.
 */
export function parseProfileSlug(slug: string): ParsedSlug {
  if (UUID_RE.test(slug)) return { type: "uuid", id: slug };

  const parts = slug.split("-");
  const tail  = parts[parts.length - 1] ?? "";

  if (HEX8_RE.test(tail)) {
    // Supabase: strip the shortId tail, then parse name/city/state from remaining
    const rest  = parts.slice(0, -1);
    const state = rest[rest.length - 1]?.toUpperCase() ?? "";
    const first = rest[0] ?? "";
    const last  = rest[1] ?? "";
    const city  = rest.slice(2, rest.length - 1).join(" ");
    return { type: "supabase", shortId: tail, first, last, city, state };
  }

  // Enformion: [first, last, ...cityWords, state]
  const state = tail.toUpperCase();
  const first = parts[0] ?? "";
  const last  = parts[1] ?? "";
  const city  = parts.slice(2, parts.length - 1).join(" ");
  return { type: "enformion", first, last, city, state };
}
