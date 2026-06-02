"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function StateSearchBar({ stateName }: { stateName: string }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ type: "name", location: stateName });
    if (firstName) params.set("first", firstName);
    if (lastName) params.set("last", lastName);
    router.push(`/results?${params}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
      />
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
      />
      <input
        type="text"
        value={stateName}
        readOnly
        className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
}
