import type { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import {
  searchByName,
  enformionProfileHref,
  type EnformionPerson,
} from "@/lib/enformion";
import { buildSupabaseSlug } from "@/lib/profile-slug";
import { sanitizeSearchInput } from "@/lib/sanitize";
import { fetchBlocklist, isBlocklisted } from "@/lib/blocklist";

export const dynamic = "force-dynamic";

type SearchParams = {
  first?: string;
  last?: string;
  city?: string;
  state?: string;
  age?: string;
};

type SupabasePerson = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  age: number | null;
  city: string | null;
  state: string | null;
  address: string | null;
};

type ReportRow = {
  id: string;
  first_name: string;
  age: number | null;
  city: string | null;
  state: string | null;
  dating_apps: string[] | null;
  red_flags: string[] | null;
  experience: string;
  image_url: string | null;
};

type DisplayPerson = {
  key: string;
  name: string;
  age: number | null;
  city: string | null;
  state: string | null;
  address: string | null;
  profileHref: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const p = await searchParams;
  const name = [p.first, p.last].filter(Boolean).join(" ").trim();
  const title = name
    ? `Check ${name} | Who Is My Date?`
    : "Check Him — Verify Your Date | Who Is My Date?";
  const description =
    "Check public records, community reports, and dating app activity before you meet. Free and instant.";
  return { title, description, openGraph: { title, description } };
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

async function getPublicRecords(
  first: string,
  last: string,
  city: string,
  state: string,
): Promise<DisplayPerson[]> {
  if (!first || !last) return [];

  const blocklist = await fetchBlocklist();
  const notBlocked = <T extends { first_name: string; last_name: string; address: string | null }>(
    rows: T[],
  ) => rows.filter((p) => !isBlocklisted(p.first_name, p.last_name, p.address, blocklist));

  const supabase = createServerClient();
  if (supabase) {
    let q = supabase
      .from("people")
      .select("id, first_name, last_name, full_name, age, city, state, address")
      .eq("opted_out", false)
      .ilike("first_name", `%${first}%`)
      .ilike("last_name", `%${last}%`);
    if (city) q = q.ilike("city", `%${city}%`);
    if (state.length === 2) q = q.eq("state", state);

    const { data } = await q.limit(12);
    const rows = notBlocked((data ?? []) as SupabasePerson[]);
    if (rows.length > 0) {
      return rows.map((p) => ({
        key: p.id,
        name: p.full_name,
        age: p.age ?? null,
        city: p.city,
        state: p.state,
        address: p.address,
        profileHref: `/profile/${buildSupabaseSlug(p.first_name, p.last_name, p.city, p.state, p.id)}`,
      }));
    }
  }

  // Enformion fallback
  const enf = notBlocked(await searchByName(first, last, city, state));
  return enf.map((p: EnformionPerson, i) => ({
    key: `enf-${i}`,
    name: p.full_name,
    age: p.age,
    city: p.city,
    state: p.state,
    address: p.address,
    profileHref: enformionProfileHref(p),
  }));
}

async function getReports(first: string, city: string): Promise<ReportRow[]> {
  if (!first) return [];
  const supabase = createServerClient();
  if (!supabase) return [];

  let q = supabase
    .from("reported_profiles")
    .select("id, first_name, age, city, state, dating_apps, red_flags, experience, image_url")
    .eq("status", "approved")
    .ilike("first_name", first);
  if (city) q = q.ilike("city", `%${city}%`);

  const { data, error } = await q.order("created_at", { ascending: false }).limit(20);
  if (error) {
    console.error("[check] reports query failed:", error.message);
    return [];
  }
  return (data ?? []) as ReportRow[];
}

function flagColor(flag: string): string {
  const f = flag.toLowerCase();
  if (f.includes("fake")) return "bg-orange-100 text-orange-700";
  if (f.includes("ghost")) return "bg-yellow-100 text-yellow-800";
  if (f.includes("married") || f.includes("abusive") || f.includes("scammer"))
    return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-600";
}

// ---------------------------------------------------------------------------
// Empty state — self-contained GET form
// ---------------------------------------------------------------------------

function CheckPrompt() {
  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500";
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Him</h1>
      <p className="text-gray-600 mb-8">
        Enter a name to check public records, community reports, and dating app
        activity before you meet.
      </p>
      <form action="/check" method="get" className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input name="first" required placeholder="First name" className={inputClass} />
          <input name="last" placeholder="Last name" className={inputClass} />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input name="city" placeholder="City" className={inputClass} />
          <input name="state" placeholder="State" maxLength={2} className={`${inputClass} sm:w-24`} />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Check Now →
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CheckPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const first = sanitizeSearchInput(sp.first);
  const last = sanitizeSearchInput(sp.last);
  const city = sanitizeSearchInput(sp.city);
  const state = sanitizeSearchInput(sp.state).slice(0, 2).toUpperCase();

  if (!first) return <CheckPrompt />;

  const [records, reports] = await Promise.all([
    getPublicRecords(first, last, city, state),
    getReports(first, city),
  ]);

  const name = [first, last].filter(Boolean).join(" ");
  const reportLocation = city ? ` in ${city}` : "";
  const reportHref = `/report?${new URLSearchParams({
    ...(first && { first }),
    ...(city && { city }),
    ...(state && { state }),
  })}`;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Checking <span className="text-teal-600">{name}</span>
        </h1>
        <p className="text-gray-500 mb-8">
          {[city, state].filter(Boolean).join(", ") || "Nationwide"}
        </p>

        {/* Section 1: Public Records */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Public Records</h2>
          {records.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-500">
              No public records found for this name.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {records.map((p) => (
                <div key={p.key} className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-lg font-bold text-gray-900">{p.name}</span>
                      {p.age && <span className="ml-2 text-sm text-gray-400">Age {p.age}</span>}
                    </div>
                    {(p.city || p.state) && (
                      <span className="text-sm text-gray-500">
                        📍 {[p.city, p.state].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </div>
                  {p.address && (
                    <p className="text-sm text-gray-400 mb-3">
                      {[p.address, p.city, p.state].filter(Boolean).join(", ")}
                    </p>
                  )}
                  <Link
                    href={p.profileHref}
                    className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    View Full Profile →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Community Reports */}
        <section className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Community Reports</h2>
            <Link
              href={reportHref}
              className="text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              Add Your Report →
            </Link>
          </div>

          <p className="text-gray-700 mb-4">
            <strong>{reports.length}</strong>{" "}
            {reports.length === 1 ? "woman has" : "women have"} reported someone
            matching this name{reportLocation}.
          </p>

          {reports.length > 0 && (
            <div className="flex flex-col gap-4">
              {reports.map((r) => (
                <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    {r.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.image_url} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                        <span className="font-bold text-gray-900">{r.first_name}</span>
                        {r.age && <span className="text-sm text-gray-400">Age {r.age}</span>}
                        {(r.city || r.state) && (
                          <span className="text-sm text-gray-500">
                            · {[r.city, r.state].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </div>

                      {r.red_flags && r.red_flags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {r.red_flags.map((f) => (
                            <span key={f} className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${flagColor(f)}`}>
                              {f}
                            </span>
                          ))}
                        </div>
                      )}

                      {r.dating_apps && r.dating_apps.length > 0 && (
                        <p className="text-xs text-gray-500 mb-2">
                          On: {r.dating_apps.join(", ")}
                        </p>
                      )}

                      <p className="text-sm text-gray-600">{r.experience}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            Reports are user-submitted and unverified.
          </p>
        </section>

        {/* Section 3: Dating App Activity (locked) */}
        <section className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Dating App Activity</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <svg className="mx-auto mb-3 h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="text-gray-700 font-medium">Dating app scan coming soon</p>
            <p className="text-sm text-gray-400 mt-1">
              We&apos;re building a way to see where he&apos;s active. Check back soon.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
