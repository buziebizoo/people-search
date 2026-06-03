import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase";
import { SLUG_TO_STATE } from "@/lib/states";
import StateSearchBar from "@/components/StateSearchBar";

type Props = {
  params: Promise<{ state: string; city: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const PAGE_SIZE = 25;

function slugToQuery(slug: string) {
  return slug.replace(/-/g, " ");
}

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const stateInfo = SLUG_TO_STATE.get(stateSlug);
  if (!stateInfo) return {};
  const cityDisplay = toTitleCase(slugToQuery(citySlug));
  return {
    title: `Find People in ${cityDisplay}, ${stateInfo.name} | Who Is My Date?`,
    description: `Search public records for people in ${cityDisplay}, ${stateInfo.name}.`,
  };
}

// ---------------------------------------------------------------------------
// Pagination helper
// ---------------------------------------------------------------------------

function PaginationBar({
  currentPage,
  totalPages,
  baseHref,
}: {
  currentPage: number;
  totalPages: number;
  baseHref: string;
}) {
  if (totalPages <= 1) return null;

  const pageHref = (p: number) =>
    p === 1 ? baseHref : `${baseHref}?page=${p}`;

  // Build the window: always show first, last, and up to 3 around current
  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (let p = Math.max(1, currentPage - 1); p <= Math.min(totalPages, currentPage + 1); p++) {
    pages.add(p);
  }
  const pageList = [...pages].sort((a, b) => a - b);

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 pt-6 mt-6">
      <Link
        href={currentPage > 1 ? pageHref(currentPage - 1) : "#"}
        className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
          currentPage > 1
            ? "text-teal-600 hover:bg-teal-50"
            : "text-gray-300 pointer-events-none"
        }`}
      >
        ← Previous
      </Link>

      <div className="flex items-center gap-1">
        {pageList.map((p, i) => {
          const prev = pageList[i - 1];
          const gap = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-1">
              {gap && <span className="text-gray-300 px-1 text-sm">…</span>}
              <Link
                href={pageHref(p)}
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
        href={currentPage < totalPages ? pageHref(currentPage + 1) : "#"}
        className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
          currentPage < totalPages
            ? "text-teal-600 hover:bg-teal-50"
            : "text-gray-300 pointer-events-none"
        }`}
      >
        Next →
      </Link>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CityPage({ params, searchParams }: Props) {
  const { state: stateSlug, city: citySlug } = await params;
  const { page: pageParam } = await searchParams;

  const stateInfo = SLUG_TO_STATE.get(stateSlug);
  if (!stateInfo) notFound();

  const cityQuery = slugToQuery(citySlug);
  const cityDisplay = toTitleCase(cityQuery);
  const page = Math.max(1, parseInt(String(pageParam ?? "1"), 10) || 1);
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const supabase = createServerClient();

  let totalCount = 0;
  let people: { id: string; first_name: string | null; last_name: string | null; age: number | null; address: string | null; city: string | null; zip: string | null }[] = [];

  if (supabase) {
    const [countResult, dataResult] = await Promise.all([
      supabase
        .from("people")
        .select("*", { count: "exact", head: true })
        .eq("state", stateInfo.code)
        .ilike("city", cityQuery)
        .eq("opted_out", false),
      supabase
        .from("people")
        .select("id, first_name, last_name, age, address, city, zip")
        .eq("state", stateInfo.code)
        .ilike("city", cityQuery)
        .eq("opted_out", false)
        .order("last_name", { ascending: true })
        .order("first_name", { ascending: true })
        .range(start, end),
    ]);
    totalCount = countResult.count ?? 0;
    people = dataResult.data ?? [];
  }

  const totalPages = totalCount > 0 ? Math.ceil(totalCount / PAGE_SIZE) : 0;

  const baseHref = `/people/${stateSlug}/${citySlug}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1 flex-wrap">
        <Link href="/people" className="hover:text-teal-600 transition-colors">
          All States
        </Link>
        <span>›</span>
        <Link
          href={`/people/${stateSlug}`}
          className="hover:text-teal-600 transition-colors"
        >
          {stateInfo.name}
        </Link>
        <span>›</span>
        <span className="text-gray-700">{cityDisplay}</span>
      </nav>

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Find People in{" "}
          <span className="text-teal-600">
            {cityDisplay}, {stateInfo.name}
          </span>
        </h1>
        {totalCount > 0 && (
          <p className="text-gray-500 text-base">
            <strong className="text-gray-800">
              {totalCount.toLocaleString()}
            </strong>{" "}
            public records found in {cityDisplay},{" "}
            {stateInfo.name}
            {totalPages > 1 && (
              <span className="text-gray-400 text-sm ml-2">
                — page {page} of {totalPages.toLocaleString()}
              </span>
            )}
          </p>
        )}
      </div>

      {/* SEO intro */}
      <p className="text-gray-600 leading-relaxed mb-8">
        Browse public records for people in {cityDisplay}, {stateInfo.name}.
        Find addresses, phone numbers, and background information for residents
        of {cityDisplay}.
      </p>

      {/* Search bar */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Search for someone in {cityDisplay}, {stateInfo.name}
        </p>
        <StateSearchBar stateName={`${cityDisplay}, ${stateInfo.code}`} />
      </div>

      {/* No results */}
      {totalCount === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No records found for {cityDisplay}.</p>
          <p className="text-sm mb-5">
            Try searching by name or browse other cities in{" "}
            <Link
              href={`/people/${stateSlug}`}
              className="text-teal-600 hover:underline"
            >
              {stateInfo.name}
            </Link>
            .
          </p>
          <Link
            href={`/people/${stateSlug}`}
            className="text-sm text-teal-600 hover:underline"
          >
            ← Back to {stateInfo.name}
          </Link>
        </div>
      )}

      {/* People list */}
      {people.length > 0 && (
        <>
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
            {people.map((person) => {
              const fullAddress = [
                person.address,
                person.city ? toTitleCase(person.city) : null,
                [stateInfo.code, person.zip].filter(Boolean).join(" "),
              ]
                .filter(Boolean)
                .join(", ");

              const displayName = [
                person.first_name
                  ? toTitleCase(person.first_name)
                  : null,
                person.last_name ? toTitleCase(person.last_name) : null,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <Link
                  key={person.id}
                  href={`/profile/${person.id}`}
                  className="flex items-center justify-between px-5 py-4 bg-white hover:bg-teal-50 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 group-hover:text-teal-700 truncate">
                      {displayName}
                    </p>
                    {fullAddress && (
                      <p className="text-sm text-gray-400 truncate mt-0.5">
                        {fullAddress}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    {person.age && (
                      <span className="text-sm text-gray-400">
                        Age {person.age}
                      </span>
                    )}
                    <span className="text-teal-600 text-sm font-medium group-hover:underline">
                      View →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <PaginationBar
            currentPage={page}
            totalPages={totalPages}
            baseHref={baseHref}
          />
        </>
      )}

      {/* FCRA disclaimer */}
      <p className="mt-10 text-xs text-gray-400 border-t border-gray-100 pt-6 leading-relaxed">
        Who Is My Date? is not a consumer reporting agency as defined by the FCRA.
        Information is sourced from publicly available government records and is
        provided for informational purposes only. Use of this site signifies your
        agreement to our{" "}
        <Link href="/terms" className="underline hover:text-gray-600">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="underline hover:text-gray-600">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
