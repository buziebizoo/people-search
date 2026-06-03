import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <p className="mb-6 leading-relaxed text-gray-500">
          <strong className="text-gray-300">Legal Disclaimer:</strong> Who Is My Date?
          aggregates publicly available information from government records,
          public databases, and other lawful sources. We are not a consumer
          reporting agency as defined by the Fair Credit Reporting Act (FCRA) and
          our services may not be used for any FCRA-regulated purpose, including
          tenant screening, employment decisions, or credit determinations.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/opt-out" className="hover:text-white transition-colors">
            Opt Out / Remove My Info
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>
        <p className="mt-6 text-xs text-gray-600">
          © {new Date().getFullYear()} Who Is My Date?. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
