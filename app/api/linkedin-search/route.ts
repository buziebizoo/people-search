import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const firstName = searchParams.get("first_name") ?? "";
  const lastName  = searchParams.get("last_name")  ?? "";
  const location  = searchParams.get("location")   ?? "";

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Missing name params" }, { status: 400 });
  }

  const apiKey = process.env.ENRICHLAYER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
  }

  const params = new URLSearchParams({
    first_name: firstName,
    last_name:  lastName,
    page_size:  "1",
  });
  if (location) params.set("location", location);

  const url = `https://enrichlayer.com/api/v2/search/person?${params}`;
  console.log("[linkedin-search] GET", url);

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    console.log("[linkedin-search] status:", res.status, res.statusText);
    const rawText = await res.text();
    console.log("[linkedin-search] raw response:", rawText.slice(0, 500));

    if (!res.ok) {
      return NextResponse.json({ error: "No match", status: res.status }, { status: res.status });
    }

    const data = JSON.parse(rawText);
    const r = data?.results?.[0];

    if (!r) {
      return NextResponse.json({ error: "No results" }, { status: 404 });
    }

    return NextResponse.json({
      title:         r.occupation        ?? null,
      employer:      r.company           ?? null,
      school:        r.education?.[0]?.school?.name ?? null,
      profilePicUrl: r.profile_pic_url   ?? null,
      linkedinUrl:   r.linkedin_profile_url ?? null,
    });
  } catch (err) {
    console.error("[linkedin-search] error:", err);
    return NextResponse.json({ error: "Network error" }, { status: 500 });
  }
}
