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

// ---------------------------------------------------------------------------
// Named limits
// ---------------------------------------------------------------------------

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const LIMITS = {
  searchPerMinute: { limit: 30, windowMs: MINUTE },
  searchPerDay: { limit: 200, windowMs: DAY },
  optOutPerHour: { limit: 5, windowMs: HOUR },
} as const;

/**
 * Enforce both the per-minute (30) and per-day (200) search limits for an IP.
 * Returns true if the request is allowed. The two buckets are independent, so
 * a request that passes the minute check still counts toward the daily total.
 */
export function checkSearchRateLimit(ip: string): boolean {
  if (!checkRateLimit(`search:min:${ip}`, LIMITS.searchPerMinute.limit, LIMITS.searchPerMinute.windowMs)) {
    return false;
  }
  return checkRateLimit(`search:day:${ip}`, LIMITS.searchPerDay.limit, LIMITS.searchPerDay.windowMs);
}

/** Enforce the opt-out submission limit (5 per IP per hour). */
export function checkOptOutRateLimit(ip: string): boolean {
  return checkRateLimit(`opt-out:hour:${ip}`, LIMITS.optOutPerHour.limit, LIMITS.optOutPerHour.windowMs);
}
