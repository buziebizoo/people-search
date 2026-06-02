"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

type Tab = "name" | "phone" | "address";

const TABS: { id: Tab; label: string }[] = [
  { id: "name", label: "Name" },
  { id: "phone", label: "Phone" },
  { id: "address", label: "Address" },
];

export default function SearchTabs() {
  const router = useRouter();
  const [active, setActive] = useState<Tab>("name");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nameLocation, setNameLocation] = useState("");

  const [phone, setPhone] = useState("");

  const [street, setStreet] = useState("");
  const [addrLocation, setAddrLocation] = useState("");

  function doSearch() {
    if (active === "name") {
      const params = new URLSearchParams({ type: "name" });
      if (firstName) params.set("first", firstName);
      if (lastName) params.set("last", lastName);
      if (nameLocation) params.set("location", nameLocation);
      router.push(`/results?${params}`);
    } else if (active === "phone") {
      router.push(`/results?type=phone&q=${encodeURIComponent(phone)}`);
    } else if (active === "address") {
      const params = new URLSearchParams({ type: "address" });
      if (street) params.set("street", street);
      if (addrLocation) params.set("location", addrLocation);
      router.push(`/results?${params}`);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    doSearch();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      doSearch();
    }
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Tab bar */}
      <div className="flex bg-white/10 rounded-t-xl overflow-hidden">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              active === tab.id
                ? "bg-white text-teal-700 border-b-2 border-teal-600"
                : "text-white/80 hover:bg-white/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-b-xl px-5 py-5 shadow-xl"
      >
        {active === "name" && (
          <div className="flex flex-row gap-2 items-center">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="First Name"
              className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Last Name"
              className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            />
            <input
              type="text"
              value={nameLocation}
              onChange={(e) => setNameLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="City, State"
              className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
            >
              Search
            </button>
          </div>
        )}

        {active === "phone" && (
          <div className="flex flex-row gap-2 items-center">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Phone Number"
              className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
            >
              Search
            </button>
          </div>
        )}

        {active === "address" && (
          <div className="flex flex-row gap-2 items-center">
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Street Address"
              className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            />
            <input
              type="text"
              value={addrLocation}
              onChange={(e) => setAddrLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="City, State"
              className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
            >
              Search
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
