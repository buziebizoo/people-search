import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import StatsBar from "@/components/StatsBar";
import ExplainerSection from "@/components/ExplainerSection";
import DirectorySection from "@/components/DirectorySection";
import { getAllPosts, formatPostDate, type BlogCategory } from "@/lib/blog";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Who Is My Date? - Free People Search | Public Records Lookup";
  const description =
    "Search 100M+ public records free. Find anyone by name, phone, or address. View addresses, phone numbers, relatives and background info. No sign-up required.";
  return { title, description, openGraph: { title, description } };
}

const includedItems = [
  { emoji: "📍", label: "Current Address" },
  { emoji: "📞", label: "Phone Numbers" },
  { emoji: "👥", label: "Possible Relatives" },
  { emoji: "🏡", label: "Address History" },
  { emoji: "📧", label: "Email Addresses" },
  { emoji: "⚖️", label: "Criminal Records*" },
  { emoji: "🎂", label: "Age & Birthday" },
  { emoji: "💼", label: "Employment Info*" },
];

function IncludedSection() {
  return (
    <section className="bg-teal-950 text-white py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-white text-2xl font-bold text-center mb-10">
          What&apos;s included in every search
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {includedItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <span className="text-2xl leading-none">{item.emoji}</span>
              <span className="text-sm font-medium text-teal-100">{item.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-teal-300/70">
          * Available via full background report
        </p>
      </div>
    </section>
  );
}

const BLOG_CATEGORY_STYLES: Record<BlogCategory, string> = {
  "Dating Safety": "bg-rose-100 text-rose-700",
  "People Search": "bg-teal-100 text-teal-700",
  "Background Checks": "bg-indigo-100 text-indigo-700",
};

function BlogTeaser() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-20 px-4 sm:px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest from the Blog</h2>
          <Link href="/blog" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${BLOG_CATEGORY_STYLES[post.category]}`}
                >
                  {post.category}
                </span>
                <time className="text-xs text-gray-400" dateTime={post.date}>
                  {formatPostDate(post.date)}
                </time>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                <Link href={`/blog/${post.slug}`} className="hover:text-teal-600 transition-colors">
                  {post.title}
                </Link>
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <StatsBar />
      <IncludedSection />
      <ExplainerSection />
      <BlogTeaser />
      <DirectorySection />
    </>
  );
}
