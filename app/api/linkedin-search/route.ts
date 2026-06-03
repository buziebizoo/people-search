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
    first_name:        firstName,
    last_name:         lastName,
    enrich_profile:    "enrich",
    similarity_checks: "skip",
  });
  if (location) params.set("location", location);

  const url = `https://enrichlayer.com/api/v2/profile/resolve?${params}`;
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
    const profile = data?.profile ?? data;

    return NextResponse.json({
      title:         profile?.occupation   ?? null,
      employer:      profile?.company      ?? null,
      school:        profile?.education?.[0]?.school?.name ?? null,
      profilePicUrl: profile?.profile_pic_url ?? null,
      linkedinUrl:   profile?.linkedin_url    ?? null,
    });
  } catch (err) {
    console.error("[linkedin-search] error:", err);
    return NextResponse.json({ error: "Network error" }, { status: 500 });
  }
}
