"use client";

import { useEffect, useState } from "react";

type Profile = {
  title: string | null;
  employer: string | null;
  school: string | null;
  linkedinUrl: string | null;
};

function Skeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-3">
      <div className="h-3.5 bg-gray-200 rounded w-1/2" />
      <div className="h-3.5 bg-gray-200 rounded w-2/3" />
      <div className="h-3.5 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

export default function ProfessionalInfo({
  firstName,
  lastName,
  location,
}: {
  firstName: string;
  lastName: string;
  location: string;
}) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ first_name: firstName, last_name: lastName });
    if (location) params.set("location", location);

    fetch(`/api/linkedin-search?${params}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const result = data?.results?.[0];
        if (result) {
          setProfile({
            title:
              result.profile?.occupation ?? result.profile?.headline ?? null,
            employer: result.profile?.experiences?.[0]?.company ?? null,
            school: result.profile?.education?.[0]?.school ?? null,
            linkedinUrl: result.linkedin_profile_url ?? null,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [firstName, lastName, location]);

  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    [firstName, lastName, location].filter(Boolean).join(" ")
  )}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm">
      <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">
        Professional Information
      </h2>

      {loading ? (
        <Skeleton />
      ) : profile ? (
        <dl className="flex flex-col gap-3 text-sm">
          {profile.title && (
            <div>
              <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                Job Title
              </dt>
              <dd className="text-gray-800 font-medium">{profile.title}</dd>
            </div>
          )}
          {profile.employer && (
            <div>
              <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                Employer
              </dt>
              <dd className="text-gray-800 font-medium">{profile.employer}</dd>
            </div>
          )}
          {profile.school && (
            <div>
              <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                Education
              </dt>
              <dd className="text-gray-800 font-medium">{profile.school}</dd>
            </div>
          )}
          {profile.linkedinUrl && (
            <div className="mt-1">
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                View LinkedIn Profile →
              </a>
            </div>
          )}
        </dl>
      ) : (
        <div className="text-sm">
          <p className="text-gray-500 mb-3">No professional records found.</p>
          <a
            href={googleSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Search on Google →
          </a>
        </div>
      )}
    </div>
  );
}
