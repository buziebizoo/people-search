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

  // Verify signature and expiry — returns null if tampered or expired
  const payload = verifyOptOutToken(token);

  if (!payload) {
    console.log("[opt-out/confirm] invalid or expired token");
    return redirect(req, "/opt-out?error=invalid_token");
  }

  const { personId, email } = payload;

  const supabase = createServerClient();
  if (!supabase) {
    return redirect(req, "/opt-out?error=unavailable");
  }

  // Fetch the person so we can add to the blocklist by name
  const { data: person, error: fetchError } = await supabase
    .from("people")
    .select("id, first_name, last_name, opted_out")
    .eq("id", personId)
    .single();

  if (fetchError || !person) {
    console.log(`[opt-out/confirm] person not found: ${personId}`);
    // Person may have been removed already — treat as success
    return redirect(req, "/opt-out?confirmed=1");
  }

  if (person.opted_out) {
    console.log(`[opt-out/confirm] already opted out: ${personId}`);
    return redirect(req, "/opt-out?confirmed=1");
  }

  // 1. Mark the person opted out in the people table
  const { error: updateError } = await supabase
    .from("people")
    .update({ opted_out: true })
    .eq("id", personId);

  if (updateError) {
    console.error("[opt-out/confirm] opted_out update failed:", updateError.message);
    return redirect(req, "/opt-out?error=unavailable");
  }

  // 2. Add to blocklist (name-only match covers Enformion results too)
  const { error: blocklistError } = await supabase
    .from("opt_out_blocklist")
    .insert({
      first_name: person.first_name,
      last_name:  person.last_name,
      address:    null,
      email,
    });

  if (blocklistError) {
    console.error("[opt-out/confirm] blocklist insert failed:", blocklistError.message);
    // Not fatal — the opted_out flag is already set
  }

  console.log(`[opt-out/confirm] successfully opted out ${person.first_name} ${person.last_name} (id=${personId})`);

  return redirect(req, "/opt-out?confirmed=1");
}
