import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { SkillsSection } from "@/components/sections/SkillsSection";

export default function SkillsPage() {
  return (
    <PageLayout
      header={<PageHeader title="Skills & Technologies" subtitle="Technical proficiencies across the full stack." />}
    >
      <SkillsSection />
    </PageLayout>
  );
}
