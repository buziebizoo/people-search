"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/results?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl shadow-lg rounded-xl overflow-hidden">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter name, phone number, or address…"
        className="flex-1 px-5 py-4 text-gray-800 text-base outline-none border-0 bg-white placeholder-gray-400"
        aria-label="Search people"
      />
      <button
        type="submit"
        className="px-7 py-4 bg-teal-600 text-white font-semibold text-base hover:bg-teal-700 active:bg-teal-800 transition-colors whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
}
