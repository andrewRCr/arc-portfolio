/**
 * ProjectCard component
 *
 * Displays a project summary card with thumbnail, title, description, category badges, and tech tags.
 * Links to project detail page.
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

  return (
    <Link
      href={detailUrl}
      data-testid="project-card"
      className="group block overflow-hidden rounded-lg border border-border bg-background transition-colors hover:border-secondary/60"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {hasValidThumbnail ? (
          <Image
            src={project.images.thumbnail}
            alt={`${project.title} thumbnail`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-lg font-semibold text-muted-foreground">
            Project Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badges (prominent, first) */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {project.category.map((cat) => (
            <span
              key={cat}
              data-testid="category-badge"
              className="rounded bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-bold text-foreground group-hover:text-accent">{project.title}</h3>

        {/* Short Description */}
        <p className="mb-3 text-sm text-muted-foreground">{project.shortDescription}</p>

        {/* Tech Stack Tags (secondary) */}
        <div className="flex flex-wrap gap-1.5">
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
              data-testid="tech-badge"
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
