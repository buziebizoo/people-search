"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

type Tab = "name" | "phone" | "address";

const TABS: { id: Tab; label: string }[] = [
  { id: "name",    label: "Name"    },
  { id: "phone",   label: "Phone"   },
  { id: "address", label: "Address" },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

type Props = {
  initialType:      string;
  initialFirst?:    string;
  initialLast?:     string;
  initialLocation?: string;
  initialPhone?:    string;
  initialStreet?:   string;
};

function toTab(type: string): Tab {
  if (type === "phone" || type === "address") return type;
  return "name";
}

/** Parse "san diego, CA" or "san diego CA" → [city, state] */
function splitLocation(loc: string): [string, string] {
  const s = loc.trim();
  if (!s) return ["", ""];
  if (s.includes(",")) {
    const [c, st] = s.split(",");
    return [c.trim(), st.trim().toUpperCase()];
  }
  const words = s.split(/\s+/);
  if (words.length === 1) return ["", words[0].toUpperCase()];
  return [words.slice(0, -1).join(" "), words[words.length - 1].toUpperCase()];
}

export default function ResultsSearchBar({
  initialType,
  initialFirst    = "",
  initialLast     = "",
  initialLocation = "",
  initialPhone    = "",
  initialStreet   = "",
}: Props) {
  const router = useRouter();
  const [active, setActive] = useState<Tab>(toTab(initialType));

  const [initCity, initState] = splitLocation(initialLocation);

  const [firstName,    setFirstName]    = useState(initialFirst);
  const [lastName,     setLastName]     = useState(initialLast);
  const [nameCity,     setNameCity]     = useState(initCity);
  const [nameState,    setNameState]    = useState(initState);
  const [phone,        setPhone]        = useState(initialPhone);
  const [street,       setStreet]       = useState(initialStreet);
  const [addrLocation, setAddrLocation] = useState(initialLocation);

  function doSearch() {
    if (active === "name") {
      const params = new URLSearchParams({ type: "name" });
      if (firstName) params.set("first", firstName);
      if (lastName)  params.set("last",  lastName);
      const location = [nameCity.trim(), nameState].filter(Boolean).join(", ");
      if (location)  params.set("location", location);
      router.push(`/results?${params}`);
    } else if (active === "phone") {
      router.push(`/results?type=phone&q=${encodeURIComponent(phone)}`);
    } else if (active === "address") {
      const params = new URLSearchParams({ type: "address" });
      if (street)       params.set("street",   street);
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

  const inputClass =
    "w-full sm:flex-1 sm:min-w-0 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400";
  const selectClass =
    "w-full sm:w-20 sm:shrink-0 border border-gray-200 rounded-lg px-2 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 bg-white";
  const submitClass =
    "w-full sm:w-auto min-h-[44px] px-4 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors whitespace-nowrap";

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        {/* Tab bar */}
        <div className="flex gap-1 mb-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                active === tab.id
                  ? "bg-teal-600 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input row */}
        <form onSubmit={handleSubmit}>
          {active === "name" && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center">
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} onKeyDown={handleKeyDown} placeholder="First Name" className={inputClass} />
              <input type="text" value={lastName}  onChange={(e) => setLastName(e.target.value)}  onKeyDown={handleKeyDown} placeholder="Last Name"  className={inputClass} />
              <input type="text" value={nameCity}  onChange={(e) => setNameCity(e.target.value)}  onKeyDown={handleKeyDown} placeholder="City"        className={inputClass} />
              <select value={nameState} onChange={(e) => setNameState(e.target.value)} className={selectClass}>
                <option value="">State</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="submit" className={submitClass}>Search</button>
            </div>
          )}
          {active === "phone" && (
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} onKeyDown={handleKeyDown} placeholder="Phone Number" className={inputClass} />
              <button type="submit" className={submitClass}>Search</button>
            </div>
          )}
          {active === "address" && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center">
              <input type="text" value={street}       onChange={(e) => setStreet(e.target.value)}       onKeyDown={handleKeyDown} placeholder="Street Address" className={inputClass} />
              <input type="text" value={addrLocation} onChange={(e) => setAddrLocation(e.target.value)} onKeyDown={handleKeyDown} placeholder="City, State"    className={inputClass} />
              <button type="submit" className={submitClass}>Search</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
