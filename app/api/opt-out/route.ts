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

  const personId = String(body.personId ?? "").trim().slice(0, 100);
  const email    = String(body.email    ?? "").trim().slice(0, 254);

  if (!personId) {
    return NextResponse.json({ error: "Missing person ID" }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  // Confirm the record exists and hasn't already been removed
  const { data: person, error: personError } = await supabase
    .from("people")
    .select("id, first_name, last_name")
    .eq("id", personId)
    .eq("opted_out", false)
    .single();

  if (personError || !person) {
    console.log(`[opt-out] person not found or already opted out: ${personId}`);
    // Return success anyway to avoid leaking which IDs exist
    return NextResponse.json({ success: true });
  }

  const token = createOptOutToken(personId, email);
  const origin = req.headers.get("origin") ?? req.nextUrl.origin;
  const confirmUrl = `${origin}/api/opt-out/confirm/${token}`;

  console.log(`[opt-out] confirmation token for ${person.first_name} ${person.last_name} <${email}>`);
  console.log(`[opt-out] confirm URL: ${confirmUrl}`);

  if (process.env.RESEND_API_KEY) {
    // TODO: send email via Resend
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ from: "...", to: email, subject: "Confirm your removal request", html: `...` });
    console.log("[opt-out] RESEND_API_KEY present but email sending not yet wired up");
  } else {
    console.log("[opt-out] No RESEND_API_KEY — token logged above for manual testing");
  }

  return NextResponse.json({ success: true });
}
