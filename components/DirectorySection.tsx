import Link from "next/link";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const DIGITS = "0123456789".split("");

export default function DirectorySection() {
  return (
    <section className="bg-gray-50 py-14 px-4 sm:px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Name Directory</h2>
          <div className="flex flex-wrap gap-2">
            {LETTERS.map((letter) => (
              <Link
                key={letter}
                href={`/name/${letter.toLowerCase()}`}
                className="px-3 py-1.5 text-sm font-medium text-teal-700 border border-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors"
              >
                {letter}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Phone Directory</h2>
          <div className="flex flex-wrap gap-2">
            {DIGITS.map((digit) => (
              <Link
                key={digit}
                href={`/phone/${digit}`}
                className="px-3 py-1.5 text-sm font-medium text-teal-700 border border-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors"
              >
                {digit}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
