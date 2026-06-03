import { NextRequest, NextResponse } from "next/server";
import { searchByName, searchByPhone, searchByAddress } from "@/lib/enformion";
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
  const type = sanitize(searchParams.get("type"));

  try {
    if (type === "phone") {
      const phone = sanitize(searchParams.get("phone_number"));
      if (!phone) return NextResponse.json({ results: [] });
      return NextResponse.json({ results: await searchByPhone(phone) });
    }

    if (type === "name") {
      const results = await searchByName(
        sanitize(searchParams.get("first_name")),
        sanitize(searchParams.get("last_name")),
        sanitize(searchParams.get("city")),
        sanitize(searchParams.get("state")),
      );
      return NextResponse.json({ results });
    }

    if (type === "address") {
      const results = await searchByAddress(
        sanitize(searchParams.get("street")),
        sanitize(searchParams.get("city")),
        sanitize(searchParams.get("state")),
        sanitize(searchParams.get("zip")),
      );
      return NextResponse.json({ results });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Search unavailable" }, { status: 503 });
  }
}
