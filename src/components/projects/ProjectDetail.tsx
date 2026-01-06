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
  from?: string;
}

interface ExternalLinkProps {
  href: string;
  label: string;
  ariaLabel: string;
}

function ExternalLink({ href, label, ariaLabel }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-secondary/60 hover:text-secondary"
      aria-label={ariaLabel}
    >
      {label} →
    </a>
  );
}

export default function ProjectDetail({ project, currentTab = "software", from }: ProjectDetailProps) {
  const router = useRouter();

  const getBackDestination = () => {
    if (from === "home") {
      return { href: "/", label: "Home" };
    }
    return { href: `/projects?tab=${currentTab}`, label: "Projects" };
  };

  const backDest = getBackDestination();

  const handleBackClick = () => {
    router.push(backDest.href);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-0 md:px-4">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
        aria-label={`Back to ${backDest.label}`}
      >
        ← Back to {backDest.label}
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
      {(() => {
        const linkDescriptors = [
          { href: project.links.github, label: "GitHub", ariaLabel: "View project on GitHub" },
          { href: project.links.liveDemo, label: "Live Demo", ariaLabel: "View live demo" },
          { href: project.links.download, label: "Download", ariaLabel: "Download project" },
          { href: project.links.external, label: "View on NexusMods", ariaLabel: "View on NexusMods" },
        ].filter((link): link is ExternalLinkProps => Boolean(link.href));

        return linkDescriptors.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {linkDescriptors.map((link) => (
              <ExternalLink key={link.label} {...link} />
            ))}
          </div>
        ) : null;
      })()}

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
