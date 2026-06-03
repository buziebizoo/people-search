import Link from "next/link";
import type { Metadata } from "next";
import ProfessionalInfo from "@/components/ProfessionalInfo";

type SP = Promise<{ [key: string]: string | string[] | undefined }>;

function str(v: string | string[] | undefined): string {
  return Array.isArray(v) ? v[0] ?? "" : v ?? "";
}

function list(v: string | string[] | undefined, sep: string): string[] {
  const s = str(v);
  return s ? s.split(sep).map((x) => x.trim()).filter(Boolean) : [];
}

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length === 11 && d[0] === "1") return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  return raw;
}

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const name = [str(sp.first), str(sp.last)].filter(Boolean).join(" ");
  const loc  = [str(sp.city), str(sp.state)].filter(Boolean).join(", ");
  return {
    title: `${name || "Person"}${loc ? ` - ${loc}` : ""} | PeopleFind`,
    description: `Find information about ${name}${loc ? ` from ${loc}` : ""} on PeopleFind.`,
  };
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm">
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

function AffiliateCard({ name, description, href }: { name: string; description: string; href: string }) {
  return (
    <SectionCard>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-24 h-10 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-gray-500 text-center leading-tight px-1">{name}</span>
        </div>
        <p className="flex-1 min-w-0 text-sm text-gray-600">{description}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Get Report →
        </a>
      </div>
    </SectionCard>
  );
}

export default async function EnformionProfilePage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;

  const firstName = str(sp.first);
  const lastName  = str(sp.last);
  const fullName  = [firstName, lastName].filter(Boolean).join(" ");
  const age       = str(sp.age);
  const address   = str(sp.address);
  const city      = str(sp.city);
  const state     = str(sp.state);
  const zip       = str(sp.zip);
  const phones    = list(sp.phones, ",");
  const emails    = list(sp.emails, ",");
  const relatives = list(sp.relatives, "|");

  const location    = [city, state].filter(Boolean).join(", ");
  const fullAddress = [address, city, [state, zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");

  const googleQuery = encodeURIComponent([fullName, location].filter(Boolean).join(" "));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-5">

        <div>
          <Link
            href="/results?type=name"
            className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Back to Search
          </Link>
        </div>

        {/* ── HEADER ── */}
        <SectionCard>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            {fullName || "Unknown"}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            {age && <span>Age {age}</span>}
            {location && <span>📍 {location}</span>}
          </div>
        </SectionCard>

        {/* ── CONTACT INFO ── */}
        <SectionCard>
          <SectionTitle>Contact Information</SectionTitle>
          <dl className="flex flex-col gap-3 text-sm">
            {fullAddress && (
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Address</dt>
                <dd className="text-gray-800 font-medium">{fullAddress}</dd>
              </div>
            )}

            {phones.length > 0 ? (
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                  Phone{phones.length > 1 ? "s" : ""}
                </dt>
                <dd className="flex flex-col gap-1">
                  {phones.map((ph) => (
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

            {emails.length > 0 ? (
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                  Email{emails.length > 1 ? "s" : ""}
                </dt>
                <dd className="flex flex-col gap-1">
                  {emails.map((em) => (
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

        {/* ── PROFESSIONAL INFORMATION ── */}
        <ProfessionalInfo
          firstName={firstName}
          lastName={lastName}
          location={location}
        />

        {/* ── RELATIVES ── */}
        <SectionCard>
          <SectionTitle>Possible Relatives</SectionTitle>
          {relatives.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {relatives.map((name) => {
                const parts = name.split(" ");
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

        {/* ── AFFILIATE REPORTS ── */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">
            Full Background Reports
          </h2>
          <div className="flex flex-col gap-3">
            <AffiliateCard
              name="TruthFinder"
              description="Get a full background report including criminal records, contact info, and more"
              href={`https://www.truthfinder.com/?utm_source=peoplefind`}
            />
            <AffiliateCard
              name="BeenVerified"
              description="Search billions of public records including phone numbers, addresses, and criminal history"
              href={`https://www.beenverified.com/?utm_source=peoplefind`}
            />
            <AffiliateCard
              name="Spokeo"
              description="Find contact info, social profiles, photos and more"
              href={`https://www.spokeo.com/?utm_source=peoplefind`}
            />
          </div>
        </div>

        {/* ── GOOGLE SEARCH ── */}
        <div className="text-center">
          <a
            href={`https://www.google.com/search?q=${googleQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-600 hover:underline"
          >
            Search &ldquo;{fullName}&rdquo; on Google →
          </a>
        </div>

        {/* ── FCRA DISCLAIMER ── */}
        <p className="text-xs text-gray-400 border-t border-gray-200 pt-5 leading-relaxed">
          PeopleFind is not a consumer reporting agency as defined by the Fair Credit
          Reporting Act (FCRA). This information may not be used for employment, housing,
          credit, or tenant screening purposes.{" "}
          <Link href="/opt-out" className="underline hover:text-gray-600">Opt Out</Link>
        </p>

      </div>
    </div>
  );
}
