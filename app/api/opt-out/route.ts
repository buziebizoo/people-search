import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { fullName, address, city, state, zip, email, reason } =
    await req.json();

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 503 }
    );
  }

  // 1. Record the opt-out request
  const { error: insertError } = await supabase
    .from("opt_out_requests")
    .insert({ full_name: fullName, address, city, state, zip, email, reason });

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }

  // 2. Delete matching records from public.people using the service role key
  const [firstName, ...rest] = (fullName as string).trim().split(" ");
  const lastName = rest.join(" ");

  if (firstName && lastName) {
    await supabase
      .from("people")
      .delete()
      .ilike("first_name", firstName)
      .ilike("last_name", lastName);
    // Deletion errors are intentionally ignored: the opt-out request is already
    // logged and can be processed manually if the automatic delete misses.
  }

  return NextResponse.json({ success: true });
}
