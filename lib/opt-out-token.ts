// Stateless HMAC-signed opt-out tokens.
// Encoding: base64url(JSON payload) + "_" + base64url(HMAC-SHA256 signature)
// No database row needed for pending state — the signed token IS the proof.

import { createHmac } from "crypto";

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function secret(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "opt-out-fallback-secret"
  );
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export type TokenPayload = {
  source:    "supabase" | "enformion";
  personId:  string | null;  // supabase row id; null for enformion results
  firstName: string;
  lastName:  string;
  email:     string;
};

/** Create a token that expires in 24 h. */
export function createOptOutToken(payload: TokenPayload): string {
  const exp  = Date.now() + TTL_MS;
  const data = Buffer.from(
    JSON.stringify({ src: payload.source, pid: payload.personId, fn: payload.firstName, ln: payload.lastName, em: payload.email, exp }),
  ).toString("base64url");
  return `${data}_${sign(data)}`;
}

/**
 * Verify signature and expiry.
 * Returns null if tampered, malformed, or expired.
 */
export function verifyOptOutToken(token: string): TokenPayload | null {
  const sep = token.lastIndexOf("_");
  if (sep === -1) return null;

  const data = token.slice(0, sep);
  const sig  = token.slice(sep + 1);
  if (sign(data) !== sig) return null;

  try {
    const d = JSON.parse(Buffer.from(data, "base64url").toString());
    if (
      (d.src !== "supabase" && d.src !== "enformion") ||
      typeof d.fn  !== "string" ||
      typeof d.ln  !== "string" ||
      typeof d.em  !== "string" ||
      typeof d.exp !== "number"
    ) return null;
    if (Date.now() > d.exp) return null;
    return {
      source:    d.src,
      personId:  typeof d.pid === "string" ? d.pid : null,
      firstName: d.fn,
      lastName:  d.ln,
      email:     d.em,
    };
  } catch {
    return null;
  }
}
