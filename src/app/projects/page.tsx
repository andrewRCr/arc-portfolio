"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProjectTabs from "@/components/projects/ProjectTabs";
import ProjectCard from "@/components/projects/ProjectCard";
import SkillFilterPopover from "@/components/projects/SkillFilterPopover";
import FilterIndicator from "@/components/projects/FilterIndicator";
import Crossfade from "@/components/ui/Crossfade";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { projects } from "@/data/projects";
import { mods } from "@/data/mods";
import { FEATURES } from "@/config/features";
import { filterProjectsBySkills } from "@/lib/project-filters";
import { Project } from "@/types/project";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

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
    FEATURES.SHOW_PROJECT_TABS && tabParam && validTabs.includes(tabParam as (typeof validTabs)[number])
      ? (tabParam as (typeof validTabs)[number])
      : "software";

  // All projects and mods combined for filtering
  const allProjectsAndMods: Project[] = useMemo(() => {
    return [...projects, ...mods].sort((a, b) => a.order - b.order);
  }, []);

  // Filtered results (when skills are selected)
  const filteredProjects = useMemo(() => {
    if (!isFiltered) return [];
    return filterProjectsBySkills(allProjectsAndMods, selectedSkills);
  }, [allProjectsAndMods, selectedSkills, isFiltered]);

  // Non-filtered project lists (for tab view)
  const allProjects = useMemo(() => [...projects].sort((a, b) => a.order - b.order), []);
  const softwareProjects = allProjects.filter((p) => p.projectType === "software");
  const gameProjects = allProjects.filter((p) => p.projectType === "game");
  const sortedMods = FEATURES.SHOW_PROJECT_TABS ? [...mods].sort((a, b) => a.order - b.order) : [];

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
        <PageHeader title="Projects" hideDivider={FEATURES.SHOW_PROJECT_TABS}>
          {FEATURES.SHOW_PROJECT_TABS && (
            <div className="flex items-end justify-between gap-4">
              {/* Left side: Tabs or Filter Indicator (with Crossfade) */}
              <div className="min-w-0 flex-1 min-h-11">
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
              </div>

              {/* Right side: Filter Button (always visible) */}
              <div className="shrink-0">
                <SkillFilterPopover
                  allProjects={allProjectsAndMods}
                  selectedSkills={selectedSkills}
                  onSkillsChange={handleSkillsChange}
                />
              </div>
            </div>
          )}
        </PageHeader>
      }
    >
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
          <>
            {/* Software Tab Panel */}
            {currentTab === "software" && (
              <div
                id={FEATURES.SHOW_PROJECT_TABS ? "panel-software" : undefined}
                role={FEATURES.SHOW_PROJECT_TABS ? "tabpanel" : undefined}
                aria-labelledby={FEATURES.SHOW_PROJECT_TABS ? "tab-software" : undefined}
                tabIndex={FEATURES.SHOW_PROJECT_TABS ? 0 : undefined}
                className="space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {softwareProjects.map((project) => (
                    <ProjectCard key={project.slug} project={project} categoryType="software" />
                  ))}
                </div>
              </div>
            )}

            {/* Games Tab Panel */}
            {FEATURES.SHOW_PROJECT_TABS && currentTab === "games" && (
              <div id="panel-games" role="tabpanel" aria-labelledby="tab-games" tabIndex={0} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {gameProjects.map((project) => (
                    <ProjectCard key={project.slug} project={project} categoryType="games" />
                  ))}
                </div>
              </div>
            )}

            {/* Mods Tab Panel */}
            {FEATURES.SHOW_PROJECT_TABS && currentTab === "mods" && (
              <div id="panel-mods" role="tabpanel" aria-labelledby="tab-mods" tabIndex={0} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {sortedMods.map((mod) => (
                    <ProjectCard key={mod.slug} project={mod} categoryType="mods" />
                  ))}
                </div>
              </div>
            )}
          </>
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
