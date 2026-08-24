import HeroExperience from "@/components/HeroExperience";
import MonitorShowcase from "@/components/MonitorShowcase";
import FeaturePills from "@/components/FeaturePills";
import InstallationSection from "@/components/InstallationSection";
import DownloadSection from "@/components/DownloadSection";
import Footer from "@/components/Footer";
import FloatingButterfly from "@/components/FloatingButterfly";
import FloatingCallouts from "@/components/FloatingCallouts";

export default function Home() {
  return (
    <main className="relative w-full">
      {/* Global atmospheric overlays */}
      <FloatingButterfly />
      <FloatingCallouts />

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
