import { NextRequest, NextResponse } from "next/server";
import { searchByName, searchByPhone, searchByAddress } from "@/lib/enformion";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    if (type === "phone") {
      const phone = searchParams.get("phone_number") ?? "";
      if (!phone) return NextResponse.json({ results: [] });
      return NextResponse.json({ results: await searchByPhone(phone) });
    }

    if (type === "name") {
      const results = await searchByName(
        searchParams.get("first_name") ?? "",
        searchParams.get("last_name")  ?? "",
        searchParams.get("city")       ?? "",
        searchParams.get("state")      ?? "",
      );
      return NextResponse.json({ results });
    }

    if (type === "address") {
      const results = await searchByAddress(
        searchParams.get("street") ?? "",
        searchParams.get("city")   ?? "",
        searchParams.get("state")  ?? "",
        searchParams.get("zip")    ?? "",
      );
      return NextResponse.json({ results });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
