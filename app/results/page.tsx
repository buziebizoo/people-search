import type { Metadata } from "next";
import Link from "next/link";
import ResultsSearchBar from "@/components/ResultsSearchBar";
import { createServerClient } from "@/lib/supabase";
import {
  searchByName,
  searchByPhone,
  searchByAddress,
  enformionProfileHref,
  type EnformionPerson,
} from "@/lib/enformion";
import { buildSupabaseSlug } from "@/lib/profile-slug";
import { fetchBlocklist, isBlocklisted } from "@/lib/blocklist";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const PAGE_SIZE = 20;

type SearchParams = {
  type?: string;
  first?: string;
  last?: string;
  location?: string;
  q?: string;
  street?: string;
  page?: string;
};

type SupabasePerson = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  age: number;
  city: string;
  state: string;
  zip: string;
  address: string;
  phone_prefix: string;
  relatives: string[];
};

// Unified display shape — works for both Supabase and Enformion results
type DisplayPerson = {
  key: string;
  full_name: string;
  age: number | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  address: string | null;
  phone_teaser: string | null;
  relatives: string[];
  profileHref: string;
};

// ---------------------------------------------------------------------------
// Normalizers
// ---------------------------------------------------------------------------

function fromSupabase(p: SupabasePerson): DisplayPerson {
  return {
    key:          p.id,
    full_name:    p.full_name,
    age:          p.age ?? null,
    city:         p.city ?? null,
    state:        p.state ?? null,
    zip:          p.zip ?? null,
    address:      p.address ?? null,
    phone_teaser: p.phone_prefix ? `${p.phone_prefix}-***-****` : null,
    relatives:    p.relatives ?? [],
    profileHref:  `/profile/${buildSupabaseSlug(p.first_name, p.last_name, p.city, p.state, p.id)}`,
  };
}

