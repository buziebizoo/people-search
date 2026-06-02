import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const firstName = searchParams.get("first_name") ?? "";
  const lastName = searchParams.get("last_name") ?? "";
  const location = searchParams.get("location") ?? "";

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Missing name params" }, { status: 400 });
  }

  const apiKey = process.env.ENRICHLAYER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
  }

  const params = new URLSearchParams({ first_name: firstName, last_name: lastName });
  if (location) params.set("location", location);

  try {
    const res = await fetch(
      `https://nubela.io/proxycurl/api/v2/search/person?${params}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Network error" }, { status: 500 });
  }
}
