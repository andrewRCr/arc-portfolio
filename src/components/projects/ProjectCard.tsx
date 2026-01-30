/**
 * ProjectCard component
 *
 * Displays a project summary card with thumbnail, title, description, category badges, and tech tags.
 * Links to project detail page. Shows visual treatment for in-development projects.
 */

import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  categoryType?: "software" | "games" | "mods";
}

export default function ProjectCard({ project, categoryType = "software" }: ProjectCardProps) {
  const detailUrl = `/projects/${categoryType}/${project.slug}`;

  // Limit tech stack display to first 3 items
  const displayedTechStack = project.techStack.slice(0, 3);
  const remainingCount = project.techStack.length - displayedTechStack.length;

  const hasValidThumbnail = Boolean(project.images.thumbnail);
  const isInDevelopment = project.status === "in-development";

  return (
    <Link
      href={detailUrl}
      data-testid="project-card"
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border-strong transition-[border-color,box-shadow] duration-300 hover:border-secondary/60 hover:shadow-md"
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
            className="absolute bottom-2 right-2 border border-border bg-background/90 px-2 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            In Development
          </span>
        )}
      </div>

      {/* Content - flex-1 fills remaining height */}
      <div className="flex flex-1 flex-col bg-background/80 p-4">
        {/* Category/Game Badge (prominent, first) */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {categoryType === "mods" && project.game ? (
            <span
              data-testid="category-badge"
              className="rounded bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground"
            >
              {project.game}
            </span>
          ) : (
            project.category.map((cat) => (
              <span
                key={cat}
                data-testid="category-badge"
                className="rounded bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground"
              >
                {cat}
              </span>
            ))
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-bold text-foreground">{project.title}</h3>

        {/* Short Description */}
        <p className="mb-3 text-sm text-muted-foreground">{project.shortDescription}</p>

        {/* Tech Stack Tags (secondary) - pushed to bottom with mt-auto */}
        <div className="mt-auto flex flex-wrap gap-1.5">
          {displayedTechStack.map((tech) => (
            <span
              key={tech}
              data-testid="tech-badge"
              className="rounded border border-border bg-muted px-2 py-0.5 text-xs text-foreground"
            >
              {tech}
            </span>
          ))}
          {remainingCount > 0 && (
            <span
              data-testid="tech-overflow-badge"
              className="rounded border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              +{remainingCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
