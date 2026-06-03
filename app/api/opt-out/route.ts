import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

const REQUIRED = ["fullName", "address", "city", "state", "zip", "email", "reason"] as const;
const MAX_LENGTHS: Record<string, number> = {
  fullName: 200, address: 300, city: 100, state: 50, zip: 20, email: 254, reason: 2000,
};

function sanitize(s: unknown, maxLen: number): string {
  return String(s ?? "").slice(0, maxLen).replace(/[\x00-\x1f]/g, "").trim();
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: NextRequest) {
  if (!checkRateLimit(clientIp(req), 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Validate required fields
  for (const field of REQUIRED) {
    if (!body[field] || typeof body[field] !== "string" || !(body[field] as string).trim()) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  // Sanitize and enforce length limits
  const fullName = sanitize(body.fullName, MAX_LENGTHS.fullName);
  const address  = sanitize(body.address,  MAX_LENGTHS.address);
  const city     = sanitize(body.city,     MAX_LENGTHS.city);
  const state    = sanitize(body.state,    MAX_LENGTHS.state);
  const zip      = sanitize(body.zip,      MAX_LENGTHS.zip);
  const email    = sanitize(body.email,    MAX_LENGTHS.email);
  const reason   = sanitize(body.reason,   MAX_LENGTHS.reason);

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { error: insertError } = await supabase
    .from("opt_out_requests")
    .insert({ full_name: fullName, address, city, state, zip, email, reason });

  if (insertError) {
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }

  // Delete matching records from public.people (best-effort, logged above)
  const [firstName, ...rest] = fullName.trim().split(" ");
  const lastName = rest.join(" ");
  if (firstName && lastName) {
    await supabase
      .from("people")
      .delete()
      .ilike("first_name", firstName)
      .ilike("last_name", lastName);
  }

  return NextResponse.json({ success: true });
}
