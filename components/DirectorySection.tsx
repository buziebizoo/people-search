import Link from "next/link";
import { createServerClient } from "@/lib/supabase";

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

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

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
            const name = STATE_NAMES[code] ?? code;
            return (
              <Link
                key={code}
                href={`/people/${toSlug(name)}`}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-full hover:bg-teal-700 transition-colors"
              >
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
