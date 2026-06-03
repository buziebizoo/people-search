import Link from "next/link";
import { createServerClient } from "@/lib/supabase";

const STATES: Record<string, { name: string; slug: string }> = {
  OH: { name: "Ohio",             slug: "ohio" },
  NC: { name: "North Carolina",   slug: "north-carolina" },
  FL: { name: "Florida",          slug: "florida" },
  TX: { name: "Texas",            slug: "texas" },
  CA: { name: "California",       slug: "california" },
  PA: { name: "Pennsylvania",     slug: "pennsylvania" },
  GA: { name: "Georgia",          slug: "georgia" },
  MI: { name: "Michigan",         slug: "michigan" },
  CO: { name: "Colorado",         slug: "colorado" },
  NY: { name: "New York",         slug: "new-york" },
  IL: { name: "Illinois",         slug: "illinois" },
  AZ: { name: "Arizona",          slug: "arizona" },
  WA: { name: "Washington",       slug: "washington" },
  TN: { name: "Tennessee",        slug: "tennessee" },
  MO: { name: "Missouri",         slug: "missouri" },
  MD: { name: "Maryland",         slug: "maryland" },
  WI: { name: "Wisconsin",        slug: "wisconsin" },
  MN: { name: "Minnesota",        slug: "minnesota" },
  SC: { name: "South Carolina",   slug: "south-carolina" },
  AL: { name: "Alabama",          slug: "alabama" },
  LA: { name: "Louisiana",        slug: "louisiana" },
  KY: { name: "Kentucky",         slug: "kentucky" },
  OR: { name: "Oregon",           slug: "oregon" },
  OK: { name: "Oklahoma",         slug: "oklahoma" },
  CT: { name: "Connecticut",      slug: "connecticut" },
  UT: { name: "Utah",             slug: "utah" },
  NV: { name: "Nevada",           slug: "nevada" },
  AR: { name: "Arkansas",         slug: "arkansas" },
  MS: { name: "Mississippi",      slug: "mississippi" },
  KS: { name: "Kansas",           slug: "kansas" },
  NM: { name: "New Mexico",       slug: "new-mexico" },
  NE: { name: "Nebraska",         slug: "nebraska" },
  WV: { name: "West Virginia",    slug: "west-virginia" },
  ID: { name: "Idaho",            slug: "idaho" },
  HI: { name: "Hawaii",           slug: "hawaii" },
  NH: { name: "New Hampshire",    slug: "new-hampshire" },
  ME: { name: "Maine",            slug: "maine" },
  MT: { name: "Montana",          slug: "montana" },
  RI: { name: "Rhode Island",     slug: "rhode-island" },
  DE: { name: "Delaware",         slug: "delaware" },
  SD: { name: "South Dakota",     slug: "south-dakota" },
  ND: { name: "North Dakota",     slug: "north-dakota" },
  AK: { name: "Alaska",           slug: "alaska" },
  VT: { name: "Vermont",          slug: "vermont" },
  WY: { name: "Wyoming",          slug: "wyoming" },
  DC: { name: "Washington D.C.",  slug: "washington-dc" },
  VA: { name: "Virginia",         slug: "virginia" },
  NJ: { name: "New Jersey",       slug: "new-jersey" },
  IN: { name: "Indiana",          slug: "indiana" },
  IA: { name: "Iowa",             slug: "iowa" },
  MA: { name: "Massachusetts",    slug: "massachusetts" },
};

async function getStates(): Promise<string[]> {
  const supabase = createServerClient();
  if (!supabase) return [];
  const seen = new Set<string>();
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("people")
      .select("state")
      .range(from, from + 999);
    if (error || !data || data.length === 0) break;
    data.forEach((r) => r.state && seen.add(r.state));
    if (data.length < 1000) break;
    from += 1000;
  }
  return [...seen].sort();
}

export default async function DirectorySection() {
  const states = await getStates();

  if (states.length === 0) return null;

  return (
    <section className="bg-gray-50 py-14 px-4 sm:px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Browse by State</h2>
        <div className="flex flex-wrap gap-2">
          {states.map((code) => {
            const state = STATES[code] ?? { name: code, slug: code.toLowerCase() };
            return (
              <Link
                key={code}
                href={`/people/${state.slug}`}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-full hover:bg-teal-700 transition-colors"
              >
                {state.name}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
