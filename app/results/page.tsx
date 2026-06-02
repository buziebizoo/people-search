import Link from "next/link";
import ResultsSearchBar from "@/components/ResultsSearchBar";
import ImageResultsPanel from "@/components/ImageResultsPanel";
import { createServerClient } from "@/lib/supabase";

type SearchParams = {
  type?: string;
  first?: string;
  last?: string;
  location?: string;
  q?: string;
  street?: string;
};

type Person = {
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

function queryLabel(params: SearchParams): string {
  const { type, first, last, q, street, location } = params;
  if (type === "name") {
    const name = [first, last].filter(Boolean).join(" ");
    return name || "Name Search";
  }
  if (type === "phone") return q || "Phone Search";
  if (type === "image") return "Image Search";
  if (type === "address") {
    const addr = [street, location].filter(Boolean).join(", ");
    return addr || "Address Search";
  }
  if (type === "screenshot") return "Screenshot Search";
  return "People Search";
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const label = queryLabel(params);

  if (params.type === "image") {
    return (
      <div className="bg-gray-50 flex-1">
        <ResultsSearchBar
          initialType="image"
          initialFirst={params.first}
          initialLast={params.last}
          initialLocation={params.location}
          initialPhone={params.q}
          initialStreet={params.street}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <ImageResultsPanel />
        </div>
      </div>
    );
  }

  const supabase = createServerClient();
  if (!supabase) {
    return (
      <div className="bg-gray-50 flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-red-500">Search is temporarily unavailable. Please try again shortly.</p>
        </div>
      </div>
    );
  }
  let query = supabase.from("people").select("*").limit(20);

  if (params.type === "name") {
    if (params.first) query = query.ilike("first_name", `%${params.first}%`);
    if (params.last) query = query.ilike("last_name", `%${params.last}%`);
    if (params.location) {
      const city = params.location.split(",")[0].trim();
      if (city) query = query.ilike("city", `%${city}%`);
    }
  } else if (params.type === "phone") {
    if (params.q) query = query.ilike("phone", `%${params.q}%`);
  } else if (params.type === "address") {
    if (params.street) query = query.ilike("address", `%${params.street}%`);
    if (params.location) {
      const city = params.location.split(",")[0].trim();
      if (city) query = query.ilike("city", `%${city}%`);
    }
  }

  const { data: results, error } = await query;

  if (error) {
    return (
      <div className="bg-gray-50 flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-red-500">Error loading results. Please try again.</p>
        </div>
      </div>
    );
  }

  const people = (results ?? []) as Person[];

  return (
    <div className="bg-gray-50 flex-1">
      {/* Condensed search bar */}
      <ResultsSearchBar
        initialType={params.type ?? "name"}
        initialFirst={params.first}
        initialLast={params.last}
        initialLocation={params.location}
        initialPhone={params.q}
        initialStreet={params.street}
      />

      {/* Page body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Result count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing{" "}
          <span className="font-semibold text-gray-800">{people.length} results</span>{" "}
          for <span className="font-semibold text-gray-800">{label}</span>
        </p>

        {/* ── AD UNIT ── replace with ad tag before launch ── */}
        <div className="w-[728px] max-w-full h-[90px] mx-auto bg-gray-200 flex items-center justify-center text-gray-400 text-sm mb-6">
          Advertisement
        </div>

        {/* Empty state */}
        {people.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No results found for &ldquo;{label}&rdquo;.</p>
            <Link href="/" className="mt-4 inline-block text-teal-600 hover:underline text-sm">
              ← Try a new search
            </Link>
          </div>
        )}

        {/* Result cards */}
        {people.length > 0 && (
          <div className="flex flex-col gap-4">
            {people.map((person) => (
              <div
                key={person.id}
                className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm"
              >
                {/* Top row: name/age and location */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      {person.full_name}
                    </span>
                    {person.age && (
                      <span className="ml-2 text-sm text-gray-400">
                        Age {person.age}
                      </span>
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
                    {[
                      person.address,
                      person.city,
                      [person.state, person.zip].filter(Boolean).join(" "),
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                {/* Phone teaser */}
                {person.phone_prefix && (
                  <p className="text-sm text-gray-400 italic mb-2">
                    Phone: {person.phone_prefix}-***-****
                  </p>
                )}

                {/* Relatives */}
                {person.relatives?.length > 0 && (
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-medium">Possible relatives:</span>{" "}
                    {person.relatives.join(" · ")}
                  </p>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/profile/${person.id}`}
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
        )}

        {/* Inline FCRA disclaimer */}
        <p className="text-xs text-gray-400 border-t border-gray-100 pt-6 mt-8 leading-relaxed">
          PeopleFind is not a consumer reporting agency as defined by the Fair
          Credit Reporting Act (FCRA). The information available on this site
          may not be used for any purpose covered by the FCRA, including tenant
          screening, employment decisions, or credit determinations. Use of this
          site signifies your agreement to our{" "}
          <Link href="/terms" className="underline hover:text-gray-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-gray-600">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
