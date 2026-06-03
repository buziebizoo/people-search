import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { sanitizeSearchInput } from "@/lib/sanitize";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  if (!checkRateLimit(`contact:hour:${ip}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name    = sanitizeSearchInput(body.name    as string);
  const email   = sanitizeSearchInput(body.email   as string);
  const subject = sanitizeSearchInput(body.subject as string);
  const message = sanitizeSearchInput(body.message as string);

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const { error: dbError } = await supabase
    .from("contact_submissions")
    .insert({ name, email, subject, message, ip_address: ip });

  if (dbError) {
    console.error("[contact] insert error:", dbError);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
