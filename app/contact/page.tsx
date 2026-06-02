"use client";

import { useState } from "react";

const SUBJECTS = [
  "General question",
  "Data accuracy issue",
  "Opt-out / removal help",
  "Legal inquiry",
  "Press or media",
  "Other",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Message Sent
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Thanks for reaching out, <strong>{form.name}</strong>.
        </p>
        <p className="text-gray-500">
          We&apos;ll get back to you at <strong>{form.email}</strong> within 5
          business days.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
        <p className="text-gray-600 leading-relaxed">
          Have a question, concern, or data request? Fill out the form below
          and our team will respond within 5 business days.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          For opt-out requests, please use the dedicated{" "}
          <a href="/opt-out" className="text-teal-600 hover:underline">
            Opt-Out page
          </a>{" "}
          instead.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-500">*</span>
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
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
          >
            <option value="">Select a subject</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            placeholder="How can we help?"
            value={form.message}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-y"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
