"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProjectTabs from "@/components/projects/ProjectTabs";
import ProjectCard from "@/components/projects/ProjectCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { projects } from "@/data/projects";
import { mods } from "@/data/mods";
import { FEATURES } from "@/config/features";

/**
 * Check if a project is categorized as a game
 */
function isGameProject(project: { category: string[] }): boolean {
  return project.category.includes("Game");
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const currentTab = FEATURES.SHOW_PROJECT_TABS ? searchParams.get("tab") || "software" : "software";

  // Filter and sort projects
  const allProjects = [...projects].sort((a, b) => a.order - b.order);
  const softwareProjects = allProjects.filter((p) => !isGameProject(p));
  const gameProjects = allProjects.filter((p) => isGameProject(p));
  const sortedMods = FEATURES.SHOW_PROJECT_TABS ? [...mods].sort((a, b) => a.order - b.order) : [];

  return (
    <PageLayout
      header={
        <PageHeader title="Projects" hideDivider={FEATURES.SHOW_PROJECT_TABS}>
          {/* Tab Navigation - only shown when tabs are enabled */}
          {FEATURES.SHOW_PROJECT_TABS && <ProjectTabs />}
        </PageHeader>
      }
    >
      <div className="px-4">
        {/* Software Tab Panel */}
        {currentTab === "software" && (
          <div
            id={FEATURES.SHOW_PROJECT_TABS ? "panel-software" : undefined}
            role={FEATURES.SHOW_PROJECT_TABS ? "tabpanel" : undefined}
            aria-labelledby={FEATURES.SHOW_PROJECT_TABS ? "tab-software" : undefined}
            tabIndex={FEATURES.SHOW_PROJECT_TABS ? 0 : undefined}
            className="space-y-6"
          >
            {/* Software Projects Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {softwareProjects.map((project) => (
                <ProjectCard key={project.id} project={project} categoryType="software" />
              ))}
            </div>
          </div>
        )}

        {/* Games Tab Panel - only rendered when tabs enabled */}
        {FEATURES.SHOW_PROJECT_TABS && currentTab === "games" && (
          <div id="panel-games" role="tabpanel" aria-labelledby="tab-games" tabIndex={0} className="space-y-6">
            {/* Games Projects Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gameProjects.map((project) => (
                <ProjectCard key={project.id} project={project} categoryType="games" />
              ))}
            </div>
          </div>
        )}

        {/* Mods Tab Panel - only rendered when tabs enabled */}
        {FEATURES.SHOW_PROJECT_TABS && currentTab === "mods" && (
          <div id="panel-mods" role="tabpanel" aria-labelledby="tab-mods" tabIndex={0} className="space-y-6">
            {/* Mods Tab Intro */}
            <div className="space-y-3">
              <p className="text-foreground">
                Beyond software development, I maintain a portfolio of game modifications published on NexusMods,
                demonstrating sustained commitment to community-driven projects and technical problem-solving in
                production environments.
              </p>
              <p className="text-muted-foreground">
                These projects showcase skills in reverse engineering, bug triage, community management, and ongoing
                maintenance. With ~35 published mods and thousands of downloads, this work reflects the same
                professional approach I bring to software development: thorough documentation, responsive support, and
                continuous improvement.
              </p>
            </div>

            {/* Mods Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedMods.map((mod) => (
                <ProjectCard key={mod.id} project={mod} categoryType="mods" />
              ))}
            </div>

            {/* Placeholder notice - mods content pending */}
            <div className="rounded-lg border border-border bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">Placeholder entries. Mod content migration pending.</p>
            </div>
          </div>
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
