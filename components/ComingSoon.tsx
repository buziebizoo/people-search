"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";

// Full-document coming-soon gate. Renders its own <html>/<body> so the root
// layout can `return <ComingSoon />` directly and still produce a valid
// document root.
export default function ComingSoon() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // globals.css sets an unlayered `body { background: #fff }` that beats the
  // Tailwind class. Force the dark background via inline style on mount.
  useEffect(() => {
    document.body.style.backgroundColor = "#0f2027";
    document.documentElement.style.backgroundColor = "#0f2027";
    return () => {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const supabase = createBrowserClient();
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
      };
      console.log("[waitlist] attempting insert with:", payload);
      const { error } = await supabase.from("waitlist").insert(payload);
      if (error) console.error("[waitlist] insert failed:", JSON.stringify(error, null, 2));
    } catch (err) {
      console.error("[waitlist] insert error:", err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  }

  const inputClass =
    "w-full rounded-lg px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400";

  return (
    <html lang="en">
      <body className="antialiased">
        <div
          style={{ minHeight: "100vh", backgroundColor: "#0f2027" }}
          className="flex flex-col items-center px-4 text-center"
        >
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
                Thanks {firstName}! We&apos;ll notify you when we launch.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 mt-2">
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  aria-label="First name"
                  className={inputClass}
                />
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  aria-label="Last name"
                  className={inputClass}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className={inputClass}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting…" : "Notify Me"}
                </button>
              </form>
            )}
          </div>

          <footer className="py-6 text-white/40 text-sm">
            © 2026 Who Is My Date?
          </footer>
        </div>
      </body>
    </html>
  );
}
