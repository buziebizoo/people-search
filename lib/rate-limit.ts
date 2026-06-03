/**
 * Simple in-memory rate limiter.
 *
 * Caveat: state is per-process. On serverless (Vercel) each cold-start has
 * fresh memory, so limits are best-effort rather than strict. For hard limits,
 * replace with a Redis-backed solution (e.g. Upstash).
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

/** Periodically purge expired entries to avoid unbounded growth. */
function purge() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}

let lastPurge = Date.now();

/**
 * Returns true if the request is allowed, false if rate-limited.
 * @param key      Unique identifier (typically IP address)
 * @param limit    Max requests per window
 * @param windowMs Window length in milliseconds
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (now - lastPurge > 60_000) { purge(); lastPurge = now; }

  const entry = store.get(key);
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

/** Extract best-effort client IP from a request. */
export function clientIp(req: Request): string {
  const fwd = (req.headers as Headers).get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}
