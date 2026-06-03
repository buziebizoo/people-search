import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllPosts,
  formatPostDate,
  readingTimeMinutes,
  BLOG_CATEGORIES,
  type BlogCategory,
} from "@/lib/blog";

export const metadata: Metadata = {
  title: "Who Is My Date? Blog",
  description:
    "Tips on online dating safety, background checks, and people search. Learn how to verify someone's identity before meeting up.",
  openGraph: {
    title: "Who Is My Date? Blog",
    description:
      "Tips on online dating safety, background checks, and people search. Learn how to verify someone's identity before meeting up.",
  },
};

type Props = { searchParams: Promise<{ category?: string }> };

const CATEGORY_STYLES: Record<BlogCategory, string> = {
  "Dating Safety": "bg-rose-100 text-rose-700",
  "People Search": "bg-teal-100 text-teal-700",
  "Background Checks": "bg-indigo-100 text-indigo-700",
};

export default async function BlogIndexPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const active = (BLOG_CATEGORIES.find((c) => c === category) ?? "All") as
    | "All"
    | BlogCategory;

  const posts = getAllPosts().filter(
    (p) => active === "All" || p.category === active,
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Who Is My Date? <span className="text-teal-600">Blog</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Tips on online dating safety, background checks, and people search.
          Learn how to verify someone&apos;s identity before meeting up.
        </p>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {BLOG_CATEGORIES.map((c) => {
          const href = c === "All" ? "/blog" : `/blog?category=${encodeURIComponent(c)}`;
          const isActive = c === active;
          return (
            <Link
              key={c}
              href={href}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {c}
            </Link>
          );
        })}
      </div>

      {/* Post grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${CATEGORY_STYLES[post.category]}`}
              >
                {post.category}
              </span>
              <time className="text-xs text-gray-400" dateTime={post.date}>
                {formatPostDate(post.date)}
              </time>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
              <Link href={`/blog/${post.slug}`} className="hover:text-teal-600 transition-colors">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">{post.excerpt}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-400">
                {readingTimeMinutes(post.content)} min read
              </span>
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                Read More →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-gray-500 text-center py-12">No posts in this category yet.</p>
      )}
    </div>
  );
}
