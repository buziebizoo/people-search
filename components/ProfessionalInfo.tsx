"use client";

import { useState } from "react";

export default function ProfessionalInfo({
  firstName,
  lastName,
  city,
  state,
}: {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
}) {
  const [jobTitle,    setJobTitle]    = useState("");
  const [university,  setUniversity]  = useState("");

  function buildQuery() {
    return [firstName, lastName, city, state, jobTitle.trim(), university.trim()]
      .filter(Boolean)
      .join(" ");
  }

  const linkedinUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(buildQuery())}`;
  const googleUrl   = `https://www.google.com/search?q=${encodeURIComponent(buildQuery() + " linkedin")}`;

  return (
    <div className="bg-white border border-teal-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/90">
          Professional Information
        </h2>
      </div>
      <div className="px-6 py-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Software Engineer at Google"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="text"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="e.g. UCLA"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Search LinkedIn
          </a>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 transition-colors"
          >
            Search Google
          </a>
        </div>
      </div>
    </div>
  );
}