function fromEnformion(p: EnformionPerson, idx: number): DisplayPerson {
  const prefix = p.phones[0]?.slice(0, 3) ?? null;
  return {
    key:          `enf-${idx}`,
    full_name:    p.full_name,
    age:          p.age,
    city:         p.city,
    state:        p.state,
    zip:          p.zip,
    address:      p.address,
    phone_teaser: prefix ? `${prefix}-***-****` : null,
    relatives:    p.relatives,
    profileHref:  enformionProfileHref(p),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function queryLabel(params: SearchParams): string {
  const { type, first, last, q, street, location } = params;
  if (type === "name") return [first, last].filter(Boolean).join(" ") || "Name Search";
  if (type === "phone") return q || "Phone Search";
  if (type === "address") return [street, location].filter(Boolean).join(", ") || "Address Search";
  return "People Search";
}

function sortByLocation(people: DisplayPerson[], city: string, state: string): DisplayPerson[] {
  const normCity  = city.trim().toLowerCase();
  const normState = state.trim().toLowerCase();
  function score(p: DisplayPerson): number {
    const pCity  = (p.city  ?? "").toLowerCase();
    const pState = (p.state ?? "").toLowerCase();
    if (normCity && normState && pCity === normCity && pState === normState) return 0;
    if (normState && pState === normState) return 1;
    return 2;
  }
  return [...people].sort((a, b) => score(a) - score(b));
}

function parseLocation(raw: string): { city: string; state: string } {
  const s = raw.trim();
  if (!s) return { city: "", state: "" };
  if (s.includes(",")) {
    const [cityPart, statePart] = s.split(",");
    return { city: (cityPart ?? "").trim(), state: (statePart ?? "").trim().toUpperCase() };
  }
  const words = s.trim().split(/\s+/);
  if (words.length === 1) return { city: "", state: words[0].toUpperCase() };
  return { city: words.slice(0, -1).join(" "), state: words[words.length - 1].toUpperCase() };
}

const ABBREV_PAIRS: [string, string][] = [
  ["st", "street"], ["ave", "avenue"], ["blvd", "boulevard"], ["dr", "drive"],
  ["rd", "road"], ["ln", "lane"], ["ct", "court"], ["pl", "place"],
  ["pkwy", "parkway"], ["hwy", "highway"],
];

function streetVariants(input: string): string[] {
  const s = input.trim().toLowerCase();
  const variants = new Set([s]);
  for (const [abbrev, full] of ABBREV_PAIRS) {
    if (new RegExp(`\\b${abbrev}\\b`).test(s))
      variants.add(s.replace(new RegExp(`\\b${abbrev}\\b`), full));
    if (new RegExp(`\\b${full}\\b`).test(s))
      variants.add(s.replace(new RegExp(`\\b${full}\\b`), abbrev));
  }
  return Array.from(variants);
}

/** Build a results URL preserving all current params but overriding page. */
function pageHref(params: SearchParams, page: number): string {
  const sp = new URLSearchParams();
  if (params.type)     sp.set("type",     params.type);
  if (params.first)    sp.set("first",    params.first);
  if (params.last)     sp.set("last",     params.last);
  if (params.location) sp.set("location", params.location);
  if (params.q)        sp.set("q",        params.q);
  if (params.street)   sp.set("street",   params.street);
  if (page > 1)        sp.set("page",     String(page));
  return `/results?${sp}`;
}

// ---------------------------------------------------------------------------
// Empty / Error states
// ---------------------------------------------------------------------------

function EmptyState({ params }: { params: SearchParams }) {
  return (
    <div className="bg-gray-50 flex-1">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <svg className="mx-auto mb-5 h-12 w-12 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0Z" />
        </svg>
        <p className="text-gray-700 text-xl font-medium">Oops! We couldn&rsquo;t find anyone matching that name.</p>
        <p className="text-gray-500 mt-2">Try a different spelling or location.</p>
      </div>
      <ResultsSearchBar
        initialType={params.type ?? "name"}
        initialFirst={params.first}
        initialLast={params.last}
        initialLocation={params.location}
        initialPhone={params.q}
        initialStreet={params.street}
      />
    </div>
  );
}

function ErrorState() {
  return (
    <div className="bg-gray-50 flex-1">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
        <svg className="mx-auto mb-5 h-14 w-14 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <p className="text-gray-700 text-xl font-medium">Search temporarily unavailable.</p>
        <p className="text-gray-500 mt-2">Please try again shortly.</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagination bar
// ---------------------------------------------------------------------------

function PaginationBar({
  params,
  currentPage,
  totalPages,
}: {
  params: SearchParams;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  // Build page list: always include 1, last, and up to 2 around current
  const pageSet = new Set<number>();
  pageSet.add(1);
  pageSet.add(totalPages);
  for (let p = Math.max(1, currentPage - 1); p <= Math.min(totalPages, currentPage + 1); p++) {
    pageSet.add(p);
  }
  const pages = [...pageSet].sort((a, b) => a - b);

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 pt-6 mt-6">
      <Link
        href={currentPage > 1 ? pageHref(params, currentPage - 1) : "#"}
        className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
          currentPage > 1 ? "text-teal-600 hover:bg-teal-50" : "text-gray-300 pointer-events-none"
        }`}
      >
        ← Previous
      </Link>

      <div className="flex items-center gap-1">
        {pages.map((p, i) => {
          const prev = pages[i - 1];
          const gap = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-1">
              {gap && <span className="text-gray-300 px-1 text-sm">…</span>}
              <Link
                href={pageHref(params, p)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === currentPage
                    ? "bg-teal-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </Link>
            </span>
          );
        })}
      </div>

      <Link
        href={currentPage < totalPages ? pageHref(params, currentPage + 1) : "#"}
        className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
          currentPage < totalPages ? "text-teal-600 hover:bg-teal-50" : "text-gray-300 pointer-events-none"
        }`}
      >
        Next →
      </Link>
    </nav>
  );
}

// Force dynamic rendering — prevents Next.js / Vercel edge caching the page,
// which would skip server-side execution (and therefore blocklist filtering).
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = queryLabel(params);
  const title = `Results for ${query} | Who Is My Date?`;
  const description = `Find people named ${query} on Who Is My Date - free public records search.`;
  return { title, description, openGraph: { title, description } };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const start = (page - 1) * PAGE_SIZE;
  const end   = start + PAGE_SIZE - 1;

  console.log(`[results] ResultsPage executing: type=${params.type} first="${params.first}" last="${params.last}" page=${page}`);

  if (!params.type) {
    return (
      <div className="bg-gray-50 flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
          <svg className="mx-auto mb-5 h-14 w-14 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0Z" />
          </svg>
          <p className="text-gray-700 text-xl font-medium">Enter a name to begin your search</p>
        </div>
      </div>
    );
  }

  const label = queryLabel(params);

  // Fetch blocklist once; applied to every result source below
  const blocklist = await fetchBlocklist();
  const notBlocked = <T extends { first_name: string; last_name: string; address: string | null }>(
    rows: T[],
  ) => rows.filter((p) => !isBlocklisted(p.first_name, p.last_name, p.address, blocklist));

  // ── PHONE: Enformion only, no pagination ─────────────────────────────────
  if (params.type === "phone") {
    const display: DisplayPerson[] = params.q
      ? notBlocked(await searchByPhone(params.q)).map(fromEnformion)
      : [];
    if (display.length === 0) return <EmptyState params={params} />;
    return (
      <ResultsList
        params={params} label={label} people={display}
        page={1} totalPages={1} total={display.length}
      />
    );
  }

  // ── NAME / ADDRESS: Supabase + Enformion simultaneously ──────────────────
  const supabase = createServerClient();
  if (!supabase) return <ErrorState />;

  let baseQuery = supabase.from("people").select("*", { count: "exact" }).eq("opted_out", false);
  let city = "";
  let state = "";

  if (params.type === "name") {
    if (params.first)    baseQuery = baseQuery.ilike("first_name", `%${params.first}%`);
    if (params.last)     baseQuery = baseQuery.ilike("last_name",  `%${params.last}%`);
    if (params.location) {
      const loc = parseLocation(params.location);
      city = loc.city; state = loc.state;
      if (city) baseQuery = baseQuery.ilike("city", `%${city}%`);
    }
  } else if (params.type === "address") {
    if (params.street) {
      const variants = streetVariants(params.street);
      baseQuery = baseQuery.or(variants.map((v) => `address.ilike.%${v}%`).join(","));
    }
    if (params.location) {
      const loc = parseLocation(params.location);
      city = loc.city; state = loc.state;
      if (city)                        baseQuery = baseQuery.ilike("city",  `%${city}%`);
      if (state && state.length === 2) baseQuery = baseQuery.eq("state", state);
    }
  }

  // Fire both sources in parallel — Enformion is no longer a fallback
  const enfFetch: Promise<EnformionPerson[]> =
    params.type === "name"
      ? searchByName(params.first ?? "", params.last ?? "", city, state, page, PAGE_SIZE)
      : searchByAddress(params.street ?? "", city, state, "");

  const [{ data: rows, count, error }, enfResults] = await Promise.all([
    baseQuery.range(start, end),
    enfFetch,
  ]);

  if (error) return <ErrorState />;

  // Apply blocklist to both sources
  const supabaseFiltered = notBlocked((rows ?? []) as SupabasePerson[]);
  const enfFiltered      = notBlocked(enfResults);

  console.log(`[results] Supabase: ${supabaseFiltered.length} (total=${count}), Enformion: ${enfFiltered.length} (before dedup)`);
  enfFiltered.forEach((p, i) =>
    console.log(`[results] enf[${i}] first_name="${p.first_name}" last_name="${p.last_name}" address="${p.address ?? "null"}"`),
  );

  // Convert Supabase hits to display shape
  const supabasePeople = supabaseFiltered.map(fromSupabase);

  // Deduplicate: drop Enformion entries whose full_name+city already appear in Supabase
  const dedupe = (fullName: string, personCity: string | null) =>
    `${(fullName ?? "").toLowerCase().trim()}|${(personCity ?? "").toLowerCase().trim()}`;
  const seenKeys = new Set(supabasePeople.map((p) => dedupe(p.full_name, p.city)));
  const enfUnique = enfFiltered
    .filter((p) => !seenKeys.has(dedupe(p.full_name, p.city)))
    .map((p, i) => fromEnformion(p, start + i));

  // Merge and sort by location relevance
  const combined = sortByLocation([...supabasePeople, ...enfUnique], city, state);
  console.log(`[results] merged: ${supabasePeople.length} supabase + ${enfUnique.length} enf-unique = ${combined.length}`);

  if (combined.length === 0) return <EmptyState params={params} />;

  // Pagination anchored to Supabase exact count; Enformion adds extras per page
  const supabaseTotal  = count ?? 0;
  const combinedTotal  = supabaseTotal > 0 ? supabaseTotal + enfUnique.length : null;
  const totalPages     = supabaseTotal > 0
    ? Math.ceil(supabaseTotal / PAGE_SIZE)
    : enfFiltered.length === PAGE_SIZE ? page + 1 : page;

  return (
    <ResultsList
      params={params} label={label} people={combined}
      page={page} totalPages={totalPages} total={combinedTotal}
    />
  );
}

// ---------------------------------------------------------------------------
// ResultsList
// ---------------------------------------------------------------------------

function ResultsList({
  params,
  label,
  people,
  page,
  totalPages,
  total,
}: {
  params: SearchParams;
  label: string;
  people: DisplayPerson[];
  page: number;
  totalPages: number;
  total: number | null;
}) {
  const pageStart = (page - 1) * PAGE_SIZE + 1;
  const pageEnd   = (page - 1) * PAGE_SIZE + people.length;

  return (
    <div className="bg-gray-50 flex-1">
      <ResultsSearchBar
        initialType={params.type ?? "name"}
        initialFirst={params.first}
        initialLast={params.last}
        initialLocation={params.location}
        initialPhone={params.q}
        initialStreet={params.street}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Result count line */}
        <p className="text-sm text-gray-500 mb-4">
          {total !== null ? (
            <>
              Showing{" "}
              <span className="font-semibold text-gray-800">{pageStart}–{pageEnd}</span>
              {" "}of{" "}
              <span className="font-semibold text-gray-800">{total.toLocaleString()}</span>
              {" "}results for{" "}
              <span className="font-semibold text-gray-800">{label}</span>
            </>
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-gray-800">{people.length} results</span>
              {" "}for{" "}
              <span className="font-semibold text-gray-800">{label}</span>
              {page > 1 && <span className="text-gray-400"> — page {page}</span>}
            </>
          )}
        </p>

        {/* Ad unit */}
        <div className="w-[728px] max-w-full h-[90px] mx-auto bg-gray-200 flex items-center justify-center text-gray-400 text-sm mb-6">
          Advertisement
        </div>

        <div className="flex flex-col gap-4">
          {people.map((person) => (
            <div key={person.key} className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-lg font-bold text-gray-900">{person.full_name}</span>
                  {person.age && (
                    <span className="ml-2 text-sm text-gray-400">Age {person.age}</span>
                  )}
                </div>
                {(person.city || person.state) && (
                  <span className="text-sm text-gray-500">
                    📍 {[person.city, person.state].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>

              {person.address && (
                <p className="text-sm text-gray-400 mb-2">
                  {[person.address, person.city, [person.state, person.zip].filter(Boolean).join(" ")]
                    .filter(Boolean).join(", ")}
                </p>
              )}

              {person.phone_teaser && (
                <p className="text-sm text-gray-400 italic mb-2">Phone: {person.phone_teaser}</p>
              )}

              {person.relatives.length > 0 && (
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Possible relatives:</span>{" "}
                  {person.relatives.join(" · ")}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <Link
                  href={person.profileHref}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  View Full Profile
                </Link>
                <a
                  href="https://www.spokeo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Get Full Report →
                </a>
              </div>
            </div>
          ))}
        </div>

        <PaginationBar params={params} currentPage={page} totalPages={totalPages} />

        <p className="text-xs text-gray-400 border-t border-gray-100 pt-6 mt-8 leading-relaxed">
          Who Is My Date? is not a consumer reporting agency as defined by the Fair Credit
          Reporting Act (FCRA). The information available on this site may not be used
          for any purpose covered by the FCRA, including tenant screening, employment
          decisions, or credit determinations. Use of this site signifies your agreement
          to our{" "}
          <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
