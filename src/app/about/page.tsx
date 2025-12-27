import { EducationSection } from "@/components/sections/EducationSection";
import { AboutSection } from "@/components/sections/AboutSection";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <AboutSection />
      <EducationSection />
    </div>
  );
}
