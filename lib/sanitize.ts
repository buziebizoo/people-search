/**
 * Sanitize free-text search input before it is used in a query.
 *
 * Supabase/PostgREST sends `.ilike`/`.eq` values as parameters, not inline
 * SQL, so classic SQL injection isn't directly exploitable — but defense in
 * depth is cheap, and the `.or()` filter builder concatenates values into a
 * PostgREST filter string. This strips HTML, removes SQL comment/terminator
 * sequences and well-known injection patterns, drops control characters,
 * trims, and caps length.
 *
 * We deliberately keep bare words ("select", "union") and apostrophes, which
 * occur in legitimate names and places (O'Brien, Union City) — removing them
 * would corrupt real searches without adding meaningful protection.
 */

const MAX_LENGTH = 100;

const HTML_TAG = /<[^>]*>/g;

// SQL injection signatures: comment markers, statement terminators, and
// multi-token attack phrases. Multi-token patterns avoid false positives on
// single legitimate words.
const SQL_PATTERNS: RegExp[] = [
  /--/g, // line comment
  /;/g, // statement terminator
  /\/\*/g,
  /\*\//g, // block comment markers
  /\bunion\s+select\b/gi,
  /\bor\s+\d+\s*=\s*\d+/gi, // OR 1=1
  /\b(drop|truncate|alter)\s+table\b/gi,
  /\bdelete\s+from\b/gi,
  /\binsert\s+into\b/gi,
  /\bexec(?:ute)?\s*\(/gi,
  /\bxp_\w+/gi,
];

export function sanitizeSearchInput(input: string | null | undefined): string {
  if (input == null) return "";
  let s = String(input).replace(HTML_TAG, "");
  for (const pattern of SQL_PATTERNS) s = s.replace(pattern, "");
  // Drop control characters and backslashes
  s = s.replace(/[\x00-\x1f\x7f\\]/g, "");
  return s.trim().slice(0, MAX_LENGTH);
}
