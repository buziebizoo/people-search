"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Tab = "name" | "phone" | "address" | "image";

const TABS: { id: Tab; label: string }[] = [
  { id: "name", label: "Name" },
  { id: "phone", label: "Phone" },
  { id: "address", label: "Address" },
  { id: "image", label: "Image" },
];

type Props = {
  initialType: string;
  initialFirst?: string;
  initialLast?: string;
  initialLocation?: string;
  initialPhone?: string;
  initialStreet?: string;
};

function toTab(type: string): Tab {
  if (type === "phone" || type === "address" || type === "image") return type;
  return "name";
}

export default function ResultsSearchBar({
  initialType,
  initialFirst = "",
  initialLast = "",
  initialLocation = "",
  initialPhone = "",
  initialStreet = "",
}: Props) {
  const router = useRouter();
  const [active, setActive] = useState<Tab>(toTab(initialType));

  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [nameLocation, setNameLocation] = useState(initialLocation);
  const [phone, setPhone] = useState(initialPhone);
  const [street, setStreet] = useState(initialStreet);
  const [addrLocation, setAddrLocation] = useState(initialLocation);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageSearch(file: File | null) {
    window.open("https://lens.google.com", "_blank");
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        sessionStorage.setItem("imagePreview", reader.result as string);
        router.push("/results?type=image");
      };
      reader.readAsDataURL(file);
    } else {
      router.push("/results?type=image");
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
    } else if (active === "image") {
      handleImageSearch(selectedFile);
    }
  }

  const inputClass =
    "flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400";
  const submitClass =
    "px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors whitespace-nowrap shrink-0";

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
            <div className="flex flex-row gap-2 items-center">
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" className={inputClass} />
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" className={inputClass} />
              <input type="text" value={nameLocation} onChange={(e) => setNameLocation(e.target.value)} placeholder="City, State" className={inputClass} />
              <button type="submit" className={submitClass}>Search</button>
            </div>
          )}
          {active === "phone" && (
            <div className="flex flex-row gap-2 items-center">
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className={inputClass} />
              <button type="submit" className={submitClass}>Search</button>
            </div>
          )}
          {active === "address" && (
            <div className="flex flex-row gap-2 items-center">
              <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street Address" className={inputClass} />
              <input type="text" value={addrLocation} onChange={(e) => setAddrLocation(e.target.value)} placeholder="City, State" className={inputClass} />
              <button type="submit" className={submitClass}>Search</button>
            </div>
          )}
          {active === "image" && (
            <div className="flex flex-row gap-2 items-center">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)} />
              <span className="flex-1 text-sm text-gray-400 italic">
                {selectedFile ? selectedFile.name : "No photo selected"}
              </span>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-gray-300 text-gray-600 rounded-lg px-3 py-2 text-sm hover:border-teal-500 hover:text-teal-600 transition-colors shrink-0">
                Choose Photo
              </button>
              <button type="submit" className={submitClass}>Search</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
