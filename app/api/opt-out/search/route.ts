import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  if (!checkRateLimit(`opt-out-search:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const first = (searchParams.get("first") ?? "").trim().slice(0, 100);
  const last  = (searchParams.get("last")  ?? "").trim().slice(0, 100);

  if (!first || !last) {
    return NextResponse.json({ error: "first and last name are required" }, { status: 400 });
  }

  const supabase = createServerClient();
  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const { data, error } = await supabase
    .from("people")
    .select("id, first_name, last_name, full_name, age, city, state, address")
    .eq("opted_out", false)
    .ilike("first_name", `%${first}%`)
    .ilike("last_name",  `%${last}%`)
    .limit(10);

  if (error) {
    console.error("[opt-out/search] query failed:", error.message);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }

  return NextResponse.json({ results: data ?? [] });
}
