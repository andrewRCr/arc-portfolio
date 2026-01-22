import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { SkillsSection } from "@/components/sections/SkillsSection";

export default function SkillsPage() {
  return (
    <PageLayout
      pageId="skills"
      header={<PageHeader title="Skills & Technologies" subtitle="Proficiencies across the full stack." />}
    >
      <SkillsSection />
    </PageLayout>
  );
}
