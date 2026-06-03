const stats = [
  { headline: "100M+", label: "Public Records" },
  { headline: "All 50 States", label: "Nationwide Coverage" },
  { headline: "Always Free", label: "No Hidden Fees" },
  { headline: "Instant", label: "Search Results" },
];

export default function StatsBar() {
  return (
    <div className="bg-gray-900 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.headline}>
            <p className="text-lg sm:text-xl font-extrabold text-white whitespace-nowrap">{s.headline}</p>
            <p className="mt-1 text-sm text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
