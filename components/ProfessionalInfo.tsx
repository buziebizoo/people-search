"use client";

import { useState } from "react";

type Profile = {
  title:         string | null;
  employer:      string | null;
  school:        string | null;
  linkedinUrl:   string | null;
  profilePicUrl: string | null;
};

type State = "idle" | "loading" | "found" | "not_found";

function Skeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3.5 bg-gray-200 rounded w-2/3" />
          <div className="h-3   bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

export default function ProfessionalInfo({
  firstName,
  lastName,
  location,
}: {
  firstName: string;
  lastName:  string;
  location:  string;
}) {
  const [state,    setState]    = useState<State>("idle");
  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [imgError, setImgError] = useState(false);

  async function handleFind() {
    setState("loading");
    try {
      const params = new URLSearchParams({ first_name: firstName, last_name: lastName });
      if (location) params.set("location", location);

      const res  = await fetch(`/api/linkedin-search?${params}`);
      const data = res.ok ? await res.json() : null;

      if (data && (data.title || data.employer || data.school || data.linkedinUrl)) {
        setProfile(data);
        setState("found");
      } else {
        setState("not_found");
      }
    } catch {
      setState("not_found");
    }
  }

  const googleUrl  = `https://www.google.com/search?q=${encodeURIComponent([firstName, lastName, location].filter(Boolean).join(" "))}`;
  const pimEyesUrl = "https://pimeyes.com";
  const showPic    = profile?.profilePicUrl && !imgError;

  return (
    <div className="bg-white border border-teal-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/90">
          Professional Information
        </h2>
      </div>

      <div className="px-6 py-5">
        {/* ── IDLE ── */}
        {state === "idle" && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-gray-500">
              Search LinkedIn for professional records on this person.
            </p>
            <button
              type="button"
              onClick={handleFind}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              🔍 Find Professional Info
            </button>
          </div>
        )}

        {/* ── LOADING ── */}
        {state === "loading" && <Skeleton />}

        {/* ── FOUND ── */}
        {state === "found" && profile && (
          <div>
            <div className="flex items-start gap-4 mb-4">
              {showPic && (
                <img
                  src={profile.profilePicUrl!}
                  alt={`${firstName} ${lastName}`}
                  onError={() => setImgError(true)}
                  className="w-14 h-14 rounded-full object-cover border-2 border-teal-100 shrink-0"
                />
              )}
              <dl className="flex flex-col gap-2.5 text-sm flex-1 min-w-0">
                {profile.title && (
                  <div>
                    <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Job Title</dt>
                    <dd className="text-gray-800 font-medium">{profile.title}</dd>
                  </div>
                )}
                {profile.employer && (
                  <div>
                    <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Employer</dt>
                    <dd className="text-gray-800 font-medium">{profile.employer}</dd>
                  </div>
                )}
                {profile.school && (
                  <div>
                    <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Education</dt>
                    <dd className="text-gray-800 font-medium">{profile.school}</dd>
                  </div>
                )}
              </dl>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  View LinkedIn Profile →
                </a>
              )}
              <a
                href={pimEyesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-teal-600 text-teal-700 hover:bg-teal-50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Search by Face on PimEyes →
              </a>
            </div>
          </div>
        )}

        {/* ── NOT FOUND ── */}
        {state === "not_found" && (
          <div className="text-sm">
            <p className="text-gray-500 mb-4">No professional profile found.</p>
            <div className="flex flex-wrap gap-2">
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Search on Google →
              </a>
              <a
                href={pimEyesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-teal-600 text-teal-700 hover:bg-teal-50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Search by Face on PimEyes →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
