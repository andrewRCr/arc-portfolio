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

function ProjectsContent() {
  const searchParams = useSearchParams();
  const validTabs = ["software", "games", "mods"] as const;
  const tabParam = searchParams.get("tab");
  const currentTab =
    FEATURES.SHOW_PROJECT_TABS && tabParam && validTabs.includes(tabParam as (typeof validTabs)[number])
      ? (tabParam as (typeof validTabs)[number])
      : "software";

  // Filter and sort projects by projectType
  const allProjects = [...projects].sort((a, b) => a.order - b.order);
  const softwareProjects = allProjects.filter((p) => p.projectType === "software");
  const gameProjects = allProjects.filter((p) => p.projectType === "game");
  const sortedMods = FEATURES.SHOW_PROJECT_TABS ? [...mods].sort((a, b) => a.order - b.order) : [];

  return (
    <PageLayout
      pageId="projects"
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
                <ProjectCard key={project.slug} project={project} categoryType="software" />
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
                <ProjectCard key={project.slug} project={project} categoryType="games" />
              ))}
            </div>
          </div>
        )}

        {/* Mods Tab Panel - only rendered when tabs enabled */}
        {FEATURES.SHOW_PROJECT_TABS && currentTab === "mods" && (
          <div id="panel-mods" role="tabpanel" aria-labelledby="tab-mods" tabIndex={0} className="space-y-6">
            {/* Mods Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedMods.map((mod) => (
                <ProjectCard key={mod.slug} project={mod} categoryType="mods" />
              ))}
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
