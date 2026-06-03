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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SearchParams = {
  type?: string;
  first?: string;
  last?: string;
  location?: string;
  q?: string;
  street?: string;
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
  phone_teaser: string | null; // e.g. "310-***-****" or null
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
    profileHref:  `/profile/${p.id}`,
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

/**
 * Sort DisplayPerson[] so city+state matches come first, then state-only, then rest.
 * Case-insensitive. Mutates a copy — original array is not changed.
 */
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

/**
 * Parse a free-form location string into city + 2-letter state code.
 * Handles: "san diego, ca" | "san diego ca" | "CA" | "San Diego CA"
 */
function parseLocation(raw: string): { city: string; state: string } {
  const s = raw.trim();
  if (!s) return { city: "", state: "" };

  // Prefer comma split: "san diego, ca"
  if (s.includes(",")) {
    const [cityPart, statePart] = s.split(",");
    return {
      city:  (cityPart ?? "").trim(),
      state: (statePart ?? "").trim().toUpperCase(),
    };
  }

  // No comma — take the last whitespace-separated token as state
  const words = s.trim().split(/\s+/);
  if (words.length === 1) {
    // Could be just a state code
    return { city: "", state: words[0].toUpperCase() };
  }
  const state = words[words.length - 1].toUpperCase();
  const city  = words.slice(0, -1).join(" ");
  return { city, state };
}

// Shared empty-state UI
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
// Page
// ---------------------------------------------------------------------------

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // No search type — show prompt
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
  let display: DisplayPerson[] = [];

  // ── PHONE: Enformion only ─────────────────────────────────────────────────
  if (params.type === "phone") {
    if (params.q) {
      const enf = await searchByPhone(params.q);
      display = enf.map(fromEnformion);
    }

    if (display.length === 0) return <EmptyState params={params} />;

    return <ResultsList params={params} label={label} people={display} />;
  }

  // ── NAME / ADDRESS: Supabase first, Enformion fallback ───────────────────
  const supabase = createServerClient();
  if (!supabase) return <ErrorState />;

  let query = supabase.from("people").select("*").limit(20);

  if (params.type === "name") {
    if (params.first) query = query.ilike("first_name", `%${params.first}%`);
    if (params.last)  query = query.ilike("last_name",  `%${params.last}%`);
    if (params.location) {
      const { city } = parseLocation(params.location);
      if (city) query = query.ilike("city", `%${city}%`);
    }
  } else if (params.type === "address") {
    if (params.street) query = query.ilike("address", `%${params.street}%`);
    if (params.location) {
      const { city } = parseLocation(params.location);
      if (city) query = query.ilike("city", `%${city}%`);
    }
  }

  const { data: rows, error } = await query;
  if (error) return <ErrorState />;

  const supabaseHits = (rows ?? []) as SupabasePerson[];
  console.log(`[results] Supabase returned ${supabaseHits.length} rows for type=${params.type}`);

  if (supabaseHits.length > 0) {
    display = supabaseHits.map(fromSupabase);
  } else {
    // Fall back to Enformion
    if (params.type === "name") {
      const { city, state } = parseLocation(params.location ?? "");
      console.log(`[results] Supabase 0 results — triggering Enformion name fallback: first="${params.first}" last="${params.last}" city="${city}" state="${state}"`);
      const enf = await searchByName(params.first ?? "", params.last ?? "", city, state);
      console.log(`[results] Enformion name fallback returned ${enf.length} results`);
      display = sortByLocation(enf.map(fromEnformion), city, state);
    } else if (params.type === "address") {
      const parts = (params.location ?? "").split(",");
      const city  = parts[0]?.trim() ?? "";
      const state = parts[1]?.trim() ?? "";
      console.log(`[results] Supabase 0 results — triggering Enformion address fallback: street="${params.street}" city="${city}" state="${state}"`);
      const enf   = await searchByAddress(params.street ?? "", city, state, "");
      console.log(`[results] Enformion address fallback returned ${enf.length} results`);
      display = enf.map(fromEnformion);
    }
  }

  if (display.length === 0) return <EmptyState params={params} />;

  return <ResultsList params={params} label={label} people={display} />;
}

// ---------------------------------------------------------------------------
// ResultsList sub-component
// ---------------------------------------------------------------------------

function ResultsList({
  params,
  label,
  people,
}: {
  params: SearchParams;
  label: string;
  people: DisplayPerson[];
}) {
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
        <p className="text-sm text-gray-500 mb-4">
          Showing{" "}
          <span className="font-semibold text-gray-800">{people.length} results</span>{" "}
          for <span className="font-semibold text-gray-800">{label}</span>
        </p>

        {/* ── AD UNIT ── */}
        <div className="w-[728px] max-w-full h-[90px] mx-auto bg-gray-200 flex items-center justify-center text-gray-400 text-sm mb-6">
          Advertisement
        </div>

        <div className="flex flex-col gap-4">
          {people.map((person) => (
            <div key={person.key} className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm">
              {/* Name / age / location */}
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

              {/* Address */}
              {person.address && (
                <p className="text-sm text-gray-400 mb-2">
                  {[person.address, person.city, [person.state, person.zip].filter(Boolean).join(" ")]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}

              {/* Phone teaser */}
              {person.phone_teaser && (
                <p className="text-sm text-gray-400 italic mb-2">Phone: {person.phone_teaser}</p>
              )}

              {/* Relatives */}
              {person.relatives.length > 0 && (
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Possible relatives:</span>{" "}
                  {person.relatives.join(" · ")}
                </p>
              )}

              {/* Actions */}
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

        {/* FCRA disclaimer */}
        <p className="text-xs text-gray-400 border-t border-gray-100 pt-6 mt-8 leading-relaxed">
          PeopleFind is not a consumer reporting agency as defined by the Fair Credit
          Reporting Act (FCRA). The information available on this site may not be used
          for any purpose covered by the FCRA, including tenant screening, employment
          decisions, or credit determinations. Use of this site signifies your agreement
          to our{" "}
          <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
