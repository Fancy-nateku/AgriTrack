import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { DashboardPreview } from "@/components/DashboardPreview";
import { About } from "@/components/About";
import { ReportsPreview } from "@/components/ReportsPreview";
import { Contact } from "@/components/Contact";

interface IndexProps {
  onGetStarted: () => void;
}

export default function Index({ onGetStarted }: IndexProps) {
  return (
    <div className="min-h-screen">
      <Hero onGetStarted={onGetStarted} />
      <Features />
      <DashboardPreview />
      <About />
      <ReportsPreview />
      <Contact />
    </div>
  );
}
