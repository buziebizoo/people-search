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

  for (const field of REQUIRED) {
    if (!body[field] || typeof body[field] !== "string" || !(body[field] as string).trim()) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

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
    console.error("[opt-out] Supabase client unavailable — missing env vars");
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  // 1. Record the opt-out request and capture the generated ID
  console.log(`[opt-out] Inserting opt_out_requests for "${fullName}" <${email}>`);
  const { data: requestRow, error: insertError } = await supabase
    .from("opt_out_requests")
    .insert({ full_name: fullName, address, city, state, zip, email, reason })
    .select("id")
    .single();

  if (insertError || !requestRow) {
    console.error("[opt-out] opt_out_requests insert failed:", insertError?.message, insertError?.details);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
  console.log(`[opt-out] opt_out_requests insert OK, id=${requestRow.id}`);

  const referenceNumber = (requestRow.id as string).split("-")[0].toUpperCase();

  // Parse first/last name
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName  = nameParts.slice(1).join(" ");

  console.log(`[opt-out] Parsed name: firstName="${firstName}" lastName="${lastName}"`);

  if (firstName && lastName) {
    // 2. Add to blocklist (durable record in case people table is reloaded)
    console.log(`[opt-out] Inserting opt_out_blocklist for "${firstName} ${lastName}"`);
    const { error: blocklistError } = await supabase
      .from("opt_out_blocklist")
      .insert({ first_name: firstName, last_name: lastName, address, email });

    if (blocklistError) {
      console.error("[opt-out] opt_out_blocklist insert FAILED:", blocklistError.message, blocklistError.details, blocklistError.hint);
    } else {
      console.log("[opt-out] opt_out_blocklist insert OK");
    }

    // 3. Mark matching people records as opted out (name + address for precision)
    console.log(`[opt-out] Updating people.opted_out for "${firstName} ${lastName}" address="${address}"`);
    const { count: updatedCount, error: updateError } = await supabase
      .from("people")
      .update({ opted_out: true })
      .ilike("first_name", firstName)
      .ilike("last_name",  lastName)
      .ilike("address",    `%${address}%`);

    if (updateError) {
      console.error("[opt-out] people opted_out update FAILED:", updateError.message);
    } else {
      console.log(`[opt-out] people opted_out update OK, rows affected=${updatedCount ?? "unknown"}`);
    }
  } else {
    console.warn(`[opt-out] Skipping blocklist/people update — could not parse both first and last name from "${fullName}"`);
  }

  return NextResponse.json({ success: true, referenceNumber });
}
