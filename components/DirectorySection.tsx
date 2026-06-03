import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import { STATES } from "@/lib/states";

async function getStatesWithData(): Promise<Set<string>> {
  const supabase = createServerClient();
  const seen = new Set<string>();
  if (!supabase) return seen;
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
  return seen;
}

export default async function DirectorySection() {
  const withData = await getStatesWithData();

  return (
    <section className="bg-gray-50 py-14 px-4 sm:px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Browse by State</h2>
        <div className="flex flex-wrap gap-2">
          {STATES.map((s) =>
            withData.has(s.code) ? (
              <Link
                key={s.code}
                href={`/people/${s.slug}`}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-full hover:bg-teal-700 transition-colors"
              >
                {s.name}
              </Link>
            ) : (
              <span
                key={s.code}
                aria-disabled="true"
                className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-200 rounded-full cursor-not-allowed"
              >
                {s.name}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
