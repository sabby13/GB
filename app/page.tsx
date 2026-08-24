import HeroExperience from "@/components/HeroExperience";
import MonitorShowcase from "@/components/MonitorShowcase";
import FeaturePills from "@/components/FeaturePills";
import InstallationSection from "@/components/InstallationSection";
import DownloadSection from "@/components/DownloadSection";
import Footer from "@/components/Footer";
import FloatingButterfly from "@/components/FloatingButterfly";

export default function Home() {
  return (
    <main className="relative w-full">
      {/* Global atmospheric overlay — occasional butterfly fly-by */}
      <FloatingButterfly />

      {/* Opening sequence + sticky logo */}
      <HeroExperience />

      {/* Content */}
      <MonitorShowcase />
      <FeaturePills />
      <InstallationSection />
      <DownloadSection />
      <Footer />
    </main>
  );
}
