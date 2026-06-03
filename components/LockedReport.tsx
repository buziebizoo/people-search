"use client";

import { pickAffiliate } from "@/lib/affiliates";

type ReportType =
  | "criminal"
  | "vehicle"
  | "property"
  | "debt"
  | "arrest"
  | "sex_offender";

const FAKE_ROWS: Record<ReportType, string[]> = {
  criminal: [
    "Record 1: [REDACTED] County Court, 20██",
    "Record 2: [REDACTED] District Court, 20██",
    "Record 3: Case No. ██-CR-████, [REDACTED]",
    "Disposition: [REDACTED] — Filed 20██",
  ],
  vehicle: [
    "Vehicle 1: 20██ [REDACTED] [REDACTED], Registered [REDACTED]",
    "Vehicle 2: 20██ [REDACTED] [REDACTED], VIN ████████████",
    "Plate: ███-████ ([REDACTED])",
    "Title Status: [REDACTED] — Last Updated 20██",
  ],
  property: [
    "Property 1: [REDACTED] [REDACTED] St, Estimated Value: $[REDACTED]",
    "Property 2: ███ [REDACTED] Ave, Purchased 20██",
    "Parcel ID: ███-██-████, [REDACTED] County",
    "Tax Assessment: $[REDACTED] (20██)",
  ],
  debt: [
    "Account 1: [REDACTED] Bank, Balance $[REDACTED]",
    "Lien 1: [REDACTED] — Filed 20██, $[REDACTED]",
    "Judgment: Case ██-██-████, [REDACTED]",
    "Collection: [REDACTED] — Status [REDACTED]",
  ],
  arrest: [
    "Arrest Record 1: [REDACTED] County, 20██",
    "Charge: [REDACTED]",
    "Disposition: [REDACTED]",
    "Booking No. ██-█████, [REDACTED] — 20██",
  ],
  sex_offender: [
    "Registry Status: Checking national database...",
    "State Registry: [REDACTED]",
    "Federal Registry: [REDACTED]",
    "Last Verified: 20██ — [REDACTED]",
  ],
};

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function LockedReport({
  type,
  seed,
  title,
}: {
  type: ReportType;
  seed: number;
  title: string;
}) {
  const rows = FAKE_ROWS[type];
  const href = pickAffiliate("background", seed);

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
      {/* CONFIDENTIAL watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span className="text-red-600 font-extrabold uppercase tracking-widest text-5xl sm:text-6xl -rotate-45 select-none opacity-5 whitespace-nowrap">
          Confidential
        </span>
      </div>

      {/* Report header */}
      <div className="relative px-4 py-3 sm:px-6 border-b border-gray-200">
        <h3 className="text-xs font-bold uppercase tracking-widest text-teal-600">
          {title}
        </h3>
      </div>

      {/* Blurred fake-data body + overlay */}
      <div className="relative">
        <div className="px-4 py-4 sm:px-6 flex flex-col" style={{ filter: "blur(4px)" }}>
          {rows.map((row, i) => (
            <div
              key={i}
              className={`px-3 py-2 font-mono text-xs sm:text-[13px] text-gray-700 ${
                i % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              {row}
            </div>
          ))}
        </div>

        {/* Overlay */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 hover:bg-black/75 transition-colors duration-300"
        >
          <span className="text-white/90 group-hover:text-teal-300 transition-colors duration-300">
            <LockIcon />
          </span>
          <span className="inline-flex items-center min-h-[44px] bg-teal-600 group-hover:bg-teal-500 text-white text-sm font-semibold px-5 py-3 rounded-lg shadow-lg group-hover:shadow-teal-500/50 transition-all duration-300">
            Unlock Full Report
          </span>
        </a>
      </div>
    </div>
  );
}
