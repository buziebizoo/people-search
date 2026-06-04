import type { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import { STATES } from "@/lib/states";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Browse People by State | Who Is My Date?",
  description: "Browse public records by state on Who Is My Date?.",
};

async function getCodesWithData(): Promise<Set<string>> {
  const supabase = createServerClient();
  if (!supabase) return new Set();
  const { data, error } = await supabase
    .rpc("get_distinct_states");
  if (error || !data) return new Set();
  return new Set(data.map((r: { state: string }) => r.state).filter(Boolean));
}

export default async function BrowsePage() {
  const codesWithData = await getCodesWithData();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse by State</h1>
        <p className="text-gray-500 mb-8">
          Select a state to browse public records from that area.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {STATES.map((s) => {
            const hasData = codesWithData.has(s.code);
            return (
              <Link
                key={s.code}
                href={`/people/${s.slug}`}
                className={`rounded-xl px-4 py-4 border shadow-sm transition-all group ${
                  hasData
                    ? "bg-white border-gray-200 hover:border-teal-400 hover:shadow-md"
                    : "bg-gray-100 border-gray-200 opacity-60 pointer-events-none"
                }`}
              >
                <div
                  className={`text-lg font-bold ${
                    hasData
                      ? "text-teal-600 group-hover:text-teal-700"
                      : "text-gray-400"
                  }`}
                >
                  {s.code}
                </div>
                <div className="text-sm text-gray-600">{s.name}</div>
                {!hasData && (
                  <div className="text-xs text-gray-400 mt-1">Coming Soon</div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
