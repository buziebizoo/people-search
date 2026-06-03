import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { createOptOutToken } from "@/lib/opt-out-token";

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!checkRateLimit(`opt-out:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const source    = String(body.source    ?? "").trim();
  const personId  = String(body.personId  ?? "").trim().slice(0, 100);
  const firstName = String(body.firstName ?? "").trim().slice(0, 100);
  const lastName  = String(body.lastName  ?? "").trim().slice(0, 100);
  const email     = String(body.email     ?? "").trim().slice(0, 254);

  if (source !== "supabase" && source !== "enformion") {
    return NextResponse.json({ error: "Invalid source" }, { status: 400 });
  }
  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  // For Supabase records, verify the person still exists and isn't already removed
  if (source === "supabase") {
    if (!personId) {
      return NextResponse.json({ error: "Missing person ID" }, { status: 400 });
    }
    const { data: person } = await supabase
      .from("people")
      .select("id")
      .eq("id", personId)
      .eq("opted_out", false)
      .single();

    if (!person) {
      console.log(`[opt-out] supabase person not found or already opted out: ${personId}`);
      // Return success to avoid leaking which IDs exist
      return NextResponse.json({ success: true });
    }
  }

  const token = createOptOutToken({
    source:    source as "supabase" | "enformion",
    personId:  source === "supabase" ? personId : null,
    firstName,
    lastName,
    email,
  });

  const origin     = req.headers.get("origin") ?? req.nextUrl.origin;
  const confirmUrl = `${origin}/api/opt-out/confirm/${token}`;

  console.log(`[opt-out] token for ${firstName} ${lastName} <${email}> (source=${source})`);
  console.log(`[opt-out] confirm URL: ${confirmUrl}`);

  if (process.env.RESEND_API_KEY) {
    // TODO: send via Resend
    console.log("[opt-out] RESEND_API_KEY present — email sending not yet wired up");
  }

  return NextResponse.json({ success: true });
}
