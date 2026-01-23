"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Hero } from "@/components/layout/Hero";
import { FeaturedSection } from "@/components/sections/FeaturedSection";
import { SkillLogoGrid } from "@/components/skills/SkillLogoGrid";
import { skills } from "@/data/skills";
import { BODY_CONTENT_DELAY, BODY_CONTENT_DURATION, HIDE_DURATION } from "@/lib/intro-timing";
import { useIsPhone } from "@/hooks/useMediaQuery";
import { useLayoutPreferences } from "@/contexts/LayoutPreferencesContext";
import { useIntroContext } from "@/contexts/IntroContext";

// Extract featured skills from all categories
const allFeaturedSkills = Object.values(skills)
  .flat()
  .filter((skill) => skill.featured);

// Explicit ordering for Home page - grouped by ecosystem:
// JS/frontend stack, Python stack, Microsoft stack, AI footer
const featuredOrderDesktop = [
  "TypeScript",
  "React",
  "Next.js",
  "Python",
  "Django",
  "C#",
  ".NET",
  "Blazor",
  "Claude Code",
  "Codex CLI",
];

// Mobile: curated 6 skills (2 per ecosystem, no AI - fits single row)
const featuredOrderMobile = ["TypeScript", "React", "Python", "Django", "C#", ".NET"];

const getFeaturedSkills = (order: string[]) =>
  order
    .map((name) => allFeaturedSkills.find((s) => s.name === name))
    .filter((s): s is (typeof allFeaturedSkills)[number] => s !== undefined);

export default function Home() {
  const isPhone = useIsPhone();
  const { layoutMode } = useLayoutPreferences();
  const { isHiddenUntilMorph } = useIntroContext();

  // Responsive positioning: hero on phone (visible immediately), below featured on tablet/desktop
  // Mobile boxed: curated 6 skills (single row). Mobile fullscreen: full 10 (5/5 split)
  const skillsInHero = isPhone;
  const useFullSkillSet = !isPhone || layoutMode === "full";
  const featuredSkills = getFeaturedSkills(useFullSkillSet ? featuredOrderDesktop : featuredOrderMobile);

  const heroContent = skillsInHero ? (
    <Hero>
      <SkillLogoGrid skills={featuredSkills} layout="row" size="responsive" linkToProjects={true} />
    </Hero>
  ) : (
    <Hero />
  );

  return (
    <PageLayout pageId="home" header={heroContent} headerType="hero" stickyHeader>
      <motion.div
        className="flex-1 flex flex-col px-2 pb-2 md:px-12 md:pb-8"
        initial={false}
        animate={{ opacity: isHiddenUntilMorph ? 0 : 1 }}
        transition={
          isHiddenUntilMorph
            ? { duration: HIDE_DURATION }
            : {
                duration: BODY_CONTENT_DURATION,
                delay: BODY_CONTENT_DELAY,
                ease: "easeOut",
              }
        }
      >
        <FeaturedSection />
        {!skillsInHero && (
          <div className="mt-6 md:mt-16 flex justify-center">
            <SkillLogoGrid skills={featuredSkills} layout="row" size="responsive" linkToProjects={true} />
          </div>
        )}
      </motion.div>
    </PageLayout>
  );
}
