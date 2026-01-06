import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { EducationSection } from "@/components/sections/EducationSection";
import { AboutSection } from "@/components/sections/AboutSection";

export default function AboutPage() {
  return (
    <PageLayout header={<PageHeader title="About" subtitle="Background and qualifications." />}>
      <div className="space-y-8">
        <AboutSection />
        <EducationSection />
      </div>
    </PageLayout>
  );
}
