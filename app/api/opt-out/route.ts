import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase";
import { checkOptOutRateLimit, clientIp } from "@/lib/rate-limit";
import { readJsonBody } from "@/lib/api-guards";
import { createOptOutToken } from "@/lib/opt-out-token";

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!checkOptOutRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = await readJsonBody(req);
  if (!parsed.ok) return parsed.response;
  const body = parsed.body;

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
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: emailError } = await resend.emails.send({
      from:    "Who Is My Date? <onboarding@resend.dev>",
      to:      email,
      subject: "Confirm your removal request - Who Is My Date?",
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden">

        <!-- Header -->
        <tr>
          <td style="background:#0d9488;padding:28px 32px">
            <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff">Who Is My Date?</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px">
            <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#111827">
              Confirm your removal request
            </h1>
            <p style="margin:0 0 8px;font-size:15px;color:#374151">
              We received a request to remove <strong>${firstName} ${lastName}</strong>
              from Who Is My Date? search results.
            </p>
            <p style="margin:0 0 28px;font-size:15px;color:#374151">
              Click the button below to confirm and complete your removal.
              This link expires in <strong>24 hours</strong>.
            </p>

            <!-- Button -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom:28px">
              <tr>
                <td style="background:#0d9488;border-radius:8px">
                  <a href="${confirmUrl}"
                     style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none">
                    Confirm Removal
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 8px;font-size:13px;color:#6b7280">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="margin:0 0 28px;font-size:12px;color:#6b7280;word-break:break-all">
              ${confirmUrl}
            </p>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 20px">
            <p style="margin:0;font-size:12px;color:#9ca3af">
              If you did not submit this request, you can safely ignore this email.
              No changes will be made to your record.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    if (emailError) {
      console.error("[opt-out] Resend error:", emailError.message);
      // Still return success — the token is valid and the confirm URL was logged
    } else {
      console.log(`[opt-out] confirmation email sent to ${email}`);
    }
  } else {
    console.log("[opt-out] No RESEND_API_KEY — confirm URL logged above for manual testing");
  }

  return NextResponse.json({ success: true });
}
