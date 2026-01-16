"use client";

/**
 * FeaturedSection - Home page featured projects with randomized selection
 *
 * Displays 4 featured project cards with type labels (software, framework, game, mod).
 * Projects are randomized on each page load, one from each category.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import { mods } from "@/data/mods";
import type { Project } from "@/types/project";
import { selectFeaturedProjects, type FeaturedProject } from "@/lib/featured-projects";

type ResolvedProject = { project: Project; type: FeaturedProject["type"] };

/**
 * Get the URL path prefix for a project type
 */
function getProjectPath(type: FeaturedProject["type"]): string {
  switch (type) {
    case "software":
    case "framework":
      return "/projects/software";
    case "game":
      return "/projects/games";
    case "mod":
      return "/projects/mods";
  }
}

/**
 * Look up full project data by slug from projects or mods arrays
 */
function findProjectBySlug(slug: string): Project | undefined {
  const project = projects.find((p) => p.slug === slug);
  if (project) return project;
  return mods.find((m) => m.slug === slug);
}

/**
 * Resolve selection to full project data
 */
function resolveSelection(selection: FeaturedProject): ResolvedProject | null {
  const project = findProjectBySlug(selection.slug);
  if (!project) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Featured project slug "${selection.slug}" not found`);
    }
    return null;
  }
  return { project, type: selection.type };
}

/**
 * Compute randomized selection and resolve to full project data
 */
function getRandomizedProjects(): ResolvedProject[] {
  return selectFeaturedProjects()
    .map(resolveSelection)
    .filter((item): item is ResolvedProject => item !== null);
}

export function FeaturedSection() {
  const [featuredProjects, setFeaturedProjects] = useState<ResolvedProject[]>([]);

  useEffect(() => {
    // Client-only initialization - empty deps runs once after hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFeaturedProjects(getRandomizedProjects());
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-mono text-muted-foreground">Featured Projects</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {featuredProjects.map(({ project, type }) => (
          <Link
            key={project.slug}
            href={`${getProjectPath(type)}/${project.slug}?from=home`}
            className="flex flex-col border border-border rounded-sm hover:border-secondary/80 transition-colors overflow-hidden"
          >
            <div className="p-4 pb-2 bg-card/80">
              <p className="text-xs font-mono text-primary mb-1">[{type}]</p>
              <h4 className="font-semibold">{project.title}</h4>
            </div>
            <div className="flex-1 px-4 py-3 bg-background/80">
              <p className="text-sm text-muted-foreground">
                {type === "mod" && project.game && (
                  <>{project.category[0]} mod for {project.game}. </>
                )}
                {project.shortDescription}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
