"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SearchResult = {
  id: string;
  source: "supabase" | "enformion";
  full_name: string;
  first_name: string;
  last_name: string;
  age: number | null;
  city: string | null;
  state: string | null;
  address: string | null;
};

type Step = "search" | "results" | "email" | "sent";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return `${local[0]}${"*".repeat(Math.max(1, local.length - 1))}@${domain}`;
}

// ---------------------------------------------------------------------------
// Inner component (needs useSearchParams → must be inside Suspense)
// ---------------------------------------------------------------------------

function OptOutPageInner() {
  const searchParams = useSearchParams();
  const confirmed = searchParams.get("confirmed") === "1";
  const urlError  = searchParams.get("error");

  const [step, setStep]                   = useState<Step>("search");
  const [firstName, setFirstName]         = useState("");
  const [lastName, setLastName]           = useState("");
  const [city, setCity]                   = useState("");
  const [state, setState]                 = useState("");
  const [results, setResults]             = useState<SearchResult[]>([]);
  const [selected, setSelected]           = useState<SearchResult | null>(null);
  const [email, setEmail]                 = useState("");
  const [emailTouched, setEmailTouched]   = useState(false);
  const [searching, setSearching]         = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  const emailError =
    emailTouched && email && !isValidEmail(email)
      ? "Please enter a valid email address"
      : null;

  const canSubmitEmail =
    !submitting && email.trim() !== "" && isValidEmail(email);

  // ── URL-param driven states ───────────────────────────────────────────────

  if (confirmed) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-6">
          <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Your Record Has Been Removed</h1>
        <p className="text-lg text-gray-600 mb-6">
          Your information has been opted out and will no longer appear in our search results.
          It may take up to 24 hours to fully propagate.
        </p>
        <Link href="/" className="text-teal-600 hover:text-teal-700 font-medium underline">
          Return to home
        </Link>
      </div>
    );
  }

  if (urlError) {
    const msg =
      urlError === "token_expired"
        ? "This confirmation link has expired (links are valid for 24 hours). Please submit a new request."
        : "This confirmation link is invalid. Please submit a new request.";
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Link Invalid or Expired</h1>
        <p className="text-gray-600 mb-6">{msg}</p>
        <Link href="/opt-out" className="bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors">
          Start Over
        </Link>
      </div>
    );
  }

  // ── Step: sent ────────────────────────────────────────────────────────────

  if (step === "sent") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-6">
          <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Check Your Email</h1>
        <p className="text-lg text-gray-600 mb-2">
          We sent a confirmation link to{" "}
          <span className="font-semibold text-gray-800">{maskEmail(email)}</span>.
        </p>
        <p className="text-gray-500 mb-8">
          Click the link in the email to complete your removal. The link expires in 24 hours.
        </p>
        <button
          onClick={() => { setStep("search"); setError(null); }}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Start over
        </button>
      </div>
    );
  }

  // ── Step: email ───────────────────────────────────────────────────────────

  if (step === "email" && selected) {
    async function handleSubmitEmail(e: React.FormEvent) {
      e.preventDefault();
      setEmailTouched(true);
      if (!isValidEmail(email) || !selected) return;

      setSubmitting(true);
      setError(null);

      let res: Response;
      try {
        res = await fetch("/api/opt-out", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
          personId:  selected.id,
          source:    selected.source,
          firstName: selected.first_name,
          lastName:  selected.last_name,
          email,
        }),
        });
      } catch {
        setSubmitting(false);
        setError("Network error — please check your connection and try again.");
        return;
      }

      setSubmitting(false);

      if (!res.ok) {
        let msg = "Something went wrong. Please try again.";
        try { const b = await res.json(); if (typeof b?.error === "string") msg = b.error; } catch { /* ignore */ }
        setError(msg);
        return;
      }

      setStep("sent");
    }

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <button
          onClick={() => { setStep("results"); setError(null); }}
          className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to results
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Your Email</h1>
        <p className="text-gray-600 mb-8">
          We'll send a one-time confirmation link to verify this removal request for{" "}
          <span className="font-semibold text-gray-800">
            {selected.full_name}
            {selected.city && selected.state ? ` — ${selected.city}, ${selected.state}` : ""}
          </span>.
        </p>

        <form onSubmit={handleSubmitEmail} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Your Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                emailError ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
            {emailError ? (
              <p className="mt-1 text-xs text-red-600">{emailError}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">
                Used only to send you the confirmation link. Not stored or shared.
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmitEmail}
            className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending…" : "Send Confirmation Email"}
          </button>
        </form>
      </div>
    );
  }

  // ── Step: results ─────────────────────────────────────────────────────────

  if (step === "results") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <button
          onClick={() => { setStep("search"); setError(null); }}
          className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Search again
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Record</h1>
        <p className="text-gray-600 mb-8">
          Found {results.length} record{results.length !== 1 ? "s" : ""} matching{" "}
          <span className="font-semibold text-gray-800">
            {firstName} {lastName}
          </span>. Click the one that's you to begin removal.
        </p>

        {results.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-10 text-center">
            <p className="text-gray-700 font-medium mb-2">No records found</p>
            <p className="text-sm text-gray-500">
              Your information may not be in our database, or it may already be removed.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {results.map((person) => (
              <div key={person.id} className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <p className="text-lg font-bold text-gray-900">{person.full_name}</p>
                  {(person.city || person.state) && (
                    <span className="text-sm text-gray-500">
                      {[person.city, person.state].filter(Boolean).join(", ")}
                    </span>
                  )}
                </div>
                {(person.age || person.address) && (
                  <div className="text-sm text-gray-500 mb-3 space-y-0.5">
                    {person.age    && <p>Age {person.age}</p>}
                    {person.address && (
                      <p>
                        {[person.address, person.city, person.state]
                          .filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                )}
                <button
                  onClick={() => {
                    setSelected(person);
                    setEmail("");
                    setEmailTouched(false);
                    setError(null);
                    setStep("email");
                  }}
                  className="inline-flex items-center min-h-[44px] bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-colors"
                >
                  This is me — Remove My Record
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-8 text-xs text-gray-400 leading-relaxed">
          Don't see your record? Try a different spelling or{" "}
          <Link href="/contact" className="underline hover:text-gray-600">contact us</Link>{" "}
          for assistance.
        </p>
      </div>
    );
  }

  // ── Step: search (default) ────────────────────────────────────────────────

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    setSearching(true);
    setError(null);

    let res: Response;
    try {
      const qs = new URLSearchParams({ first: firstName, last: lastName });
      if (city.trim())  qs.set("city",  city.trim());
      if (state.trim()) qs.set("state", state.trim());
      res = await fetch(`/api/opt-out/search?${qs}`);
    } catch {
      setSearching(false);
      setError("Network error — please check your connection and try again.");
      return;
    }

    const data = await res.json();
    setSearching(false);

    if (!res.ok) {
      setError(data.error ?? "Search failed. Please try again.");
      return;
    }

    setResults(data.results ?? []);
    setStep("results");
  }

  const canSearch = !searching && firstName.trim() !== "" && lastName.trim() !== "";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Remove My Information
        </h1>
        <p className="text-gray-600 leading-relaxed mb-4">
          Search for your name below to find and remove your record from our search results.
          This is a free service available to all individuals under the{" "}
          <strong>CCPA</strong> and applicable state privacy laws. Requests are processed
          within <strong>45 days</strong>.
        </p>
        <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 text-sm text-teal-800">
          <strong>How it works:</strong> Search for your name → select your record →
          verify your email → your record is removed.
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              required
              placeholder="First"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              required
              placeholder="Last"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="city"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            >
              <option value="">Any</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSearch}
          className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {searching ? "Searching…" : "Find My Records"}
        </button>
      </form>

      <p className="mt-8 text-xs text-gray-400 leading-relaxed">
        By submitting this form you certify you are the named individual or are authorized to
        act on their behalf. There is no charge to submit this request.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Export — Suspense required by useSearchParams in Next.js App Router
// ---------------------------------------------------------------------------

export default function OptOutPage() {
  return (
    <Suspense>
      <OptOutPageInner />
    </Suspense>
  );
}
