import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/states";

export const metadata: Metadata = {
  title: "Find People by State - Free Public Records Search | Who Is My Date?",
  description:
    "Browse public records by state. Search voter registration and government records to find people across all 50 states.",
};

const REGION_ORDER = [
  // Northeast
  "connecticut", "delaware", "maine", "maryland", "massachusetts",
  "new-hampshire", "new-jersey", "new-york", "pennsylvania", "rhode-island",
  "vermont",
  // South
  "alabama", "arkansas", "florida", "georgia", "kentucky", "louisiana",
  "mississippi", "north-carolina", "south-carolina", "tennessee", "texas",
  "virginia", "west-virginia",
  // Midwest
  "illinois", "indiana", "iowa", "kansas", "michigan", "minnesota",
  "missouri", "nebraska", "north-dakota", "ohio", "south-dakota", "wisconsin",
  // West
  "alaska", "arizona", "california", "colorado", "hawaii", "idaho",
  "montana", "nevada", "new-mexico", "oregon", "utah", "washington", "wyoming",
  // Mid-Atlantic extras
  "oklahoma",
];

const sorted = [...STATES].sort((a, b) => a.name.localeCompare(b.name));

export default function PeoplePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Find People by State
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Browse public records by state. Select a state below to search voter
          registration data, addresses, and more.
        </p>
      </div>

      {/* State grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {sorted.map((state) => (
          <Link
            key={state.slug}
            href={`/people/${state.slug}`}
            className="group flex flex-col items-center justify-center border border-gray-200 rounded-xl p-4 hover:border-teal-400 hover:bg-teal-50 transition-all"
          >
            <span className="text-2xl font-bold text-teal-600 group-hover:text-teal-700 mb-1">
              {state.code}
            </span>
            <span className="text-xs text-gray-600 text-center leading-tight group-hover:text-gray-800">
              {state.name}
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-6">
        Who Is My Date? aggregates publicly available government records including
        voter registration data. Information is provided for informational
        purposes only. Who Is My Date? is not a consumer reporting agency and may not
        be used for any purpose regulated by the FCRA.
      </p>
    </div>
  );
}
