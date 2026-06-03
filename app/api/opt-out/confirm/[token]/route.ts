import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyOptOutToken } from "@/lib/opt-out-token";

function redirect(req: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, req.url));
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const payload = verifyOptOutToken(token);
  if (!payload) {
    console.log("[opt-out/confirm] invalid or expired token");
    return redirect(req, "/opt-out?error=invalid_token");
  }

  const { source, personId, firstName, lastName, email } = payload;

  const supabase = createServerClient();
  if (!supabase) return redirect(req, "/opt-out?error=unavailable");

  if (source === "supabase" && personId) {
    // ── Supabase record: mark the specific row opted out ──────────────────────
    const { data: person } = await supabase
      .from("people")
      .select("id, first_name, last_name, opted_out")
      .eq("id", personId)
      .single();

    if (!person) {
      // Already deleted or never existed — treat as success
      return redirect(req, "/opt-out?confirmed=1");
    }
    if (!person.opted_out) {
      const { error: updateError } = await supabase
        .from("people")
        .update({ opted_out: true })
        .eq("id", personId);

      if (updateError) {
        console.error("[opt-out/confirm] opted_out update failed:", updateError.message);
        return redirect(req, "/opt-out?error=unavailable");
      }
    }
  } else {
    // ── Enformion record: opt out any matching Supabase rows by name ──────────
    const { error: updateError } = await supabase
      .from("people")
      .update({ opted_out: true })
      .ilike("first_name", firstName)
      .ilike("last_name",  lastName);

    if (updateError) {
      console.error("[opt-out/confirm] ilike opted_out update failed:", updateError.message);
      // Non-fatal — blocklist entry still provides coverage
    }
  }

  // ── Add to blocklist (name-only match covers Enformion searches too) ────────
  const { error: blocklistError } = await supabase
    .from("opt_out_blocklist")
    .insert({ first_name: firstName, last_name: lastName, address: null, email });

  if (blocklistError) {
    console.error("[opt-out/confirm] blocklist insert failed:", blocklistError.message);
    // Non-fatal
  }

  console.log(`[opt-out/confirm] opted out ${firstName} ${lastName} (source=${source}, id=${personId ?? "n/a"})`);
  return redirect(req, "/opt-out?confirmed=1");
}
