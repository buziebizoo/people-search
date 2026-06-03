"use client";

import { useEffect, useState } from "react";

export default function BannerAd({
  size,
  seed,
  page,
  className = "",
}: {
  size: "728x90" | "300x250" | "468x60";
  seed: number;
  page: string;
  className?: string;
}) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    import("@/lib/banners").then(({ pickBanner, injectSid }) => {
      const banner = pickBanner(size, seed);
      const sid = `${size}-${banner.id}-${page}`;
      setHtml(injectSid(banner.html, sid));
    });
  }, [size, seed, page]);

  if (!html) return null;

  return (
    <div
      className={`overflow-hidden ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
