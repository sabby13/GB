import HeroExperience from "@/components/HeroExperience";
import MonitorShowcase from "@/components/MonitorShowcase";
import FeaturePills from "@/components/FeaturePills";
import InstallationSection from "@/components/InstallationSection";
import DownloadSection from "@/components/DownloadSection";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <main className="relative w-full overflow-x-clip">

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
