import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold text-teal-600 tracking-tight">
          Who Is My Date?
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-teal-600 transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-teal-600 transition-colors">
            About
          </Link>
          <Link
            href="/opt-out"
            className="hover:text-teal-600 transition-colors"
          >
            Remove My Info
          </Link>
        </nav>
      </div>
    </header>
  );
}
