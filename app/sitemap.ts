import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase";
import { STATES, CODE_TO_STATE } from "@/lib/states";
import { buildSupabaseSlug } from "@/lib/profile-slug";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://whoismy.date";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`,              changeFrequency: "daily",   priority: 1 },
  { url: `${BASE_URL}/about`,         changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/blog`,          changeFrequency: "weekly",  priority: 0.7 },
  { url: `${BASE_URL}/reverse-phone-lookup`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/privacy-policy`,changeFrequency: "yearly",  priority: 0.3 },
  { url: `${BASE_URL}/terms`,         changeFrequency: "yearly",  priority: 0.3 },
  { url: `${BASE_URL}/opt-out`,       changeFrequency: "yearly",  priority: 0.4 },
  { url: `${BASE_URL}/contact`,       changeFrequency: "yearly",  priority: 0.4 },
  { url: `${BASE_URL}/people`,        changeFrequency: "weekly",  priority: 0.7 },
];

const BLOG_PAGES: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
  url: `${BASE_URL}/blog/${p.slug}`,
  changeFrequency: "weekly",
  priority: 0.7,
}));

const STATE_PAGES: MetadataRoute.Sitemap = STATES.map((s) => ({
  url: `${BASE_URL}/people/${s.slug}`,
  changeFrequency: "weekly",
  priority: 0.7,
}));

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();
  if (!supabase) return [...STATIC_PAGES, ...BLOG_PAGES, ...STATE_PAGES];

  // Collect distinct state+city combos for city browse pages
  const citySet = new Map<string, Set<string>>(); // code → Set<citySlug>
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("people")
      .select("state, city")
      .range(from, from + 999);
    if (error || !data || data.length === 0) break;
    for (const row of data) {
      if (!row.state || !row.city) continue;
      if (!citySet.has(row.state)) citySet.set(row.state, new Set());
      citySet.get(row.state)!.add(
        (row.city as string).toLowerCase().replace(/\s+/g, "-")
      );
    }
    if (data.length < 1000) break;
    from += 1000;
  }

  const cityPages: MetadataRoute.Sitemap = [];
  for (const [code, slugs] of citySet) {
    const stateInfo = CODE_TO_STATE.get(code);
    if (!stateInfo) continue;
    for (const citySlug of slugs) {
      cityPages.push({
        url: `${BASE_URL}/people/${stateInfo.slug}/${citySlug}`,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  // Profile pages — use clean slug URLs
  const profileUrls: MetadataRoute.Sitemap = [];
  from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("people")
      .select("id, first_name, last_name, city, state")
      .range(from, from + 999);
    if (error || !data || data.length === 0) break;
    for (const row of data) {
      const slug = buildSupabaseSlug(
        row.first_name ?? "",
        row.last_name ?? "",
        row.city,
        row.state,
        row.id,
      );
      profileUrls.push({
        url: `${BASE_URL}/profile/${slug}`,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
    if (data.length < 1000) break;
    from += 1000;
  }

  return [...STATIC_PAGES, ...BLOG_PAGES, ...STATE_PAGES, ...cityPages, ...profileUrls];
}
