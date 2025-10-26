"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProjectTabs from "@/components/projects/ProjectTabs";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";
import { mods } from "@/data/mods";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "software";

  // Sort projects and mods by order field
  const sortedProjects = [...projects].sort((a, b) => a.order - b.order);
  const sortedMods = [...mods].sort((a, b) => a.order - b.order);

  return (
    <div className="flex min-h-screen flex-col p-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="font-mono text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Explore my software development work and community contributions.</p>
        </div>

        {/* Tab Navigation */}
        <ProjectTabs />

        {/* Tab Content */}
        <div className="space-y-6 py-4">
          {currentTab === "software" && (
            <>
              {/* Software Tab Intro */}
              <div className="space-y-3">
                <p className="text-foreground">
                  My software portfolio showcases full-stack development expertise across web applications, desktop
                  tools, frameworks, and game projects. Each project demonstrates production-ready code, comprehensive
                  testing, and professional documentation practices.
                </p>
                <p className="text-muted-foreground">
                  Current focus areas include modern web frameworks (React, Next.js, Django), type-safe architectures,
                  AI-assisted development workflows, and scalable system design. Projects range from enterprise-ready
                  platforms to experimental game engines.
                </p>
              </div>

              {/* Software Projects Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} categoryType="software" />
                ))}
              </div>
            </>
          )}

          {currentTab === "mods" && (
            <>
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

              {/* Note about placeholder data */}
              <div className="rounded-lg border border-border bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Note: These are placeholder entries. Real mod data will be migrated in Task 8.0.
                </p>
              </div>
            </>
          )}
        </div>
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
