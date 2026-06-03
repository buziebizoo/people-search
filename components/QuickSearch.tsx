"use client";

import { useState } from "react";

export default function QuickSearch({
  firstName,
  lastName,
  city,
}: {
  firstName: string;
  lastName:  string;
  city:      string;
}) {
  const [jobTitle, setJobTitle] = useState("");

  function buildQuery(extra?: string): string {
    const parts = [firstName, lastName, city, jobTitle.trim(), extra]
      .filter(Boolean)
      .map(encodeURIComponent);
    return parts.join("+");
  }

  const linkedinUrl = `https://www.google.com/search?q=${buildQuery("site:linkedin.com")}`;
  const googleUrl   = `https://www.google.com/search?q=${buildQuery()}`;

  return (
    <div className="bg-white border border-teal-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/90">
          Professional Information
        </h2>
      </div>

      <div className="px-6 py-5 flex flex-col gap-4">
        <div>
          <label
            htmlFor="job-title-input"
            className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5"
          >
            Job Title / Company <span className="normal-case">(optional)</span>
          </label>
          <input
            id="job-title-input"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Software Engineer at Google"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Search LinkedIn →
          </a>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-teal-600 text-teal-700 hover:bg-teal-50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Search on Google →
          </a>
        </div>
      </div>
    </div>
  );
}
