"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const DATING_APPS = ["Tinder", "Hinge", "Bumble", "Match", "Other"];
const RED_FLAGS = ["Married/Not Single", "Fake Photos", "Ghosted", "Abusive", "Scammer", "Other"];

function Pill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
        selected
          ? "bg-teal-600 text-white border-teal-600"
          : "bg-white text-gray-600 border-gray-300 hover:border-teal-400"
      }`}
    >
      {label}
    </button>
  );
}

function ReportForm() {
  const params = useSearchParams();
  const [firstName, setFirstName] = useState(params.get("first") ?? "");
  const [age, setAge] = useState("");
  const [city, setCity] = useState(params.get("city") ?? "");
  const [state, setState] = useState(params.get("state") ?? "");
  const [apps, setApps] = useState<string[]>([]);
  const [flags, setFlags] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const canSubmit =
    !submitting &&
    firstName.trim() !== "" &&
    city.trim() !== "" &&
    state !== "" &&
    experience.trim().length >= 20;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createBrowserClient();

      // Optional photo upload to the profile-reports bucket
      let imageUrl: string | null = null;
      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9.]+/g, "-");
        const path = `${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("profile-reports")
          .upload(path, file);
        if (uploadError) {
          console.error("[report] image upload failed:", uploadError.message);
        } else {
          imageUrl = supabase.storage.from("profile-reports").getPublicUrl(path).data.publicUrl;
        }
      }

      const payload = {
        first_name: firstName.trim(),
        age: age ? parseInt(age, 10) || null : null,
        city: city.trim(),
        state,
        dating_apps: apps,
        red_flags: flags,
        experience: experience.trim(),
        image_url: imageUrl,
      };
      console.log("[report] submitting:", payload);
      const { error: insertError } = await supabase.from("reported_profiles").insert(payload);
      if (insertError) {
        console.error("[report] insert failed:", JSON.stringify(insertError, null, 2));
        setError("Something went wrong submitting your report. Please try again.");
        setSubmitting(false);
        return;
      }
    } catch (err) {
      console.error("[report] submit error:", err);
      setError("Something went wrong submitting your report. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-6">
          <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Thank You</h1>
        <p className="text-lg text-gray-600 mb-6">
          Your report will be reviewed before publishing.
        </p>
        <Link href="/check" className="text-teal-600 hover:text-teal-700 font-medium underline">
          Back to Check Him
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Add a Report</h1>
      <p className="text-gray-600 mb-8">
        Share your experience to help keep other women safe. Reports are reviewed
        before they appear publicly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className={inputClass} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select required value={state} onChange={(e) => setState(e.target.value)} className={`${inputClass} bg-white`}>
              <option value="">—</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dating apps they use</label>
          <div className="flex flex-wrap gap-2">
            {DATING_APPS.map((a) => (
              <Pill key={a} label={a} selected={apps.includes(a)} onClick={() => toggle(apps, setApps, a)} />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Red flags</label>
          <div className="flex flex-wrap gap-2">
            {RED_FLAGS.map((f) => (
              <Pill key={f} label={f} selected={flags.includes(f)} onClick={() => toggle(flags, setFlags, f)} />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your experience <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            rows={5}
            placeholder="Describe what happened (at least 20 characters)…"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-gray-400">{experience.trim().length}/20 characters minimum</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo (optional)</label>
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-teal-700 file:font-medium"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit Report"}
        </button>

        <p className="text-xs text-gray-400 leading-relaxed">
          By submitting you confirm this is truthful. False reports may result in
          legal action. Who Is My Date? reserves the right to remove any submission.
        </p>
      </form>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense>
      <ReportForm />
    </Suspense>
  );
}
