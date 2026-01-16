"use client";

/**
 * FeaturedSection - Home page featured projects grid
 *
 * Displays 4 project cards with type labels (software, framework, game, mod).
 * Projects are randomized on each page load, one from each category.
 *
 * Note: Section heading ("Featured Projects") is rendered in Hero component
 * to keep it in the fixed header area for scroll shadow alignment.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import { mods } from "@/data/mods";
import type { Project } from "@/types/project";
import { selectFeaturedProjects, type FeaturedProject } from "@/lib/featured-projects";

type ResolvedProject = { project: Project; type: FeaturedProject["type"] };

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

function findProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug) ?? mods.find((m) => m.slug === slug);
}

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

function getRandomizedProjects(): ResolvedProject[] {
  return selectFeaturedProjects()
    .map(resolveSelection)
    .filter((item): item is ResolvedProject => item !== null);
}

export function FeaturedSection() {
  const [featuredProjects, setFeaturedProjects] = useState<ResolvedProject[]>([]);

  useEffect(() => {
    // Client-only: runs once after hydration to avoid SSR mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFeaturedProjects(getRandomizedProjects());
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-4 mt-3">
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
                <>
                  {project.category[0]} mod for {project.game}.{" "}
                </>
              )}
              {project.shortDescription}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
