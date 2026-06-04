"use client";

import { useState } from "react";

// Full-document coming-soon gate. Renders its own <html>/<body> so the root
// layout can `return <ComingSoon />` directly and still produce a valid
// document root.
export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center bg-[#0f2027] px-4 text-center antialiased">
        <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full max-w-md">
          <p className="text-2xl sm:text-3xl font-bold text-teal-400 tracking-tight">
            Who Is My Date?
          </p>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Coming Soon
          </h1>

          <p className="text-white/70 text-lg">
            We&apos;re putting the finishing touches on something great. Check
            back soon.
          </p>

          {submitted ? (
            <p className="text-teal-300 font-medium py-3">
              Thanks! We&apos;ll be in touch.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 mt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
                className="w-full rounded-lg px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>

        <footer className="py-6 text-white/40 text-sm">
          © 2026 Who Is My Date?
        </footer>
      </body>
    </html>
  );
}
