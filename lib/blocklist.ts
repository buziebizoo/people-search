import { createServerClient } from "@/lib/supabase";

export type BlocklistEntry = {
  first_name: string;
  last_name:  string;
  address:    string | null;
};

export async function fetchBlocklist(): Promise<BlocklistEntry[]> {
  const supabase = createServerClient();
  if (!supabase) {
    console.error("[blocklist] fetchBlocklist: Supabase client unavailable — missing env vars");
    return [];
  }
  const { data, error } = await supabase
    .from("opt_out_blocklist")
    .select("first_name, last_name, address");
  if (error) {
    console.error("[blocklist] fetchBlocklist query failed:", error.message, error.details, error.hint);
    return [];
  }
  const entries = (data ?? []) as BlocklistEntry[];
  console.log(`[blocklist] fetchBlocklist: ${entries.length} entries`);
  return entries;
}

function norm(s: string | null | undefined): string {
  return (s ?? "").toLowerCase().trim();
}

/**
 * Returns true when the given address "contains" the blocklist address or
 * vice versa (handles abbreviations, unit numbers, etc.).
 * If the blocklist entry has no address it matches on name alone.
 */
function addressMatches(blocklistAddr: string | null, resultAddr: string | null): boolean {
  if (!blocklistAddr) return true;          // no address stored → name-only match
  if (!resultAddr)    return false;
  const bl = norm(blocklistAddr);
  const ra = norm(resultAddr);
  return ra.includes(bl) || bl.includes(ra);
}

export function isBlocklisted(
  firstName: string,
  lastName:  string,
  address:   string | null,
  blocklist: BlocklistEntry[],
): boolean {
  const fn = norm(firstName);
  const ln = norm(lastName);

  let matched = false;
  for (const e of blocklist) {
    const efn = norm(e.first_name);
    const eln = norm(e.last_name);
    if (efn === fn && eln === ln && addressMatches(e.address, address)) {
      matched = true;
      break;
    }
  }
  return matched;
}
