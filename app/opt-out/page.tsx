"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase";

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

export default function OptOutPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    reason: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createBrowserClient();
    const { error: dbError } = await supabase
      .from("opt_out_requests")
      .insert({
        full_name: form.fullName,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        email: form.email,
        reason: form.reason,
      });

    if (dbError) {
      setError("Something went wrong submitting your request. Please try again.");
      setSubmitting(false);
      return;
    }

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
        <p className="text-lg text-gray-600 mb-4">
          Your opt-out request has been submitted. We will process your request
          and remove your information within{" "}
          <strong>30 days</strong>, as required by law.
        </p>
        <p className="text-sm text-gray-500">
          A confirmation will be sent to <strong>{form.email}</strong> once
          processing is complete.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Opt Out / Remove My Info
        </h1>
        <p className="text-gray-600 leading-relaxed">
          You have the right to request removal of your personal information
          from PeopleFind&apos;s search results. Fill out the form below and we will
          process your request within <strong>30 days</strong>.
        </p>
        <div className="mt-4 bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 text-sm text-teal-800">
          <strong>Required by law:</strong> Under applicable state and federal
          privacy laws, including the California Consumer Privacy Act (CCPA) and
          similar state statutes, you are entitled to request deletion of your
          personal information at no charge. PeopleFind is required to honor
          these requests within 30 days.
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Used only to send you a confirmation of your request.
          </p>
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
          disabled={submitting}
          className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit Opt-Out Request"}
        </button>

        <p className="text-xs text-gray-400 text-center leading-relaxed">
          By submitting this form you certify that the information provided is
          accurate and that you are the individual named or are authorized to
          act on their behalf. Requests are processed within 30 days as required
          by applicable law.
        </p>
      </form>
    </div>
  );
}
