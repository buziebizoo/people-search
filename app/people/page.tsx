import type { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse People by State | Who Is My Date?",
  description: "Browse public records by state on Who Is My Date?.",
};

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina",
  ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
  TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming", DC: "District of Columbia",
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

export default async function BrowsePage() {
  const states = await getStates();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse by State</h1>
        <p className="text-gray-500 mb-8">
          Select a state to browse public records from that area.
        </p>
        {states.length === 0 ? (
          <p className="text-gray-400 italic">No records available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {states.map((code) => (
              <Link
                key={code}
                href={`/people/${code}`}
                className="bg-white border border-gray-200 rounded-xl px-4 py-4 shadow-sm hover:border-teal-400 hover:shadow-md transition-all group"
              >
                <div className="text-lg font-bold text-teal-600 group-hover:text-teal-700">
                  {code}
                </div>
                <div className="text-sm text-gray-600">
                  {STATE_NAMES[code] ?? code}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
