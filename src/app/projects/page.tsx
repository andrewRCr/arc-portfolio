"use client";

import { Suspense, useMemo, useLayoutEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ProjectTabs from "@/components/projects/ProjectTabs";
import ProjectCard from "@/components/projects/ProjectCard";
import SkillFilterControl from "@/components/projects/SkillFilterControl";
import FilterIndicator from "@/components/projects/FilterIndicator";
import Crossfade from "@/components/common/Crossfade";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { projects } from "@/data/projects";
import { mods } from "@/data/mods";
import { contact } from "@/data/contact";
import { NexusModsIcon } from "@/components/icons/NexusModsIcon";
import { TextLink } from "@/components/common/TextLink";
import { FEATURES } from "@/config/features";
import { filterProjectsBySkills } from "@/lib/project-filters";
import { TAB_CONTENT_DURATION, MATERIAL_EASE } from "@/lib/animation-timing";
import { Project } from "@/types/project";
import { useScrollViewport } from "@/components/layout/ScrollContext";

/** Scrolls viewport to top when tab changes, synced with exit animation. Must be inside PageLayout. */
function ScrollResetOnTabChange({ currentTab }: { currentTab: string }) {
  const { viewport } = useScrollViewport();
  const reducedMotion = useReducedMotion();
  const prevTabRef = useRef(currentTab);

  useLayoutEffect(() => {
    if (prevTabRef.current !== currentTab && viewport) {
      // Delay scroll until exit animation completes (opacity at 0)
      const delayMs = reducedMotion ? 0 : TAB_CONTENT_DURATION * 1000;
      const timer = setTimeout(() => {
        viewport.scrollTop = 0;
      }, delayMs);
      prevTabRef.current = currentTab;
      return () => clearTimeout(timer);
    }
    prevTabRef.current = currentTab;
  }, [currentTab, viewport, reducedMotion]);

  return null;
}

/** Reusable tab panel component for project grids */
function TabPanel({
  id,
  projects,
  categoryType,
  withTabAttributes = true,
}: {
  id: string;
  projects: Project[];
  categoryType: "software" | "games" | "mods";
  /** Set false when rendering without tab navigation (e.g., tabs feature disabled) */
  withTabAttributes?: boolean;
}) {
  return (
    <div
      id={withTabAttributes ? `panel-${id}` : undefined}
      role={withTabAttributes ? "tabpanel" : undefined}
      aria-labelledby={withTabAttributes ? `tab-${id}` : undefined}
      tabIndex={withTabAttributes ? 0 : undefined}
      className="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} categoryType={categoryType} />
        ))}
      </div>
    </div>
  );
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  // Tab content animation config
  const tabContentAnimation = shouldReduceMotion
    ? {} // No animation with reduced motion
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: TAB_CONTENT_DURATION, ease: MATERIAL_EASE },
      };

  // Parse skills query param (comma-separated)
  const skillsParam = searchParams.get("skills");
  const selectedSkills = useMemo(() => {
    if (!skillsParam) return [];
    return skillsParam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }, [skillsParam]);

  const isFiltered = selectedSkills.length > 0;

  // Tab handling (only when not filtered)
  const validTabs = ["software", "games", "mods"] as const;
  const tabParam = searchParams.get("tab");
  const currentTab =
    FEATURES.SHOW_ALL_PROJECT_TYPES && tabParam && validTabs.includes(tabParam as (typeof validTabs)[number])
      ? (tabParam as (typeof validTabs)[number])
      : "software";

  // Projects available for skill filtering (scoped by feature flag)
  const filterableProjects: Project[] = useMemo(() => {
    if (FEATURES.SHOW_ALL_PROJECT_TYPES) {
      return [...projects, ...mods].sort((a, b) => a.order - b.order);
    }
    return [...projects].filter((p) => p.projectType === "software").sort((a, b) => a.order - b.order);
  }, []);

  // Filtered results (when skills are selected)
  const filteredProjects = useMemo(() => {
    if (!isFiltered) return [];
    return filterProjectsBySkills(filterableProjects, selectedSkills);
  }, [filterableProjects, selectedSkills, isFiltered]);

  // Non-filtered project lists (for tab view)
  const allProjects = useMemo(() => [...projects].sort((a, b) => a.order - b.order), []);
  const softwareProjects = allProjects.filter((p) => p.projectType === "software");
  const gameProjects = allProjects.filter((p) => p.projectType === "game");
  const sortedMods = FEATURES.SHOW_ALL_PROJECT_TYPES ? [...mods].sort((a, b) => a.order - b.order) : [];

  // Handle skill filter changes - update URL
  const handleSkillsChange = (skills: string[]) => {
    if (skills.length === 0) {
      router.push("/projects");
    } else {
      // Encode each skill to handle special chars (C++, C#, etc.)
      const encodedSkills = skills.map((s) => encodeURIComponent(s)).join(",");
      router.push(`/projects?skills=${encodedSkills}`);
    }
  };

  // Handle removing a single skill
  const handleRemoveSkill = (skill: string) => {
    const newSkills = selectedSkills.filter((s) => s !== skill);
    handleSkillsChange(newSkills);
  };

  // Handle clear all
  const handleClearAll = () => {
    router.push("/projects");
  };

  // Determine project type for card links in filtered view
  const getCategoryType = (project: Project) => {
    if (project.projectType === "game") return "games";
    if (project.projectType === "mod") return "mods";
    return "software";
  };

  return (
    <PageLayout
      pageId="projects"
      header={
        <PageHeader title="Projects" hideDivider={FEATURES.SHOW_ALL_PROJECT_TYPES}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            {/* Left: Tabs (when all types shown) or Filter Indicator (when filtering) */}
            {(FEATURES.SHOW_ALL_PROJECT_TYPES || isFiltered) && (
              <div className="min-w-0 sm:flex-1 min-h-11">
                {FEATURES.SHOW_ALL_PROJECT_TYPES ? (
                  <Crossfade
                    active={isFiltered}
                    activeContent={
                      <FilterIndicator
                        skills={selectedSkills}
                        onRemoveSkill={handleRemoveSkill}
                        onClearAll={handleClearAll}
                      />
                    }
                    inactiveContent={<ProjectTabs />}
                  />
                ) : (
                  <FilterIndicator
                    skills={selectedSkills}
                    onRemoveSkill={handleRemoveSkill}
                    onClearAll={handleClearAll}
                  />
                )}
              </div>
            )}

            {/* Filter Button (always visible) */}
            <div className="shrink-0 flex justify-center sm:justify-end sm:mr-4">
              <SkillFilterControl
                allProjects={filterableProjects}
                selectedSkills={selectedSkills}
                onSkillsChange={handleSkillsChange}
              />
            </div>
          </div>
        </PageHeader>
      }
    >
      {/* Must be inside PageLayout to access ScrollContext */}
      <ScrollResetOnTabChange currentTab={currentTab} />

      <div className="px-4">
        {/* ARIA Live Region for result count */}
        {isFiltered && (
          <div role="status" aria-live="polite" className="sr-only">
            Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* Filtered Results View */}
        {isFiltered && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} categoryType={getCategoryType(project)} />
              ))}
            </div>
            {filteredProjects.length === 0 && (
              <p className="text-muted-foreground py-8 text-center">No projects found matching the selected skills.</p>
            )}
          </div>
        )}

        {/* Tab-based Views (when not filtered) */}
        {!isFiltered && (
          <AnimatePresence mode="wait">
            {currentTab === "software" && (
              <motion.div key="software" data-tab-content {...tabContentAnimation}>
                <TabPanel
                  id="software"
                  projects={softwareProjects}
                  categoryType="software"
                  withTabAttributes={FEATURES.SHOW_ALL_PROJECT_TYPES}
                />
              </motion.div>
            )}
            {FEATURES.SHOW_ALL_PROJECT_TYPES && currentTab === "games" && (
              <motion.div key="games" data-tab-content {...tabContentAnimation}>
                <TabPanel id="games" projects={gameProjects} categoryType="games" />
              </motion.div>
            )}
            {FEATURES.SHOW_ALL_PROJECT_TYPES && currentTab === "mods" && (
              <motion.div key="mods" data-tab-content {...tabContentAnimation}>
                <TabPanel id="mods" projects={sortedMods} categoryType="mods" />
                {/* Footer card linking to full NexusMods profile */}
                <div className="mt-6 flex justify-center">
                  <div className="rounded-lg border border-border bg-surface-background px-6 py-3 text-sm text-muted-foreground">
                    <span className="sm:hidden">See more at </span>
                    <span className="hidden sm:inline">See additional published mods at </span>
                    <TextLink href={contact.socialLinks.find((l) => l.platform === "NexusMods")?.url ?? "#"}>
                      <NexusModsIcon className="inline-block h-3.5 w-3.5 align-[-0.125rem]" />
                      {" NexusMods"}
                    </TextLink>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </PageLayout>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
