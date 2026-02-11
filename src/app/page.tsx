"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Hero } from "@/components/layout/Hero";
import { FeaturedSection } from "@/components/sections/FeaturedSection";
import { SkillLogoGrid } from "@/components/skills/SkillLogoGrid";
import { skills } from "@/data/skills";
import {
  BODY_CONTENT_DELAY,
  BODY_CONTENT_DURATION,
  HIDE_DURATION,
  REFRESH_CONTENT_DELAY,
  REFRESH_CONTENT_DURATION,
  SKIP_BODY_DELAY,
  SKIP_CONTENT_DURATION,
  MATERIAL_EASE,
  LAYOUT_CONTENT_FADE_DURATION,
} from "@/lib/animation-timing";
import { useIsPhone } from "@/hooks/useMediaQuery";
import { useLayoutPreferences, type LayoutMode } from "@/contexts/LayoutPreferencesContext";
import { useAnimationContext, type AnimationMode } from "@/contexts/AnimationContext";
import { personJsonLd } from "@/lib/json-ld";

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

/** Content fade-out duration in ms (from animation-timing.ts) */
const CONTENT_FADE_OUT_MS = LAYOUT_CONTENT_FADE_DURATION * 1000;

export default function Home() {
  const isPhone = useIsPhone();
  const { layoutMode, isLayoutTransitioning } = useLayoutPreferences();
  const { animationMode, visibility } = useAnimationContext();

  // Use new visibility flag - accounts for initialization
  const contentVisible = visibility.contentVisible;

  // Delayed layout mode - waits for content fade-out before updating.
  // This prevents the skills row from changing while still visible.
  const [delayedLayoutMode, setDelayedLayoutMode] = useState<LayoutMode>(layoutMode);

  useEffect(() => {
    // Delay update when transitioning (waits for fade-out), sync immediately otherwise
    const delay = isLayoutTransitioning ? CONTENT_FADE_OUT_MS : 0;
    const timer = setTimeout(() => {
      setDelayedLayoutMode(layoutMode);
    }, delay);
    return () => clearTimeout(timer);
  }, [layoutMode, isLayoutTransitioning]);

  // Get body content timing based on animationMode
  const getBodyContentTiming = (mode: AnimationMode) => {
    switch (mode) {
      case "instant":
        return { duration: 0 };
      case "route":
        // Route: body content doesn't need special timing (already visible context)
        return { duration: 0.3, ease: MATERIAL_EASE };
      case "refresh":
        return {
          duration: REFRESH_CONTENT_DURATION,
          delay: REFRESH_CONTENT_DELAY + 0.1, // Slightly after hero
          ease: MATERIAL_EASE,
        };
      case "skip":
        return {
          duration: SKIP_CONTENT_DURATION,
          delay: SKIP_BODY_DELAY,
          ease: MATERIAL_EASE,
        };
      case "intro":
      default:
        return {
          duration: BODY_CONTENT_DURATION,
          delay: BODY_CONTENT_DELAY,
          ease: "easeOut" as const,
        };
    }
  };

  const bodyTransition = contentVisible ? getBodyContentTiming(animationMode) : { duration: HIDE_DURATION };

  // Responsive positioning: hero on phone (visible immediately), below featured on tablet/desktop
  // Mobile boxed: curated 6 skills (single row). Mobile fullscreen: full 10 (5/5 split)
  // Uses delayedLayoutMode to wait for content fade-out before changing skills list
  const skillsInHero = isPhone;
  const useFullSkillSet = !isPhone || delayedLayoutMode === "full";
  const featuredSkills = getFeaturedSkills(useFullSkillSet ? featuredOrderDesktop : featuredOrderMobile);

  const heroContent = skillsInHero ? (
    <Hero>
      <SkillLogoGrid skills={featuredSkills} layout="row" size="responsive" linkToProjects={true} />
    </Hero>
  ) : (
    <Hero />
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }} />
      <PageLayout pageId="home" header={heroContent} headerType="hero" stickyHeader>
        <motion.div
          className="flex-1 flex flex-col px-2 pb-2 md:px-12 md:pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: contentVisible ? 1 : 0 }}
          transition={bodyTransition}
        >
          <FeaturedSection />
          {!skillsInHero && (
            <div className="mt-6 md:mt-16 flex justify-center">
              <SkillLogoGrid skills={featuredSkills} layout="row" size="responsive" linkToProjects={true} />
            </div>
          )}
        </motion.div>
      </PageLayout>
    </>
  );
}
