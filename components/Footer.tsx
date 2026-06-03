import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import { CODE_TO_STATE, type StateInfo } from "@/lib/states";

async function getStatesWithData(): Promise<StateInfo[]> {
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
  return [...seen]
    .sort()
    .flatMap((code) => {
      const s = CODE_TO_STATE.get(code);
      return s ? [s] : [];
    });
}

export default async function Footer() {
  const states = await getStatesWithData();

  return (
    <footer className="bg-gray-900 text-gray-400 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <p className="mb-6 leading-relaxed text-gray-500">
          <strong className="text-gray-300">Legal Disclaimer:</strong> Who Is My Date?
          aggregates publicly available information from government records,
          public databases, and other lawful sources. We are not a consumer
          reporting agency as defined by the Fair Credit Reporting Act (FCRA) and
          our services may not be used for any FCRA-regulated purpose, including
          tenant screening, employment decisions, or credit determinations.
        </p>

        {states.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              Browse by State
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {states.map((s) => (
                <Link
                  key={s.code}
                  href={`/people/${s.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/people" className="hover:text-white transition-colors">
            Browse
          </Link>
          <Link href="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="/opt-out" className="hover:text-white transition-colors">
            Opt Out / Remove My Info
          </Link>
          <Link href="/opt-out" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
            Do Not Sell My Personal Information
          </Link>
        </div>
        <p className="mt-6 text-xs text-gray-600">
          © {new Date().getFullYear()} Who Is My Date?. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
