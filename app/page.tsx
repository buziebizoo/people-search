import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import StatsBar from "@/components/StatsBar";
import ExplainerSection from "@/components/ExplainerSection";
import DirectorySection from "@/components/DirectorySection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <StatsBar />
      <ExplainerSection />
      <DirectorySection />
    </>
  );
}
