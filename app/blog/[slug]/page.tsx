import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pickAffiliate } from "@/lib/affiliates";
import BannerAd from "@/components/BannerAd";
import {
  getPostBySlug,
  getRelatedPosts,
  getAllPosts,
  formatPostDate,
  readingTimeMinutes,
  type BlogCategory,
} from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

const CATEGORY_STYLES: Record<BlogCategory, string> = {
  "Dating Safety": "bg-rose-100 text-rose-700",
  "People Search": "bg-teal-100 text-teal-700",
  "Background Checks": "bg-indigo-100 text-indigo-700",
};

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found | Who Is My Date?" };
  const title = `${post.title} | Who Is My Date?`;
  return {
    title,
    description: post.excerpt,
    openGraph: { title, description: post.excerpt, type: "article" },
  };
}

// ---------------------------------------------------------------------------
// Structured data (JSON-LD)
// ---------------------------------------------------------------------------

function ArticleJsonLd({
  title,
  description,
  date,
}: {
  title: string;
  description: string;
  date: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    author: { "@type": "Organization", name: "Who Is My Date? Team" },
    publisher: { "@type": "Organization", name: "Who Is My Date?" },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ---------------------------------------------------------------------------
// CTA — plain GET form to /results (no client JS needed)
// ---------------------------------------------------------------------------

function SearchCta({ affiliateUrl }: { affiliateUrl: string }) {
  return (
    <section className="bg-teal-950 rounded-2xl px-6 py-10 text-center">
      <h2 className="text-2xl font-bold text-white mb-2">Ready to search?</h2>
      <p className="text-teal-100 mb-6">
        Look up anyone by name using free public records.
      </p>
      <form
        action="/results"
        method="get"
        className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-4"
      >
        <input type="hidden" name="type" value="name" />
        <input
          name="first"
          placeholder="First name"
          aria-label="First name"
          className="flex-1 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <input
          name="last"
          placeholder="Last name"
          aria-label="Last name"
          className="flex-1 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
        >
          Search →
        </button>
      </form>
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-teal-300 hover:text-white transition-colors"
      >
        Or run a full background check with PeopleFinders →
      </a>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const seed = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const related = getRelatedPosts(post, 4);

  const splitIdx = post.content.indexOf("</p>");
  const contentBefore = splitIdx >= 0 ? post.content.slice(0, splitIdx + 4) : "";
  const contentAfter  = splitIdx >= 0 ? post.content.slice(splitIdx + 4) : post.content;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <ArticleJsonLd title={post.title} description={post.excerpt} date={post.date} />

      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium mb-8"
      >
        ← Back to Blog
      </Link>

      {/* Header */}
      <header className="mb-8">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${CATEGORY_STYLES[post.category]}`}
        >
          {post.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
          <span className="font-medium text-gray-700">Who Is My Date? Team</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{readingTimeMinutes(post.content)} min read</span>
        </div>
      </header>

      {/* Content */}
      <div
        className="
          text-gray-700 leading-relaxed
          [&>p]:mb-5
          [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-10 [&>h2]:mb-3
          [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul]:space-y-2
          [&>ul>li]:text-gray-700
          [&_strong]:text-gray-900 [&_strong]:font-semibold
        "
        dangerouslySetInnerHTML={{ __html: contentBefore }}
      />

      {splitIdx >= 0 && (
        <>
          <div className="my-6 flex justify-center sm:hidden">
            <BannerAd size="300x250" seed={seed} page="blog-mobile" />
          </div>
          <div className="my-6 justify-center hidden sm:flex">
            <BannerAd size="728x90" seed={seed} page="blog-desktop" />
          </div>
        </>
      )}

      <div
        className="
          text-gray-700 leading-relaxed
          [&>p]:mb-5
          [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-10 [&>h2]:mb-3
          [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul]:space-y-2
          [&>ul>li]:text-gray-700
          [&_strong]:text-gray-900 [&_strong]:font-semibold
        "
        dangerouslySetInnerHTML={{ __html: contentAfter }}
      />

      {/* CTA */}
      <div className="mt-14">
        <SearchCta affiliateUrl={pickAffiliate("dating", seed)} />
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mt-14 border-t border-gray-200 pt-10">
          <div className="flex justify-center my-8">
            <BannerAd size="300x250" seed={seed + 50} page="blog-bottom" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-2 gap-5">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="block bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-teal-300 transition-colors"
              >
                <span
                  className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full mb-2 ${CATEGORY_STYLES[r.category]}`}
                >
                  {r.category}
                </span>
                <h3 className="font-semibold text-gray-900 leading-snug mb-1">{r.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FCRA disclaimer */}
      <p className="mt-12 text-xs text-gray-400 border-t border-gray-100 pt-6 leading-relaxed">
        Who Is My Date? is not a consumer reporting agency as defined by the Fair
        Credit Reporting Act (FCRA). Information on this site may not be used for
        employment, housing, credit, tenant screening, or any other FCRA-regulated
        purpose.
      </p>
    </article>
  );
}
