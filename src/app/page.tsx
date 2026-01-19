import { PageLayout } from "@/components/layout/PageLayout";
import { Hero } from "@/components/layout/Hero";
import { FeaturedSection } from "@/components/sections/FeaturedSection";
import { SkillLogoGrid } from "@/components/skills/SkillLogoGrid";
import { skills } from "@/data/skills";

// Extract featured skills from all categories
const allFeaturedSkills = Object.values(skills)
  .flat()
  .filter((skill) => skill.featured);

// Explicit ordering for Home page - grouped by ecosystem:
// JS/frontend, Python stack, Microsoft stack
const featuredOrder = ["TypeScript", "React", "Python", "Django", "C#", ".NET"];
const featuredSkills = featuredOrder
  .map((name) => allFeaturedSkills.find((s) => s.name === name))
  .filter((s) => s !== undefined);

export default function Home() {
  return (
    <PageLayout pageId="home" header={<Hero />} headerType="hero" stickyHeader>
      <div className="flex-1 flex flex-col px-2 pb-2 md:px-8 md:pb-8">
        <FeaturedSection />
        <div className="mt-4 flex justify-center">
          <SkillLogoGrid skills={featuredSkills} layout="row" size="responsive" linkToProjects={true} />
        </div>
      </div>
    </PageLayout>
  );
}
