import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { searchByName, type EnformionPerson } from "@/lib/enformion";
import ProfessionalInfo from "@/components/ProfessionalInfo";
import ResultsSearchBar from "@/components/ResultsSearchBar";
import { parseProfileSlug } from "@/lib/profile-slug";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SupabasePerson = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  age: number | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  address: string | null;
  phone_prefix: string | null;
  relatives: string[] | null;
};

type Props = { params: Promise<{ slug: string }> };

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

/**
 * Supabase lookup: query by text fields (first, last, city, state) which are
 * reliably indexed, then use the shortId to pick the exact record when multiple
 * people share the same name. This avoids unreliable ILIKE on the UUID column.
 */
const fetchBySlugParts = cache(async (
  shortId: string,
  first: string,
  last: string,
  city: string,
  state: string,
): Promise<SupabasePerson | null> => {
  const supabase = createServerClient();
  if (!supabase) return null;

  let query = supabase.from("people").select("*").eq("opted_out", false);
  if (first) query = query.ilike("first_name", first);
  if (last)  query = query.ilike("last_name",  last);
  if (city)  query = query.ilike("city",  city);
  if (state) query = query.eq("state", state.toUpperCase());

  const { data } = await query.limit(20);
  if (!data || data.length === 0) return null;

  // Prefer the record whose UUID prefix matches the shortId
  const exact = (data as SupabasePerson[]).find((p) => p.id.startsWith(shortId));
  return exact ?? (data[0] as SupabasePerson);
});

const fetchByUUID = cache(async (id: string): Promise<SupabasePerson | null> => {
  const supabase = createServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("people").select("*").eq("id", id).eq("opted_out", false).maybeSingle();
  return (data as SupabasePerson) ?? null;
});

/**
 * Enformion lookup: search by name + city + state, then pick the best match.
 * Age is the highest-priority discriminator, followed by state and city.
 */
