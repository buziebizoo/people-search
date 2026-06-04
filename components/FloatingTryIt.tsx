import Link from "next/link";

// Fixed tab pinned to the right edge of the viewport. z-9999 so it sits above
// everything, including the coming-soon gate. Links to the Check Him flow.
export default function FloatingTryIt() {
  return (
    <Link
      href="/check"
      aria-label="Try It — check him now"
      style={{
        position: "fixed",
        top: 80,
        right: 0,
        zIndex: 9999,
        writingMode: "vertical-rl",
      }}
      className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-2 rounded-l-lg shadow-lg transition-colors"
    >
      Try It
    </Link>
  );
}
