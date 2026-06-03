import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase";
import { SLUG_TO_STATE, STATES } from "@/lib/states";
import StateSearchBar from "@/components/StateSearchBar";

type Props = { params: Promise<{ state: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: slug } = await params;
  const info = SLUG_TO_STATE.get(slug);
  if (!info) return {};
  return {
    title: `Find People in ${info.name} - Free Public Records Search | Who Is My Date?`,
    description: `Search public records for people in ${info.name}. Find addresses, phone numbers and more.`,
  };
}

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function countBy<T>(arr: T[], key: (item: T) => string): [string, number][] {
  const map: Record<string, number> = {};
  for (const item of arr) {
    const k = key(item);
    if (k) map[k] = (map[k] ?? 0) + 1;
  }
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

export default async function StatePage({ params }: Props) {
  const { state: slug } = await params;
  const info = SLUG_TO_STATE.get(slug);
  if (!info) notFound();

  const supabase = createServerClient();

  let totalCount = 0;
  let sample: { city: string | null; first_name: string | null; last_name: string | null }[] = [];

  if (supabase) {
    const [countResult, sampleResult] = await Promise.all([
      supabase
        .from("people")
        .select("*", { count: "exact", head: true })
        .eq("state", info.code),
      supabase
        .from("people")
        .select("city, first_name, last_name")
        .eq("state", info.code)
        .limit(3000),
    ]);
    totalCount = countResult.count ?? sampleResult.data?.length ?? 0;
    sample = sampleResult.data ?? [];
  }

  const topCities = countBy(sample, (r) => r.city ?? "")
    .filter(([c]) => c.length > 0)
    .slice(0, 20)
    .map(([city, count]) => ({
      city,
      count,
      slug: city.toLowerCase().replace(/\s+/g, "-"),
    }));

  const topFirstNames = countBy(sample, (r) => r.first_name ?? "")
    .filter(([n]) => n.length > 0)
    .slice(0, 15);

  const topLastNames = countBy(sample, (r) => r.last_name ?? "")
    .filter(([n]) => n.length > 0)
    .slice(0, 15);

  const formattedCount = totalCount.toLocaleString();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/people" className="hover:text-teal-600 transition-colors">
          All States
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{info.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Find People in{" "}
          <span className="text-teal-600">{info.name}</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Search public records for{" "}
          {totalCount > 0 ? (
            <>
              <strong className="text-gray-900">{formattedCount}</strong>{" "}
              people in {info.name}
            </>
          ) : (
            <>{info.name}</>
          )}
          . Data sourced from voter registration and other government records.
        </p>
      </div>

      {/* Search bar */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-10">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Search for someone in {info.name}
        </p>
        <StateSearchBar stateName={info.name} />
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Top cities */}
        {topCities.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Top Cities in {info.name}
            </h2>
            <ul className="space-y-1">
              {topCities.map(({ city, count, slug: citySlug }) => (
                <li key={city}>
                  <Link
                    href={`/people/${info.slug}/${citySlug}`}
                    className="flex items-center justify-between group py-1.5 px-2 rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-teal-700">
                      {toTitleCase(city)}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-teal-500">
                      {count.toLocaleString()} records →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Common names */}
        {(topFirstNames.length > 0 || topLastNames.length > 0) && (
          <section className="space-y-6">
            {topFirstNames.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Common First Names
                </h2>
                <div className="flex flex-wrap gap-2">
                  {topFirstNames.map(([name]) => (
                    <Link
                      key={name}
                      href={`/results?type=name&first=${encodeURIComponent(
                        toTitleCase(name)
                      )}&location=${encodeURIComponent(info.name)}`}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-teal-100 hover:text-teal-700 text-gray-700 text-sm rounded-full transition-colors"
                    >
                      {toTitleCase(name)}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {topLastNames.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Common Last Names
                </h2>
                <div className="flex flex-wrap gap-2">
                  {topLastNames.map(([name]) => (
                    <Link
                      key={name}
                      href={`/results?type=name&last=${encodeURIComponent(
                        toTitleCase(name)
                      )}&location=${encodeURIComponent(info.name)}`}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-teal-100 hover:text-teal-700 text-gray-700 text-sm rounded-full transition-colors"
                    >
                      {toTitleCase(name)}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Empty state for states with no data */}
      {topCities.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No records yet for {info.name}.</p>
          <p className="text-sm">
            We&apos;re continuously expanding our dataset. Try searching by name
            and state to see what&apos;s available.
          </p>
          <Link
            href="/people"
            className="inline-block mt-4 text-teal-600 hover:underline text-sm"
          >
            ← Browse other states
          </Link>
        </div>
      )}

      {/* FCRA disclaimer */}
      <p className="mt-12 text-xs text-gray-400 border-t border-gray-100 pt-6 leading-relaxed">
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
