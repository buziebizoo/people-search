"use client";

import { useEffect, useState } from "react";
import { pickAffiliate } from "@/lib/affiliates";

export default function ImageResultsPanel() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("imagePreview");
    if (stored) setPreviewUrl(stored);
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Uploaded photo preview */}
      {previewUrl && (
        <div className="flex justify-center">
          <img
            src={previewUrl}
            alt="Uploaded photo"
            className="max-h-64 rounded-xl shadow-md object-contain border border-gray-200"
          />
        </div>
      )}

      {/* Google Lens results card */}
      <div className="bg-white border border-gray-200 rounded-xl px-6 py-6 shadow-sm text-center">
        <p className="text-gray-800 font-semibold text-base mb-1">
          Web matches found via Google Lens
        </p>
        <p className="text-sm text-gray-500 mb-4">
          View reverse image search results to identify people, places, and more.
        </p>
        <a
          href="https://lens.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          View Image Results
        </a>
      </div>

      {/* Affiliate CTA card */}
      <div className="bg-white border border-gray-200 rounded-xl px-6 py-6 shadow-sm">
        <p className="text-gray-800 font-semibold text-base mb-1">
          Find Full Background Report
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Search criminal records, social profiles, contact info, and more.
        </p>
        <a
          href={pickAffiliate("background", 0)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          Find Full Background Report →
        </a>
      </div>
    </div>
  );
}
