"use client";

import { useState, useRef, FormEvent, DragEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

type Tab = "name" | "phone" | "address" | "image";

const TABS: { id: Tab; label: string }[] = [
  { id: "name", label: "Name" },
  { id: "phone", label: "Phone" },
  { id: "address", label: "Address" },
  { id: "image", label: "Image" },
];

const CameraIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10 text-gray-400"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export default function SearchTabs() {
  const router = useRouter();
  const [active, setActive] = useState<Tab>("name");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nameLocation, setNameLocation] = useState("");

  const [phone, setPhone] = useState("");

  const [street, setStreet] = useState("");
  const [addrLocation, setAddrLocation] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageSearchName, setImageSearchName] = useState("");
  const [imageSearchLocation, setImageSearchLocation] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lensFormRef = useRef<HTMLFormElement>(null);
  const lensFileInputRef = useRef<HTMLInputElement>(null);

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) setSelectedFile(file);
  }

  function handleFaceSearch() {
    if (!selectedFile) return;
    if (lensFormRef.current && lensFileInputRef.current) {
      try {
        const dt = new DataTransfer();
        dt.items.add(selectedFile);
        lensFileInputRef.current.files = dt.files;
      } catch {
        // DataTransfer not available — Lens will open without the pre-loaded image
      }
    }
    lensFormRef.current?.submit();
  }

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
    } else if (active === "image") {
      const params = new URLSearchParams({ type: "name" });
      const [first, ...rest] = imageSearchName.trim().split(" ");
      if (first) params.set("first", first);
      const last = rest.join(" ");
      if (last) params.set("last", last);
      if (imageSearchLocation.trim()) params.set("location", imageSearchLocation.trim());
      if (first) router.push(`/results?${params}`);
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
      {/* Hidden form — submits the uploaded image to Google Lens in a new tab */}
      <form
        ref={lensFormRef}
        method="post"
        action="https://lens.google.com/upload"
        encType="multipart/form-data"
        target="_blank"
        className="hidden"
      >
        <input ref={lensFileInputRef} type="file" name="encoded_image" />
      </form>

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

        {active === "image" && (
          <div className="flex flex-col gap-3 py-2">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            />

            {/* Drag-and-drop upload zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-xl py-8 px-6 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
                isDragging
                  ? "border-teal-500 bg-teal-50"
                  : selectedFile
                  ? "border-teal-400 bg-teal-50/60"
                  : "border-gray-300 hover:border-teal-400 hover:bg-gray-50"
              }`}
            >
              <CameraIcon />
              <p className="text-sm font-medium text-gray-600">
                {selectedFile ? selectedFile.name : "Drop a photo or click to upload"}
              </p>
            </div>

            {/* Name + location + action buttons — revealed after a file is chosen */}
            {selectedFile && (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageSearchName}
                    onChange={(e) => setImageSearchName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter their name"
                    className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                  />
                  <input
                    type="text"
                    value={imageSearchLocation}
                    onChange={(e) => setImageSearchLocation(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="City, State"
                    className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors"
                  >
                    Search by Name
                  </button>
                  <button
                    type="button"
                    onClick={handleFaceSearch}
                    className="flex-1 py-2.5 border border-teal-600 text-teal-700 text-sm font-semibold rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    Search by Face
                  </button>
                </div>
              </>
            )}

            {/* Affiliate CTA */}
            <div className="mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="flex-1 text-sm text-gray-600">
                Want a full background check? Run one now on{" "}
                <strong className="text-gray-800">TruthFinder</strong>.
              </p>
              <a
                href="https://www.truthfinder.com/?utm_source=peoplefind"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Run Background Check →
              </a>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
