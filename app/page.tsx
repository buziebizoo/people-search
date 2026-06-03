import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import StatsBar from "@/components/StatsBar";
import ExplainerSection from "@/components/ExplainerSection";
import DirectorySection from "@/components/DirectorySection";

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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <StatsBar />
      <IncludedSection />
      <ExplainerSection />
      <DirectorySection />
    </>
  );
}
