/**
 * ProjectDetail component
 *
 * Displays comprehensive project information including description, features, tech stack,
 * metadata, external links, and a back button that preserves tab state.
 */

"use client";

import { useRouter } from "next/navigation";
import type { Project } from "@/types/project";

interface ProjectDetailProps {
  project: Project;
  currentTab?: "software" | "mods";
}

export default function ProjectDetail({ project, currentTab = "software" }: ProjectDetailProps) {
  const router = useRouter();

  const handleBackClick = () => {
    router.push(`/projects?tab=${currentTab}`);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
        aria-label={`Back to ${currentTab} projects`}
      >
        ← Back to Projects
      </button>

      {/* Project Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {project.category.map((cat) => (
            <span key={cat} className="rounded bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
              {cat}
            </span>
          ))}
        </div>

        <h1 className="font-mono text-4xl font-bold text-foreground">{project.title}</h1>

        <p className="text-lg text-foreground">{project.description}</p>
      </div>

      {/* External Links */}
      {(project.links.github || project.links.liveDemo || project.links.download || project.links.external) && (
        <div className="flex flex-wrap gap-3">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
              aria-label="View project on GitHub"
            >
              GitHub →
            </a>
          )}
          {project.links.liveDemo && (
            <a
              href={project.links.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
              aria-label="View live demo"
            >
              Live Demo →
            </a>
          )}
          {project.links.download && (
            <a
              href={project.links.download}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
              aria-label="Download project"
            >
              Download →
            </a>
          )}
          {project.links.external && (
            <a
              href={project.links.external}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
              aria-label="View on NexusMods"
            >
              View on NexusMods →
            </a>
          )}
        </div>
      )}

      {/* Tech Stack */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span key={tech} className="rounded border border-border bg-muted px-3 py-1 text-sm text-foreground">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">Key Features</h2>
        <ul className="space-y-2">
          {project.features.map((feature, index) => (
            <li key={index} className="text-muted-foreground">
              • {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Optional Metadata */}
      {(project.teamSize || project.duration || project.role || project.developmentTime) && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Project Details</h2>
          <div className="grid gap-2 text-sm">
            {project.teamSize && (
              <div>
                <span className="font-semibold text-foreground">Team: </span>
                <span className="text-muted-foreground">{project.teamSize}</span>
              </div>
            )}
            {project.duration && (
              <div>
                <span className="font-semibold text-foreground">Duration: </span>
                <span className="text-muted-foreground">{project.duration}</span>
              </div>
            )}
            {project.role && (
              <div>
                <span className="font-semibold text-foreground">Role: </span>
                <span className="text-muted-foreground">{project.role}</span>
              </div>
            )}
            {project.developmentTime && (
              <div>
                <span className="font-semibold text-foreground">Timeline: </span>
                <span className="text-muted-foreground">{project.developmentTime}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Highlights */}
      {project.highlights && project.highlights.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Highlights</h2>
          <ul className="space-y-2">
            {project.highlights.map((highlight, index) => (
              <li key={index} className="text-muted-foreground">
                • {highlight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Architecture Notes */}
      {project.architectureNotes && project.architectureNotes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Architecture</h2>
          <ul className="space-y-2">
            {project.architectureNotes.map((note, index) => (
              <li key={index} className="text-muted-foreground">
                • {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
