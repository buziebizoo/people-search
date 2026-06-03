"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "found" | "not_found";

type Profile = {
  title: string | null;
  employer: string | null;
  school: string | null;
  profilePicUrl: string | null;
  linkedinUrl: string | null;
};

export default function ProfessionalInfo({
  firstName,
  lastName,
  city,
}: {
  firstName: string;
  lastName: string;
  city: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [profile, setProfile] = useState<Profile | null>(null);

  async function handleSearch() {
    setStatus("loading");
    try {
      const params = new URLSearchParams({ first_name: firstName, last_name: lastName });
      if (city) params.set("location", city);
      const res = await fetch(`/api/linkedin-search?${params}`);
      if (!res.ok) { setStatus("not_found"); return; }
      const data: Profile = await res.json();
      setProfile(data);
      setStatus("found");
    } catch {
      setStatus("not_found");
    }
  }

  return (
    <div className="bg-white border border-teal-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/90">
          Professional Information
        </h2>
      </div>

      <div className="px-6 py-5">
        {status === "idle" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-500">
              Search LinkedIn to find this person&apos;s professional profile, job title, and education.
            </p>
            <button
              onClick={handleSearch}
              className="self-start inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Search LinkedIn
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 flex flex-col gap-2 justify-center">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-2/5" />
            </div>
          </div>
        )}

        {status === "not_found" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-400 italic">No professional profile found.</p>
            <button
              onClick={handleSearch}
              className="self-start text-xs text-teal-600 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {status === "found" && profile && (
          <div className="flex gap-4">
            {profile.profilePicUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.profilePicUrl}
                alt={`${firstName} ${lastName}`}
                className="w-16 h-16 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 shrink-0 flex items-center justify-center text-gray-400 text-xl font-bold">
                {firstName[0]}{lastName[0]}
              </div>
            )}
            <div className="flex flex-col gap-1 text-sm">
              {profile.title && (
                <p className="font-semibold text-gray-800">{profile.title}</p>
              )}
              {profile.employer && (
                <p className="text-gray-600">{profile.employer}</p>
              )}
              {profile.school && (
                <p className="text-gray-500 text-xs">{profile.school}</p>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline text-xs mt-1"
                >
                  View LinkedIn Profile →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
