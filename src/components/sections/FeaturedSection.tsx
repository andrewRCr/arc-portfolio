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
      {featuredProjects.map(({ project, type }) => {
        const isInDevelopment = project.status === "in-development";

        return (
          <Link
            key={project.slug}
            href={`${getProjectPath(type)}/${project.slug}?from=home`}
            className="group flex flex-col border border-border rounded-sm hover:border-secondary-high transition-[border-color,box-shadow] duration-300 hover:shadow-md overflow-hidden"
          >
            <div className="p-4 pb-2 bg-card/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-terminal text-foreground">[{type}]</span>
                {isInDevelopment && (
                  <span
                    data-testid="in-development-badge"
                    className="border border-border bg-muted/80 px-1.5 py-0.5 font-terminal text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    In Dev
                  </span>
                )}
              </div>
              <h4 className="font-semibold font-title">
                <span className="bg-accent-low px-1.5 py-0.5 text-accent-low-foreground transition-colors duration-300 box-decoration-clone group-hover:bg-secondary-high group-hover:text-secondary-foreground">
                  {project.title}
                </span>
              </h4>
            </div>
            <div className="flex-1 min-h-24 px-4 py-3 bg-background/80">
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
        );
      })}
    </div>
  );
}
