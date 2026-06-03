// Stateless HMAC-signed opt-out tokens.
// Encoding: base64url(JSON payload) + "_" + base64url(HMAC-SHA256 signature)
// No database row needed for pending state — the signed token IS the proof.

import { createHmac } from "crypto";

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function secret(): string {
  // Use the service role key as the HMAC secret — it's already a long random value.
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "opt-out-fallback-secret"
  );
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Create a token that expires in 24 h. */
export function createOptOutToken(personId: string, email: string): string {
  const exp = Date.now() + TTL_MS;
  const payload = Buffer.from(JSON.stringify({ pid: personId, em: email, exp })).toString("base64url");
  return `${payload}_${sign(payload)}`;
}

export type TokenPayload = { personId: string; email: string };

/**
 * Verify signature and expiry.
 * Returns null if tampered, malformed, or expired.
 */
export function verifyOptOutToken(token: string): TokenPayload | null {
  const sep = token.lastIndexOf("_");
  if (sep === -1) return null;

  const payload = token.slice(0, sep);
  const sig     = token.slice(sep + 1);
  if (sign(payload) !== sig) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (
      typeof data.pid !== "string" ||
      typeof data.em  !== "string" ||
      typeof data.exp !== "number"
    ) return null;
    if (Date.now() > data.exp) return null; // expired
    return { personId: data.pid, email: data.em };
  } catch {
    return null;
  }
}
