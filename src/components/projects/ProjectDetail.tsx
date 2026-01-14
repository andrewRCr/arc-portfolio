"use client";

/**
 * ProjectDetail component
 *
 * Displays scrollable project content: tech stack, description, screenshots, features,
 * metadata, and optional sections. Header (title, back button, badges, links) is handled
 * by DetailHeader in the page's PageLayout header slot.
 */

import type { Project } from "@/types/project";
import { ImageGallery } from "./ImageGallery";
import { DetailCard } from "./DetailCard";

interface ProjectDetailProps {
  project: Project;
}

/** Renders a bulleted list of string items */
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="text-muted-foreground">
          • {item}
        </li>
      ))}
    </ul>
  );
}

/** Renders a label: value metadata row */
function MetadataRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <span className="font-semibold text-foreground">{label}: </span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  // Build metadata rows from available fields
  const metadataFields = [
    { label: "Team", value: project.teamSize },
    { label: "Duration", value: project.duration },
    { label: "Role", value: project.role },
    { label: "Timeline", value: project.developmentTime },
  ];
  const hasMetadata = metadataFields.some((field) => field.value);

  return (
    <div className="px-2 mt-3 mb-1 relative">
      {/* Tech Stack - tight to header */}
      <div className="flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span key={tech} className="rounded border border-border bg-muted px-3 py-1 text-sm text-foreground">
            {tech}
          </span>
        ))}
      </div>

      {/* Description - tighter spacing (mt-6), smaller on mobile */}
      <p className="mt-6 text-base sm:text-lg text-foreground">{project.description}</p>

      {/* Screenshots Gallery - tighter spacing from description */}
      {project.images.screenshots.length > 0 && (
        <div className="mt-6">
          <ImageGallery images={project.images.screenshots} />
        </div>
      )}

      {/* Features */}
      <DetailCard title="Key Features" className="mt-8">
        <BulletList items={project.features} />
      </DetailCard>

      {/* Optional Metadata */}
      {hasMetadata && (
        <DetailCard title="Project Details" className="mt-8">
          <div className="grid gap-2 text-sm">
            {metadataFields.map((field) => (
              <MetadataRow key={field.label} label={field.label} value={field.value} />
            ))}
          </div>
        </DetailCard>
      )}

      {/* Highlights */}
      {project.highlights && project.highlights.length > 0 && (
        <DetailCard title="Highlights" className="mt-8">
          <BulletList items={project.highlights} />
        </DetailCard>
      )}

      {/* Architecture Notes */}
      {project.architectureNotes && project.architectureNotes.length > 0 && (
        <DetailCard title="Architecture" className="mt-8">
          <BulletList items={project.architectureNotes} />
        </DetailCard>
      )}
    </div>
  );
}
