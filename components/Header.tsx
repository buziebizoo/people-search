"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/",                     label: "Home"           },
  { href: "/people",               label: "Browse"         },
  { href: "/reverse-phone-lookup", label: "Reverse Lookup" },
  { href: "/blog",                 label: "Blog"           },
  { href: "/about",                label: "About"          },
  { href: "/opt-out",              label: "Remove My Info" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="text-lg sm:text-xl font-bold text-teal-600 tracking-tight shrink-0">
          Who Is My Date?
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-teal-600 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="sm:hidden p-2 -mr-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="sm:hidden border-t border-gray-100 bg-white px-4 py-2">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center py-3 text-sm font-medium text-gray-700 hover:text-teal-600 border-b border-gray-50 last:border-0 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
