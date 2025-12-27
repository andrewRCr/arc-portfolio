"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProjectTabs from "@/components/projects/ProjectTabs";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";
import { mods } from "@/data/mods";
import { FEATURES } from "@/config/features";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const currentTab = FEATURES.SHOW_MODS_TAB ? searchParams.get("tab") || "software" : "software";

  // Sort projects and mods by order field
  const sortedProjects = [...projects].sort((a, b) => a.order - b.order);
  const sortedMods = FEATURES.SHOW_MODS_TAB ? [...mods].sort((a, b) => a.order - b.order) : [];

  return (
    <div className="flex min-h-screen flex-col p-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="font-mono text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">
            {FEATURES.SHOW_MODS_TAB
              ? "Explore my software development work and community contributions."
              : "Explore my software development work."}
          </p>
        </div>

        {/* Tab Navigation - only shown when mods tab is enabled */}
        {FEATURES.SHOW_MODS_TAB && <ProjectTabs />}

        {/* Tab Panels */}
        {currentTab === "software" && (
          <div
            id="panel-software"
            role="tabpanel"
            aria-labelledby="tab-software"
            tabIndex={0}
            className="space-y-6 py-4"
          >
            {/* TODO: Replace placeholder intro text */}
            <p className="text-muted-foreground italic">
              [Placeholder] Brief intro about software projects and focus areas.
            </p>

            {/* Software Projects Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} categoryType="software" />
              ))}
            </div>
          </div>
        )}

        {currentTab === "mods" && (
          <div id="panel-mods" role="tabpanel" aria-labelledby="tab-mods" tabIndex={0} className="space-y-6 py-4">
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

            {/* Placeholder Mods Grid */}
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
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
