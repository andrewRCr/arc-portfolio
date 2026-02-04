/**
 * ProjectCard component
 *
 * Displays a project summary card with thumbnail, title, description, category badges, and tech tags.
 * Links to project detail page. Shows visual treatment for in-development projects.
 */

import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/project";
import { TechStackScroller } from "@/components/ui/TechStackScroller";

interface ProjectCardProps {
  project: Project;
  categoryType?: "software" | "games" | "mods";
}

export default function ProjectCard({ project, categoryType = "software" }: ProjectCardProps) {
  const detailUrl = `/projects/${categoryType}/${project.slug}`;

  const hasValidThumbnail = Boolean(project.images.thumbnail);
  const isInDevelopment = project.status === "in-development";

  return (
    <Link
      href={detailUrl}
      data-testid="project-card"
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border transition-[border-color,box-shadow] duration-300 hover:border-secondary-high hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {hasValidThumbnail ? (
          <Image
            src={project.images.thumbnail}
            alt={`${project.title} thumbnail`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-lg font-semibold text-muted-foreground">
            Project Image
          </div>
        )}
        {/* In Development Badge */}
        {isInDevelopment && (
          <span
            data-testid="in-development-badge"
            className="absolute bottom-2 right-2 border border-border bg-background/90 px-2 py-1 font-terminal text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            In Development
          </span>
        )}
      </div>

      {/* Content - flex-1 fills remaining height */}
      <div className="flex flex-1 flex-col bg-surface-background p-4">
        {/* Category/Game Badge (prominent, first) */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {categoryType === "mods" && project.game ? (
            <span
              data-testid="category-badge"
              className="bg-surface-card px-2 py-0.5 font-terminal text-xs font-semibold text-surface-card-foreground"
            >
              {project.game}
            </span>
          ) : (
            project.category.map((cat) => (
              <span
                key={cat}
                data-testid="category-badge"
                className="font-terminal text-xs font-semibold text-foreground"
              >
                [{cat.toLocaleLowerCase()}]
              </span>
            ))
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold leading-relaxed font-title">
          <span className="bg-accent-low px-2 py-0.5 text-accent-low-foreground transition-colors duration-300 box-decoration-clone group-hover:bg-secondary-high group-hover:text-secondary-foreground">
            {project.cardTitle ?? project.title}
          </span>
        </h3>

        {/* Short Description */}
        <p className="mb-3 text-sm text-muted-foreground">{project.shortDescription}</p>

        {/* Tech Stack Tags (secondary) - pushed to bottom with mt-auto */}
        <TechStackScroller techStack={project.techStack} size="sm" scrollable={false} className="mt-auto" />
      </div>
    </Link>
  );
}
