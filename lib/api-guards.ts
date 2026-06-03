import { NextRequest, NextResponse } from "next/server";

const MAX_BODY_BYTES = 10 * 1024; // 10KB

type JsonBodyResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; response: NextResponse };

/**
 * Validate and parse a JSON POST body:
 *  - rejects requests that aren't `application/json` (415)
 *  - rejects bodies larger than 10KB (413), via Content-Length and actual size
 *  - rejects malformed/non-object JSON (400)
 *
 * All error responses are generic — no internal details or stack traces leak.
 */
export async function readJsonBody(req: NextRequest): Promise<JsonBodyResult> {
  const contentType = (req.headers.get("content-type") ?? "").toLowerCase();
  if (!contentType.includes("application/json")) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unsupported media type" }, { status: 415 }),
    };
  }

  const declaredLen = req.headers.get("content-length");
  if (declaredLen && Number(declaredLen) > MAX_BODY_BYTES) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Request body too large" }, { status: 413 }),
    };
  }

  const raw = await req.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Request body too large" }, { status: 413 }),
    };
  }

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {
        ok: false,
        response: NextResponse.json({ error: "Invalid request body" }, { status: 400 }),
      };
    }
    return { ok: true, body: parsed as Record<string, unknown> };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid request body" }, { status: 400 }),
    };
  }
}
