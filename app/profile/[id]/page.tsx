import { cache } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import ResultsSearchBar from "@/components/ResultsSearchBar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Person = {
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

type Props = {
  params: Promise<{ id: string }>;
};

// ---------------------------------------------------------------------------
// Data fetching — cached so generateMetadata and the page share one DB call
// ---------------------------------------------------------------------------

const getPerson = cache(async (id: string): Promise<Person | null> => {
  const supabase = createServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("people")
    .select("*")
    .eq("id", id)
    .single();
  return (data as Person) ?? null;
});

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const person = await getPerson(id);
  if (!person) return { title: "Person Not Found | PeopleFind" };

  const location = [person.city, person.state].filter(Boolean).join(", ");
  const agePart = person.age ? ` Age ${person.age}` : "";

  return {
    title: `${person.full_name} -${agePart}${location ? ` - ${location}` : ""} | PeopleFind`,
    description: `Find information about ${person.full_name}${location ? ` from ${location}` : ""}. View address, phone number, relatives and more on PeopleFind.`,
  };
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-gray-400 shrink-0"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-teal-600 shrink-0 mt-0.5"
    >
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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
      <p className="text-sm text-gray-500 mb-3 ml-6">{teaser}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-6 inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        {buttonLabel}
      </a>
    </SectionCard>
  );
}

function AffiliateCard({
  name,
  description,
  href,
}: {
  name: string;
  description: string;
  href: string;
}) {
  return (
    <SectionCard className="flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Logo placeholder */}
      <div className="w-24 h-10 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-gray-500 text-center leading-tight px-1">
          {name}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
      >
        Get Report →
      </a>
    </SectionCard>
  );
}

function AdPlaceholder() {
  return (
    <div className="w-full max-w-[728px] mx-auto h-[90px] bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
      Advertisement
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const person = await getPerson(id);

  if (!person) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <svg
            className="mx-auto mb-5 h-12 w-12 text-teal-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0Z"
            />
          </svg>
          <p className="text-gray-700 text-xl font-medium">Oops! This person&rsquo;s record is no longer available.</p>
          <p className="text-gray-500 mt-2">Search for someone else below.</p>
        </div>
        <ResultsSearchBar initialType="name" />
      </div>
    );
  }

  const location = [person.city, person.state].filter(Boolean).join(", ");
  const fullAddress = [
    person.address,
    person.city,
    [person.state, person.zip].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  const phoneDisplay = person.phone_prefix
    ? `(${person.phone_prefix}) ***-****`
    : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-5">

        {/* Back button */}
        <div>
          <Link
            href="/results?type=name"
            className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Back to Search
          </Link>
        </div>

        {/* ── 1. HEADER ── */}
        <SectionCard>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            {person.full_name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            {person.age && <span>Age {person.age}</span>}
            {location && (
              <span className="flex items-center gap-1">
                <PinIcon />
                {location}
              </span>
            )}
          </div>
        </SectionCard>

        {/* ── 2. CONTACT INFO ── */}
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
                {phoneDisplay ?? (
                  <span className="text-gray-400 italic">Phone may be on file</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Email Address</dt>
              <dd className="text-gray-400 italic">May have email on file</dd>
            </div>
          </dl>
        </SectionCard>

        {/* ── 3. RELATIVES ── */}
        <SectionCard>
          <SectionTitle>Possible Relatives</SectionTitle>
          {person.relatives && person.relatives.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {person.relatives.map((name) => (
                <li key={name}>
                  <Link
                    href={`/results?type=name&first=${encodeURIComponent(
                      name.split(" ")[0] ?? ""
                    )}&last=${encodeURIComponent(
                      name.split(" ").slice(1).join(" ") ?? ""
                    )}`}
                    className="text-sm text-teal-600 hover:text-teal-700 hover:underline font-medium"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">
              Possible relatives may be on file
            </p>
          )}
        </SectionCard>

        <AdPlaceholder />

        {/* ── 4. PREVIOUS ADDRESSES ── */}
        <SectionCard>
          <SectionTitle>Previous Addresses</SectionTitle>
          <p className="text-sm text-gray-500 mb-3">Previous addresses may be on file</p>
          <a
            href="https://www.truthfinder.com/?utm_source=peoplefind"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Unlock Full History
          </a>
        </SectionCard>

        {/* ── 5. ASSOCIATES ── */}
        <SectionCard>
          <SectionTitle>Known Associates</SectionTitle>
          <p className="text-sm text-gray-500 mb-3">Known associates may be on file</p>
          <a
            href="https://www.beenverified.com/?utm_source=peoplefind"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            View Associates
          </a>
        </SectionCard>

        {/* ── 6. LOCKED RECORDS ── */}
        <LockedSection
          title="Criminal Records"
          teaser="This person may have criminal records on file"
          href="https://www.truthfinder.com/?utm_source=peoplefind"
        />
        <LockedSection
          title="Arrest Records"
          teaser="Possible arrest records found"
          href="https://www.instantcheckmate.com/?utm_source=peoplefind"
        />
        <LockedSection
          title="Sex Offender Check"
          teaser="Run a sex offender check on this person"
          href="https://www.truthfinder.com/?utm_source=peoplefind"
          buttonLabel="Run Check"
        />
        <LockedSection
          title="Bankruptcies & Liens"
          teaser="Financial records may be available"
          href="https://www.beenverified.com/?utm_source=peoplefind"
        />
        <LockedSection
          title="Traffic Violations"
          teaser="Possible traffic violations on file"
          href="https://www.spokeo.com/?utm_source=peoplefind"
        />

        <AdPlaceholder />

        {/* ── 7. AFFILIATE CTA CARDS ── */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">
            Full Background Reports
          </h2>
          <div className="flex flex-col gap-3">
            <AffiliateCard
              name="TruthFinder"
              description="Get a full background report including criminal records, contact info, and more"
              href="https://www.truthfinder.com/?utm_source=peoplefind"
            />
            <AffiliateCard
              name="BeenVerified"
              description="Search billions of public records including phone numbers, addresses, and criminal history"
              href="https://www.beenverified.com/?utm_source=peoplefind"
            />
            <AffiliateCard
              name="Spokeo"
              description="Find contact info, social profiles, photos and more"
              href="https://www.spokeo.com/?utm_source=peoplefind"
            />
            <AffiliateCard
              name="Instant Checkmate"
              description="Run a complete background check including arrest records and court documents"
              href="https://www.instantcheckmate.com/?utm_source=peoplefind"
            />
          </div>
        </div>

        {/* ── 8. AD PLACEHOLDER ── */}
        <AdPlaceholder />

        {/* ── 9. FOOTER DISCLAIMER ── */}
        <div className="text-xs text-gray-400 border-t border-gray-200 pt-5 leading-relaxed flex flex-col gap-2">
          <p>
            PeopleFind is not a consumer reporting agency as defined by the Fair
            Credit Reporting Act (FCRA). This information may not be used for
            employment, housing, credit, or tenant screening purposes.
          </p>
          <div className="flex gap-4">
            <Link href="/opt-out" className="underline hover:text-gray-600">
              Opt Out
            </Link>
            <Link href="/about" className="underline hover:text-gray-600">
              About
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
