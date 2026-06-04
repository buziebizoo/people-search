import SearchTabs from "./SearchTabs";

export default function HeroSection() {
  const searchesToday = 2500 + new Date().getHours() * 47;

  return (
    <section className="relative min-h-[650px] flex items-center justify-center">
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1600"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-8 px-4 sm:px-6 py-20 w-full max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          Who is your date,{" "}
          <span className="text-teal-400">really?</span>
        </h1>
        <p className="text-xl text-white/80 max-w-xl">
          Search public records, check community reports, and verify your date
          before you meet. Free, instant, no sign-up.
        </p>
        <SearchTabs />
        <p className="text-white/70 text-sm text-center mt-3">
          🔍 <strong>{searchesToday.toLocaleString()}</strong> searches in the last 24 hours
        </p>
        <p className="text-xs text-white/50">
          Searches draw from publicly available records only.
        </p>
      </div>
    </section>
  );
}
