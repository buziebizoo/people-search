import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

const SQL = `
CREATE TABLE IF NOT EXISTS opt_out_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip text NOT NULL,
  email text NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
`;

export async function GET() {
  const supabase = createServerClient();
  const { error } = await supabase.rpc("exec_sql", { sql: SQL });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
