import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const firstName = searchParams.get("first_name") ?? "";
  const lastName = searchParams.get("last_name") ?? "";
  const location = searchParams.get("location") ?? "";

  console.log("[linkedin-search] incoming params:", { firstName, lastName, location });

  if (!firstName || !lastName) {
    console.log("[linkedin-search] missing name params — returning 400");
    return NextResponse.json({ error: "Missing name params" }, { status: 400 });
  }

  const apiKey = process.env.ENRICHLAYER_API_KEY;
  console.log("[linkedin-search] API key present:", !!apiKey, "| key prefix:", apiKey?.slice(0, 6));
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
  }

  const upstreamParams = new URLSearchParams({ first_name: firstName, last_name: lastName });
  if (location) upstreamParams.set("location", location);

  const upstreamUrl = `https://nubela.io/proxycurl/api/v2/search/person?${upstreamParams}`;
  console.log("[linkedin-search] calling upstream URL:", upstreamUrl);

  try {
    const res = await fetch(upstreamUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    console.log("[linkedin-search] upstream status:", res.status, res.statusText);

    const rawText = await res.text();
    console.log("[linkedin-search] upstream raw response:", rawText.slice(0, 1000));

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream error", status: res.status, body: rawText },
        { status: res.status }
      );
    }

    const data = JSON.parse(rawText);
    console.log("[linkedin-search] parsed result count:", data?.results?.length ?? 0);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[linkedin-search] fetch error:", err);
    return NextResponse.json({ error: "Network error" }, { status: 500 });
  }
}
