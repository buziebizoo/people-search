"use client";

import { useState } from "react";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const REMOVAL_REASONS = [
  "Personal privacy",
  "Safety concern",
  "Identity theft protection",
  "Harassment or stalking",
  "Other",
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function OptOutPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    reason: "",
  });

  const emailError =
    emailTouched && form.email && !isValidEmail(form.email)
      ? "Please enter a valid email address (e.g. you@example.com)"
      : null;

  const canSubmit =
    !submitting &&
    form.fullName.trim() !== "" &&
    form.address.trim() !== "" &&
    form.city.trim() !== "" &&
    form.state !== "" &&
    form.zip.trim() !== "" &&
    form.email.trim() !== "" &&
    form.reason !== "" &&
    isValidEmail(form.email);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailTouched(true);
    if (!isValidEmail(form.email)) return;

    setSubmitting(true);
    setError(null);

    let res: Response;
    try {
      res = await fetch("/api/opt-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          email: form.email,
          reason: form.reason,
        }),
      });
    } catch {
      setError("Network error — please check your connection and try again.");
      setSubmitting(false);
      return;
    }

    if (!res.ok) {
      let msg = "Something went wrong submitting your request. Please try again.";
      try {
        const body = await res.json();
        if (typeof body?.error === "string") msg = body.error;
      } catch { /* ignore parse failure */ }
      setError(msg);
      setSubmitting(false);
      return;
    }

    const data = await res.json();
    setReferenceNumber(data.referenceNumber ?? "");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-6">
          <svg
            className="w-8 h-8 text-teal-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Request Received
        </h1>
        {referenceNumber && (
          <div className="inline-block bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Reference Number</p>
            <p className="text-lg font-mono font-bold text-gray-900">{referenceNumber}</p>
          </div>
        )}
        <p className="text-lg text-gray-600 mb-4">
          Your opt-out and removal request has been submitted. We will process
          your request and remove your information within{" "}
          <strong>45 days</strong>, as required by the CCPA and applicable law.
        </p>
        <p className="text-sm text-gray-500">
          A confirmation will be sent to <strong>{form.email}</strong> once
          processing is complete. Please keep your reference number for your records.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Do Not Sell or Share My Personal Information
        </h1>
        <p className="text-lg font-medium text-gray-700 mb-2">Opt Out / Remove My Info</p>
        <p className="text-gray-600 leading-relaxed mb-4">
          Use this form to submit a <strong>CCPA opt-out request</strong> and/or
          request removal of your personal information from Who Is My Date?&apos;s
          search results. This covers your right to opt out of the sale or sharing
          of your personal information and your right to have your data deleted.
          There is no charge to submit this request.
        </p>
        <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 text-sm text-teal-800 space-y-2">
          <p>
            <strong>California residents (CCPA / CPRA):</strong> Under the California
            Consumer Privacy Act and the California Privacy Rights Act, you have the right
            to know what personal information we collect, the right to delete it, and the
            right to opt out of its sale or sharing. We are required to honor your request
            within <strong>45 days</strong>.
          </p>
          <p>
            <strong>All other residents:</strong> Under applicable state privacy laws
            (Virginia VCDPA, Colorado CPA, Connecticut CTDPA, and others), you have similar
            rights to access, delete, and opt out. We will process all requests within
            <strong> 45 days</strong>.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="First and last name as it appears in records"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Current Street Address <span className="text-red-500">*</span>
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            placeholder="123 Main St"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              State <span className="text-red-500">*</span>
            </label>
            <select
              id="state"
              name="state"
              required
              value={form.state}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            >
              <option value="">—</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="zip"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              id="zip"
              name="zip"
              type="text"
              required
              pattern="\d{5}(-\d{4})?"
              placeholder="00000"
              value={form.zip}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            onBlur={() => setEmailTouched(true)}
            className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
              emailError ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          />
          {emailError ? (
            <p className="mt-1 text-xs text-red-600">{emailError}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">
              Used only to send you a confirmation of your request.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Reason for Removal <span className="text-red-500">*</span>
          </label>
          <select
            id="reason"
            name="reason"
            required
            value={form.reason}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
          >
            <option value="">Select a reason</option>
            {REMOVAL_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit Opt-Out Request"}
        </button>

        <p className="text-xs text-gray-400 text-center leading-relaxed">
          By submitting this form you certify that the information provided is
          accurate and that you are the individual named or are authorized to
          act on their behalf under the CCPA or applicable state law. Requests
          are processed within 45 days as required by applicable law.
        </p>
      </form>
    </div>
  );
}
