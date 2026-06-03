import { NextRequest, NextResponse } from "next/server";
import { checkSearchRateLimit, clientIp } from "@/lib/rate-limit";

const MAX_LEN = 100;

function sanitize(s: string | null): string {
  return (s ?? "").slice(0, MAX_LEN).replace(/[\x00-\x1f]/g, "");
}

export async function GET(req: NextRequest) {
  if (!checkSearchRateLimit(clientIp(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const firstName = sanitize(searchParams.get("first_name"));
  const lastName  = sanitize(searchParams.get("last_name"));
  const location  = sanitize(searchParams.get("location"));

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Missing name params" }, { status: 400 });
  }

  const apiKey = process.env.ENRICHLAYER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const params = new URLSearchParams({ first_name: firstName, last_name: lastName, page_size: "1" });
  if (location) params.set("location", location);

  try {
    const res = await fetch(`https://enrichlayer.com/api/v2/search/person?${params}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "No match" }, { status: 404 });
    }

    const data = await res.json();
    const r = data?.results?.[0];
    if (!r) return NextResponse.json({ error: "No results" }, { status: 404 });

    return NextResponse.json({
      title:         r.occupation              ?? null,
      employer:      r.company                 ?? null,
      school:        r.education?.[0]?.school?.name ?? null,
      profilePicUrl: r.profile_pic_url         ?? null,
      linkedinUrl:   r.linkedin_profile_url    ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
