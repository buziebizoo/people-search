"use client";

import { useState, useRef, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

type Tab = "name" | "phone" | "address" | "screenshot" | "checkhim";

const TABS: { id: Tab; label: string }[] = [
  { id: "name",       label: "Name" },
  { id: "phone",      label: "Phone" },
  { id: "address",    label: "Address" },
  { id: "screenshot", label: "Screenshot" },
  { id: "checkhim",   label: "Check Him" },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const inputClass =
  "w-full sm:flex-1 sm:min-w-0 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400";
const selectClass =
  "w-full sm:w-24 sm:shrink-0 border border-gray-200 rounded-lg px-2 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 bg-white";
const btnClass =
  "w-full sm:w-auto min-h-[44px] px-5 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors whitespace-nowrap";

export default function SearchTabs() {
  const router = useRouter();
  const [active, setActive] = useState<Tab>("name");

  // Name
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [nameCity,  setNameCity]  = useState("");
  const [nameState, setNameState] = useState("");

  // Phone
  const [phone, setPhone] = useState("");

  // Address
  const [street,       setStreet]       = useState("");
  const [addrLocation, setAddrLocation] = useState("");

  // Screenshot
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shotPreview, setShotPreview] = useState<string | null>(null);
  const [shotFirst, setShotFirst] = useState("");
  const [shotLast,  setShotLast]  = useState("");
  const [shotCity,  setShotCity]  = useState("");
  const [shotState, setShotState] = useState("");

  // Check Him
  const [chkFirst, setChkFirst] = useState("");
  const [chkLast,  setChkLast]  = useState("");
  const [chkAge,   setChkAge]   = useState("");
  const [chkCity,  setChkCity]  = useState("");
  const [chkState, setChkState] = useState("");

  function handleShotFile(file?: File | null) {
    if (!file || !file.type.startsWith("image/")) return;
    setShotPreview(URL.createObjectURL(file));
  }

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
    } else if (active === "screenshot") {
      const params = new URLSearchParams({ type: "name" });
      if (shotFirst) params.set("first", shotFirst);
      if (shotLast)  params.set("last",  shotLast);
      const location = [shotCity.trim(), shotState].filter(Boolean).join(", ");
      if (location)  params.set("location", location);
      router.push(`/results?${params}`);
    } else if (active === "checkhim") {
      const params = new URLSearchParams();
      if (chkFirst) params.set("first", chkFirst);
      if (chkLast)  params.set("last",  chkLast);
      if (chkCity)  params.set("city",  chkCity);
      if (chkState) params.set("state", chkState);
      if (chkAge)   params.set("age",   chkAge);
      router.push(`/check?${params}`);
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
            className={`flex-1 py-3 px-1 text-xs sm:text-sm font-semibold transition-colors ${
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
      <form onSubmit={handleSubmit} className="bg-white rounded-b-xl px-4 sm:px-5 py-4 sm:py-5 shadow-xl">
        {active === "name" && (
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center">
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} onKeyDown={handleKeyDown} placeholder="First Name" className={inputClass} />
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} onKeyDown={handleKeyDown} placeholder="Last Name" className={inputClass} />
            <input type="text" value={nameCity} onChange={(e) => setNameCity(e.target.value)} onKeyDown={handleKeyDown} placeholder="City" className={inputClass} />
            <select value={nameState} onChange={(e) => setNameState(e.target.value)} className={selectClass}>
              <option value="">State</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button type="submit" className={btnClass}>Search</button>
          </div>
        )}

        {active === "phone" && (
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} onKeyDown={handleKeyDown} placeholder="Phone Number" className={inputClass} />
            <button type="submit" className={btnClass}>Search</button>
          </div>
        )}

        {active === "address" && (
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center">
            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} onKeyDown={handleKeyDown} placeholder="Street Address" className={inputClass} />
            <input type="text" value={addrLocation} onChange={(e) => setAddrLocation(e.target.value)} onKeyDown={handleKeyDown} placeholder="City, State" className={inputClass} />
            <button type="submit" className={btnClass}>Search</button>
          </div>
        )}

        {active === "screenshot" && (
          <div className="flex flex-col gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => handleShotFile(e.target.files?.[0])}
            />

            {!shotPreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleShotFile(e.dataTransfer.files?.[0]); }}
                className="border-2 border-dashed border-teal-400 rounded-xl bg-white p-8 text-center cursor-pointer hover:bg-teal-50 transition-colors"
              >
                <svg className="mx-auto mb-3 h-10 w-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
                <p className="text-gray-800 font-semibold">Drop a dating app screenshot here</p>
                <p className="text-sm text-gray-500 mt-1">Tinder, Hinge, Bumble, Match and more</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={shotPreview} alt="Screenshot preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                    Change image
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center">
                  <input type="text" value={shotFirst} onChange={(e) => setShotFirst(e.target.value)} onKeyDown={handleKeyDown} placeholder="First Name" className={inputClass} />
                  <input type="text" value={shotLast} onChange={(e) => setShotLast(e.target.value)} onKeyDown={handleKeyDown} placeholder="Last Name" className={inputClass} />
                  <input type="text" value={shotCity} onChange={(e) => setShotCity(e.target.value)} onKeyDown={handleKeyDown} placeholder="City" className={inputClass} />
                  <select value={shotState} onChange={(e) => setShotState(e.target.value)} className={selectClass}>
                    <option value="">State</option>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button type="submit" className={btnClass}>Search Public Records →</button>
              </div>
            )}
          </div>
        )}

        {active === "checkhim" && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="text" value={chkFirst} onChange={(e) => setChkFirst(e.target.value)} onKeyDown={handleKeyDown} placeholder="First Name" className={inputClass} />
              <input type="text" value={chkLast} onChange={(e) => setChkLast(e.target.value)} onKeyDown={handleKeyDown} placeholder="Last Name" className={inputClass} />
              <input type="number" value={chkAge} onChange={(e) => setChkAge(e.target.value)} placeholder="Age" className="w-full sm:w-24 sm:shrink-0 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <input type="text" value={chkCity} onChange={(e) => setChkCity(e.target.value)} onKeyDown={handleKeyDown} placeholder="City" className={inputClass} />
              <select value={chkState} onChange={(e) => setChkState(e.target.value)} className={selectClass}>
                <option value="">State</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <label className="text-sm text-gray-500">
              Add a photo (optional)
              <input type="file" accept="image/png,image/jpeg" className="mt-1 block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-teal-700 file:font-medium" />
            </label>
            <button type="submit" className={btnClass}>Check Now →</button>
            <p className="text-xs text-gray-500 text-center">
              See if he&apos;s active on dating apps and check community reports
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
