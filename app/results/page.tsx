import Link from "next/link";
import ResultsSearchBar from "@/components/ResultsSearchBar";

type SearchParams = {
  type?: string;
  first?: string;
  last?: string;
  location?: string;
  q?: string;
  street?: string;
};

const RESULTS = [
  {
    name: "Michael J. Thompson",
    age: 43,
    city: "Austin",
    state: "TX",
    relatives: ["Karen Thompson", "Daniel Thompson"],
    phonePrefix: "512",
  },
  {
    name: "Sarah L. Martinez",
    age: 38,
    city: "Phoenix",
    state: "AZ",
    relatives: ["Carlos Martinez", "Elena Ruiz", "Pedro Martinez"],
    phonePrefix: "602",
  },
  {
    name: "James R. Anderson",
    age: 55,
    city: "Nashville",
    state: "TN",
    relatives: ["Patricia Anderson", "Robert Anderson"],
    phonePrefix: "615",
  },
  {
    name: "Emily K. Chen",
    age: 29,
    city: "Seattle",
    state: "WA",
    relatives: ["David Chen", "Lisa Chen"],
    phonePrefix: "206",
  },
  {
    name: "Robert D. Williams",
    age: 61,
    city: "Charlotte",
    state: "NC",
    relatives: ["Margaret Williams", "Thomas Williams", "Amy Williams"],
    phonePrefix: "704",
  },
  {
    name: "Jennifer A. Davis",
    age: 34,
    city: "Denver",
    state: "CO",
    relatives: ["Mark Davis", "Susan Hollings"],
    phonePrefix: "720",
  },
];

function queryLabel(params: SearchParams): string {
  const { type, first, last, q, street, location } = params;
  if (type === "name") {
    const name = [first, last].filter(Boolean).join(" ");
    return name || "Name Search";
  }
  if (type === "phone") return q || "Phone Search";
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
          Showing <span className="font-semibold text-gray-800">6 results</span>{" "}
          for <span className="font-semibold text-gray-800">{label}</span>
        </p>

        {/* ── AD UNIT ── replace with ad tag before launch ── */}
        <div className="w-[728px] max-w-full h-[90px] mx-auto bg-gray-200 flex items-center justify-center text-gray-400 text-sm mb-6">
          Advertisement
        </div>

        {/* Result cards */}
        <div className="flex flex-col gap-4">
          {RESULTS.map((person) => (
            <div
              key={person.name}
              className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm"
            >
              {/* Top row: name/age and location */}
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-lg font-bold text-gray-900">
                    {person.name}
                  </span>
                  <span className="ml-2 text-sm text-gray-400">
                    Age {person.age}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  📍 {person.city}, {person.state}
                </span>
              </div>

              {/* Relatives */}
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Possible relatives:</span>{" "}
                {person.relatives.join(" · ")}
              </p>

              {/* Phone teaser */}
              <p className="text-sm text-gray-400 italic mb-4">
                Phone: {person.phonePrefix}-***-****
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/profile/${encodeURIComponent(person.name.toLowerCase().replace(/\s+/g, "-"))}`}
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
