import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { checkSearchRateLimit, clientIp } from "@/lib/rate-limit";
import { searchByName } from "@/lib/enformion";
import { sanitizeSearchInput } from "@/lib/sanitize";

export async function GET(req: NextRequest) {
  try {
  if (!checkSearchRateLimit(clientIp(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const sp    = new URL(req.url).searchParams;
  const first = sanitizeSearchInput(sp.get("first")).slice(0, 100);
  const last  = sanitizeSearchInput(sp.get("last")).slice(0, 100);
  const city  = sanitizeSearchInput(sp.get("city")).slice(0, 100);
  const state = sanitizeSearchInput(sp.get("state")).slice(0, 2).toUpperCase();

  if (!first || !last) {
    return NextResponse.json({ error: "first and last name are required" }, { status: 400 });
  }

  const supabase = createServerClient();
  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  // ── Supabase ────────────────────────────────────────────────────────────────
  let query = supabase
    .from("people")
    .select("id, first_name, last_name, full_name, age, city, state, address")
    .eq("opted_out", false)
    .ilike("first_name", `%${first}%`)
    .ilike("last_name",  `%${last}%`);

  if (city)              query = query.ilike("city", `%${city}%`);
  if (state.length === 2) query = query.eq("state", state);

  const { data, error } = await query.limit(10);

  if (error) {
    console.error("[opt-out/search] Supabase query failed:", error.message);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }

  if (data && data.length > 0) {
    return NextResponse.json({
      results: data.map((p) => ({ ...p, source: "supabase" })),
    });
  }

  // ── Enformion fallback (same logic as main search) ──────────────────────────
  const enf = await searchByName(first, last, city, state, 1, 10);
  const results = enf.map((p, i) => ({
    id:         `enf-${i}`,
    source:     "enformion" as const,
    first_name: p.first_name,
    last_name:  p.last_name,
    full_name:  p.full_name,
    age:        p.age,
    city:       p.city,
    state:      p.state,
    address:    p.address,
  }));

  return NextResponse.json({ results });
  } catch (err) {
    console.error("[opt-out/search] unhandled error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
