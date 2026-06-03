// Server-side only — never import this from a client component.

const BASE_URL = "https://devapi.enformion.com";

// ---------------------------------------------------------------------------
// In-memory cache — prevents duplicate API charges for repeated searches
// ---------------------------------------------------------------------------

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

type CacheEntry = { result: EnformionPerson[]; expiresAt: number };
const cache = new Map<string, CacheEntry>();

function cacheGet(key: string): EnformionPerson[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  console.log(`[enformion] cache hit: ${key}`);
  return entry.result;
}

function cacheSet(key: string, result: EnformionPerson[]): void {
  cache.set(key, { result, expiresAt: Date.now() + TTL_MS });
}

export type EnformionPerson = {
  first_name: string;
  last_name: string;
  full_name: string;
  age: number | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phones: string[];   // full digits, e.g. "3105551234"
  emails: string[];
  relatives: string[];
};

/** Strip non-digits and remove a leading country code 1 to yield a 10-digit US number. */
function cleanPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 11 && digits[0] === "1" ? digits.slice(1) : digits;
}

async function post(
  path: string,
  body: Record<string, unknown>,
  searchType: string,
): Promise<unknown> {
  console.log(`[enformion] POST ${BASE_URL}${path}`);
  console.log(`[enformion] request body:`, JSON.stringify(body));

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type":       "application/json",
      "galaxy-ap-name":     process.env.ENFORMION_API_KEY ?? "",
      "galaxy-ap-password": process.env.ENFORMION_API_PASS ?? "",
      "galaxy-search-type": searchType,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const rawText = await res.text();
  console.log(`[enformion] response status:`, res.status, res.statusText);
  console.log(`[enformion] raw response:`, rawText.slice(0, 1000));

  if (!res.ok) {
    return null;
  }

  try {
    return JSON.parse(rawText);
  } catch {
    console.error(`[enformion] ${path} — failed to parse JSON`);
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPerson(p: Record<string, any>): EnformionPerson {
  const firstName = String(p.firstName ?? p.first_name ?? "");
  const lastName  = String(p.lastName  ?? p.last_name  ?? "");
  const addrs     = (p.addresses ?? []) as Record<string, string>[];
  const a         = addrs[0] ?? {};
  const phones    = ((p.phones ?? []) as Record<string, string>[])
    .map((ph) => (ph.phoneNumber ?? ph.phone ?? "").replace(/\D/g, ""))
    .filter(Boolean);
  const emails    = ((p.emails ?? []) as Record<string, string>[])
    .map((em) => em.email ?? em.emailAddress ?? "")
    .filter(Boolean);
  const relatives = ((p.relatives ?? []) as Record<string, string>[])
    .map((r) => [r.firstName, r.lastName].filter(Boolean).join(" "))
    .filter(Boolean);

  return {
    first_name: firstName,
    last_name:  lastName,
    full_name:  [firstName, lastName].filter(Boolean).join(" "),
    age:        p.age ? parseInt(String(p.age), 10) || null : null,
    address:    a.address ?? a.streetAddress ?? null,
    city:       a.city ?? null,
    state:      a.state ?? null,
    zip:        a.zip ?? a.zipCode ?? null,
    phones,
    emails,
    relatives,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractPersons(data: any): EnformionPerson[] {
  if (!data) return [];
  const list = data.persons ?? data.results ?? data.data ?? [];
  if (Array.isArray(list)) return list.slice(0, 20).map(mapPerson);
  // Root object is itself a person record
  if (data.firstName || data.first_name) return [mapPerson(data)];
  return [];
}

export async function searchByName(
  firstName: string,
  lastName: string,
  city: string,
  state: string,
): Promise<EnformionPerson[]> {
  const key = `name:${firstName}:${lastName}:${city}:${state}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  try {
    const body: Record<string, unknown> = {
      FirstName: firstName,
      LastName:  lastName,
      Page:      1,
      ResultsPerPage: 10,
    };
    if (city)  body.City  = city;
    if (state) body.State = state;
    const result = extractPersons(
      await post("/contact/enrich", body, "DevAPIContactEnrich")
    );
    cacheSet(key, result);
    return result;
  } catch (err) {
    console.error("[enformion] searchByName error:", err);
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCallerIdResponse(data: Record<string, any>): EnformionPerson | null {
  const p = data?.person;
  if (!p) return null;

  const firstName = String(p.name?.firstName ?? "");
  const lastName  = String(p.name?.lastName  ?? "");
  const addr      = p.address ?? {};
  const phone     = (p.phone?.phoneNumber ?? "").replace(/\D/g, "");
  const email     = p.email ? String(p.email) : null;

  return {
    first_name: firstName,
    last_name:  lastName,
    full_name:  [firstName, lastName].filter(Boolean).join(" "),
    age:        p.age ? parseInt(String(p.age), 10) || null : null,
    address:    addr.street ?? null,
    city:       addr.city   ?? null,
    state:      addr.state  ?? null,
    zip:        addr.zip    ?? null,
    phones:     phone ? [phone] : [],
    emails:     email ? [email] : [],
    relatives:  [],
  };
}

export async function searchByPhone(phoneNumber: string): Promise<EnformionPerson[]> {
  const cleaned = cleanPhone(phoneNumber);
  const key = `phone:${cleaned}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  try {
    console.log(`[enformion] searchByPhone: raw="${phoneNumber}" cleaned="${cleaned}"`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await post(
      "/phone/enrich",
      { Phone: cleaned, Page: 1, ResultsPerPage: 10 },
      "DevAPICallerID",
    ) as Record<string, any> | null;

    const person = mapCallerIdResponse(data ?? {});
    const result = person ? [person] : [];
    cacheSet(key, result);
    return result;
  } catch (err) {
    console.error("[enformion] searchByPhone error:", err);
    return [];
  }
}

export async function searchByAddress(
  address: string,
  city: string,
  state: string,
  zip: string,
): Promise<EnformionPerson[]> {
  const key = `address:${address}:${city}:${state}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  try {
    const body: Record<string, unknown> = {};
    if (address) body.address = address;
    if (city)    body.city    = city;
    if (state)   body.state   = state;
    if (zip)     body.zip     = zip;
    const result = extractPersons(await post("/AddressId/api/AddressId", body, "DevAPIAddressID"));
    cacheSet(key, result);
    return result;
  } catch (err) {
    console.error("[enformion] searchByAddress error:", err);
    return [];
  }
}

/** Build the URL for an Enformion-sourced profile page. */
export function enformionProfileHref(p: EnformionPerson): string {
  const sp = new URLSearchParams();
  sp.set("first", p.first_name);
  sp.set("last",  p.last_name);
  if (p.age)                sp.set("age",       String(p.age));
  if (p.address)            sp.set("address",   p.address);
  if (p.city)               sp.set("city",      p.city);
  if (p.state)              sp.set("state",     p.state);
  if (p.zip)                sp.set("zip",       p.zip);
  if (p.phones.length)      sp.set("phones",    p.phones.join(","));
  if (p.emails.length)      sp.set("emails",    p.emails.join(","));
  if (p.relatives.length)   sp.set("relatives", p.relatives.join("|"));
  return `/profile/enformion?${sp}`;
}
