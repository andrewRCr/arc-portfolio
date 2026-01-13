/**
 * ProjectDetail component
 *
 * Displays scrollable project content: description, screenshots, features, tech stack,
 * metadata, and external links. Header (title, back button, badges) is handled by
 * DetailHeader in the page's PageLayout header slot.
 */

import type { Project } from "@/types/project";
import { ImageGallery } from "./ImageGallery";

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="space-y-8 px-2">
      {/* Description */}
      <p className="text-lg text-foreground">{project.description}</p>

      {/* Screenshots Gallery */}
      {project.images.screenshots.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Screenshots</h2>
          <ImageGallery images={project.images.screenshots} />
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

/**
 * Helper to compute back destination based on navigation context.
 * Used by page components to configure DetailHeader.
 */
export function getBackDestination(from?: string, currentTab: "software" | "mods" = "software") {
  if (from === "home") {
    return { href: "/", label: "Home" };
  }
  return { href: `/projects?tab=${currentTab}`, label: "Projects" };
}
