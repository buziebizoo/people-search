import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase";

const BASE_URL = "https://whoismy.date";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1 },
  { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE_URL}/opt-out`, changeFrequency: "yearly", priority: 0.4 },
  { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
];

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();
  if (!supabase) return STATIC_PAGES;

  const profileUrls: MetadataRoute.Sitemap = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("people")
      .select("id")
      .range(from, from + pageSize - 1);

    if (error || !data || data.length === 0) break;

    for (const row of data) {
      profileUrls.push({
        url: `${BASE_URL}/profile/${row.id}`,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    if (data.length < pageSize) break;
    from += pageSize;
  }

  return [...STATIC_PAGES, ...profileUrls];
}
