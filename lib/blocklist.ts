import { createServerClient } from "@/lib/supabase";

export type BlocklistEntry = {
  first_name: string;
  last_name:  string;
  address:    string | null;
};

export async function fetchBlocklist(): Promise<BlocklistEntry[]> {
  const supabase = createServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("opt_out_blocklist")
    .select("first_name, last_name, address");
  return (data ?? []) as BlocklistEntry[];
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
  return blocklist.some(
    (e) =>
      norm(e.first_name) === fn &&
      norm(e.last_name)  === ln &&
      addressMatches(e.address, address),
  );
}
