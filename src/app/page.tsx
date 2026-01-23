"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Hero } from "@/components/layout/Hero";
import { FeaturedSection } from "@/components/sections/FeaturedSection";
import { SkillLogoGrid } from "@/components/skills/SkillLogoGrid";
import { skills } from "@/data/skills";
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

/**
 * Body content animation timing (seconds)
 * Completes after frame (~1.1s) as final element in sequence
 */
const BODY_ANIMATION = {
  /** When body content starts fading (after frame starts) */
  DELAY: 0.75,
  /** Duration of fade */
  DURATION: 0.35,
  /** Quick hide duration for retrigger */
  HIDE_DURATION: 0.15,
} as const;

export default function Home() {
  const isPhone = useIsPhone();
  const { layoutMode } = useLayoutPreferences();
  const { introPhase } = useIntroContext();

  // Body content hidden until expanding phase (same as secondary hero content)
  const isBodyHidden =
    introPhase === "entering" ||
    introPhase === "typing" ||
    introPhase === "loading" ||
    introPhase === "morphing";

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
        animate={{ opacity: isBodyHidden ? 0 : 1 }}
        transition={
          isBodyHidden
            ? { duration: BODY_ANIMATION.HIDE_DURATION }
            : {
                duration: BODY_ANIMATION.DURATION,
                delay: BODY_ANIMATION.DELAY,
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
