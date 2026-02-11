import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { SkillsSection } from "@/components/sections/SkillsSection";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Technical skills spanning frontend and backend web development, databases, DevOps tooling, testing frameworks, and AI-assisted workflows.",
};

export default function SkillsPage() {
  return (
    <PageLayout
      pageId="skills"
      header={<PageHeader title="Skills // Technologies" subtitle="Proficiencies across the full stack." />}
    >
      <SkillsSection />
    </PageLayout>
  );
}