const fetchEnformion = cache(
  async (first: string, last: string, age: number | null, city: string, state: string): Promise<EnformionPerson | null> => {
    const results = await searchByName(first, last, city, state);
    if (results.length === 0) return null;

    const normCity  = city.toLowerCase();
    const normState = state.toLowerCase();
    const scored = results.map((p) => {
      let score = 0;
      if (age != null && p.age === age)                         score += 4;
      if (normState && p.state?.toLowerCase() === normState)    score += 2;
      if (normCity  && p.city?.toLowerCase().includes(normCity)) score += 1;
      return { p, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[0]!.p;
  },
);

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseProfileSlug(slug);

  let firstName = "", lastName = "", city = "", state = "";

  if (parsed.type === "uuid") {
    const p = await fetchByUUID(parsed.id);
    if (!p) return { title: "Person Not Found | Who Is My Date?" };
    firstName = p.first_name; lastName = p.last_name;
    city = p.city ?? ""; state = p.state ?? "";
  } else if (parsed.type === "supabase") {
    const p = await fetchBySlugParts(parsed.shortId, parsed.first, parsed.last, parsed.city, parsed.state);
    if (!p) return { title: "Person Not Found | Who Is My Date?" };
    firstName = p.first_name; lastName = p.last_name;
    city = p.city ?? ""; state = p.state ?? "";
  } else {
    firstName = parsed.first; lastName = parsed.last;
    city = parsed.city; state = parsed.state;
  }

  const name     = [firstName, lastName].filter(Boolean).join(" ");
  const location = [city, state].filter(Boolean).join(", ");
  const title    = `${name}${location ? ` - ${location}` : ""} | Who Is My Date?`;
  const description = `Find public records for ${name}${location ? ` from ${location}` : ""}. View address history, phone numbers, possible relatives and more on Who Is My Date.`;
  return { title, description, openGraph: { title, description } };
}

// ---------------------------------------------------------------------------
// Structured data (JSON-LD)
// ---------------------------------------------------------------------------

function PersonJsonLd({
  name,
  city,
  state,
}: {
  name: string;
  city: string | null;
  state: string | null;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    address: {
      "@type": "PostalAddress",
      addressLocality: city ?? "",
      addressRegion: state ?? "",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Shared UI primitives
// ---------------------------------------------------------------------------

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">
      {children}
    </h2>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 shrink-0">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal-600 shrink-0 mt-0.5">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function LockedSection({
  title,
  teaser,
  href,
  buttonLabel = "Unlock Records",
}: {
  title: string;
  teaser: string;
  href: string;
  buttonLabel?: string;
}) {
  return (
    <SectionCard>
      <div className="flex items-center gap-2 mb-1">
        <LockIcon />
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
      </div>
      <p className="text-sm text-gray-500">{teaser}</p>
      <a href={href} target="_blank" rel="noopener noreferrer"
        className="mt-3 inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
        {buttonLabel}
      </a>
    </SectionCard>
  );
}

function AffiliateCard({ name, description, href }: { name: string; description: string; href: string }) {
  return (
    <SectionCard className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-24 h-10 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-gray-500 text-center leading-tight px-1">{name}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer"
        className="shrink-0 inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
        Get Report →
      </a>
    </SectionCard>
  );
}

function FcraDisclaimer() {
  return (
    <div className="text-xs text-gray-400 border-t border-gray-200 pt-5 leading-relaxed flex flex-col gap-2">
      <p>
        Who Is My Date? is not a consumer reporting agency as defined by the Fair
        Credit Reporting Act (FCRA). This information may not be used for
        employment, housing, credit, or tenant screening purposes.
      </p>
      <div className="flex gap-4">
        <Link href="/opt-out" className="underline hover:text-gray-600">Opt Out</Link>
        <Link href="/about" className="underline hover:text-gray-600">About</Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Supabase profile renderer
// ---------------------------------------------------------------------------

function SupabaseProfile({ person }: { person: SupabasePerson }) {
  const location = [person.city, person.state].filter(Boolean).join(", ");
  const fullAddress = [
    person.address,
    person.city,
    [person.state, person.zip].filter(Boolean).join(" "),
  ].filter(Boolean).join(", ");
  const phoneDisplay = person.phone_prefix ? `(${person.phone_prefix}) ***-****` : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <PersonJsonLd name={person.full_name} city={person.city} state={person.state} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-5">

        <div>
          <Link href="/results?type=name"
            className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium">
            ← Back to Search
          </Link>
        </div>

        <SectionCard>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{person.full_name}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            {person.age && <span>Age {person.age}</span>}
            {location && (
              <span className="flex items-center gap-1"><PinIcon />{location}</span>
            )}
          </div>
        </SectionCard>

        <SectionCard>
          <SectionTitle>Contact Information</SectionTitle>
          <dl className="flex flex-col gap-3 text-sm">
            {fullAddress && (
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Current Address</dt>
                <dd className="text-gray-800 font-medium">{fullAddress}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Phone Number</dt>
              <dd className="text-gray-800 font-medium">
                {phoneDisplay ?? <span className="text-gray-400 italic">Phone may be on file</span>}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Email Address</dt>
              <dd className="text-gray-400 italic">May have email on file</dd>
            </div>
          </dl>
        </SectionCard>

        <ProfessionalInfo
          firstName={person.first_name}
          lastName={person.last_name}
          city={person.city ?? ""}
          state={person.state ?? ""}
        />

        <SectionCard>
          <SectionTitle>Possible Relatives</SectionTitle>
          {person.relatives && person.relatives.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {person.relatives.map((name) => (
                <li key={name}>
                  <Link
                    href={`/results?type=name&first=${encodeURIComponent(name.split(" ")[0] ?? "")}&last=${encodeURIComponent(name.split(" ").slice(1).join(" ") ?? "")}`}
                    className="text-sm text-teal-600 hover:text-teal-700 hover:underline font-medium"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">Possible relatives may be on file</p>
          )}
        </SectionCard>

        <SectionCard>
          <SectionTitle>Previous Addresses</SectionTitle>
          <p className="text-sm text-gray-500">Previous addresses may be on file</p>
          <a href="https://www.truthfinder.com/?utm_source=whoismy.date" target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Unlock Full History
          </a>
        </SectionCard>

        <SectionCard>
          <SectionTitle>Known Associates</SectionTitle>
          <p className="text-sm text-gray-500">Known associates may be on file</p>
          <a href="https://www.beenverified.com/?utm_source=whoismy.date" target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            View Associates
          </a>
        </SectionCard>

        <LockedSection title="Criminal Records" teaser="This person may have criminal records on file"
          href="https://www.truthfinder.com/?utm_source=whoismy.date" />
        <LockedSection title="Arrest Records" teaser="Possible arrest records found"
          href="https://www.instantcheckmate.com/?utm_source=whoismy.date" />
        <LockedSection title="Sex Offender Check" teaser="Run a sex offender check on this person"
          href="https://www.truthfinder.com/?utm_source=whoismy.date" buttonLabel="Run Check" />
        <LockedSection title="Bankruptcies & Liens" teaser="Financial records may be available"
          href="https://www.beenverified.com/?utm_source=whoismy.date" />
        <LockedSection title="Traffic Violations" teaser="Possible traffic violations on file"
          href="https://www.spokeo.com/?utm_source=whoismy.date" />

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">Full Background Reports</h2>
          <div className="flex flex-col gap-3">
            <AffiliateCard name="TruthFinder"
              description="Get a full background report including criminal records, contact info, and more"
              href="https://www.truthfinder.com/?utm_source=whoismy.date" />
            <AffiliateCard name="BeenVerified"
              description="Search billions of public records including phone numbers, addresses, and criminal history"
              href="https://www.beenverified.com/?utm_source=whoismy.date" />
            <AffiliateCard name="Spokeo"
              description="Find contact info, social profiles, photos and more"
              href="https://www.spokeo.com/?utm_source=whoismy.date" />
            <AffiliateCard name="Instant Checkmate"
              description="Run a complete background check including arrest records and court documents"
              href="https://www.instantcheckmate.com/?utm_source=whoismy.date" />
          </div>
        </div>

        <FcraDisclaimer />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Enformion profile renderer
// ---------------------------------------------------------------------------

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length === 11 && d[0] === "1") return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  return raw;
}

function EnformionProfile({ person }: { person: EnformionPerson }) {
  const fullName    = person.full_name || [person.first_name, person.last_name].filter(Boolean).join(" ");
  const location    = [person.city, person.state].filter(Boolean).join(", ");
  const fullAddress = [
    person.address,
    person.city,
    [person.state, person.zip].filter(Boolean).join(" "),
  ].filter(Boolean).join(", ");

  return (
    <div className="bg-gray-50 min-h-screen">
      <PersonJsonLd name={fullName} city={person.city} state={person.state} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-5">

        <div>
          <Link href="/results?type=name"
            className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium">
            ← Back to Search
          </Link>
        </div>

        <SectionCard>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{fullName || "Unknown"}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            {person.age && <span>Age {person.age}</span>}
            {location && <span>📍 {location}</span>}
          </div>
        </SectionCard>

        <SectionCard>
          <SectionTitle>Contact Information</SectionTitle>
          <dl className="flex flex-col gap-3 text-sm">
            {fullAddress && (
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Address</dt>
                <dd className="text-gray-800 font-medium">{fullAddress}</dd>
              </div>
            )}
            {person.phones.length > 0 ? (
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                  Phone{person.phones.length > 1 ? "s" : ""}
                </dt>
                <dd className="flex flex-col gap-1">
                  {person.phones.map((ph) => (
                    <span key={ph} className="text-gray-800 font-medium">{formatPhone(ph)}</span>
                  ))}
                </dd>
              </div>
            ) : (
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Phone Number</dt>
                <dd className="text-gray-400 italic">Phone may be on file</dd>
              </div>
            )}
            {person.emails.length > 0 ? (
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                  Email{person.emails.length > 1 ? "s" : ""}
                </dt>
                <dd className="flex flex-col gap-1">
                  {person.emails.map((em) => (
                    <span key={em} className="text-gray-800 font-medium">{em}</span>
                  ))}
                </dd>
              </div>
            ) : (
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Email Address</dt>
                <dd className="text-gray-400 italic">May have email on file</dd>
              </div>
            )}
          </dl>
        </SectionCard>

        <ProfessionalInfo
          firstName={person.first_name}
          lastName={person.last_name}
          city={person.city ?? ""}
          state={person.state ?? ""}
        />

        <SectionCard>
          <SectionTitle>Possible Relatives</SectionTitle>
          {person.relatives.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {person.relatives.map((name) => {
                const parts   = name.split(" ");
                const relFirst = parts[0] ?? "";
                const relLast  = parts.slice(1).join(" ");
                return (
                  <li key={name}>
                    <Link
                      href={`/results?type=name&first=${encodeURIComponent(relFirst)}&last=${encodeURIComponent(relLast)}`}
                      className="text-sm text-teal-600 hover:text-teal-700 hover:underline font-medium"
                    >
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">Possible relatives may be on file</p>
          )}
        </SectionCard>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">Full Background Reports</h2>
          <div className="flex flex-col gap-3">
            <AffiliateCard name="TruthFinder"
              description="Get a full background report including criminal records, contact info, and more"
              href="https://www.truthfinder.com/?utm_source=whoismy.date" />
            <AffiliateCard name="BeenVerified"
              description="Search billions of public records including phone numbers, addresses, and criminal history"
              href="https://www.beenverified.com/?utm_source=whoismy.date" />
            <AffiliateCard name="Spokeo"
              description="Find contact info, social profiles, photos and more"
              href="https://www.spokeo.com/?utm_source=whoismy.date" />
          </div>
        </div>

        <FcraDisclaimer />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Not-found state
// ---------------------------------------------------------------------------

function ProfileNotFound() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <svg className="mx-auto mb-5 h-12 w-12 text-teal-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0Z" />
        </svg>
        <p className="text-gray-700 text-xl font-medium">
          Oops! This person&rsquo;s record is no longer available.
        </p>
        <p className="text-gray-500 mt-2">Search for someone else below.</p>
      </div>
      <ResultsSearchBar initialType="name" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const parsed = parseProfileSlug(slug);

  if (parsed.type === "uuid") {
    const person = await fetchByUUID(parsed.id);
    if (!person) return <ProfileNotFound />;
    return <SupabaseProfile person={person} />;
  }

  if (parsed.type === "supabase") {
    const person = await fetchBySlugParts(parsed.shortId, parsed.first, parsed.last, parsed.city, parsed.state);
    if (!person) return <ProfileNotFound />;
    return <SupabaseProfile person={person} />;
  }

  // Enformion
  const person = await fetchEnformion(parsed.first, parsed.last, parsed.age, parsed.city, parsed.state);
  if (!person) return <ProfileNotFound />;
  return <EnformionProfile person={person} />;
}
