import Link from "next/link";
import ResultsSearchBar from "@/components/ResultsSearchBar";

export default function NotFound() {
  return (
    <div className="bg-gray-50 flex-1">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <svg className="mx-auto mb-5 h-14 w-14 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0Z" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          We couldn&rsquo;t find the page you were looking for. Try searching for a
          person instead, or head back home.
        </p>
        <Link
          href="/"
          className="inline-block text-teal-600 hover:text-teal-700 font-medium underline mb-2"
        >
          ← Back to home
        </Link>
      </div>

      <ResultsSearchBar initialType="name" />
    </div>
  );
}
