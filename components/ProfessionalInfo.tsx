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

  const job = jobTitle.trim();
  const uni = university.trim();

  const linkedinQuery = [firstName, lastName, job, uni].filter(Boolean).join(" ");
  const googleQuery   = [firstName, lastName, city, state, job, uni, "linkedin"].filter(Boolean).join(" ");

  const linkedinUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(linkedinQuery)}`;
  const googleUrl   = `https://www.google.com/search?q=${encodeURIComponent(googleQuery)}`;

  return (
    <div className="bg-white border border-teal-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/90">
          Professional Information
        </h2>
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Insert Job Title or Company Name"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="text"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="Enter University"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-[44px] bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-colors"
          >
            Search LinkedIn
          </a>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-[44px] bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-3 rounded-lg border border-gray-200 transition-colors"
          >
            Search Google
          </a>
        </div>
      </div>
    </div>
  );
}
