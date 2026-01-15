"use client";

/**
 * ProjectDetail component
 *
 * Displays scrollable project content: tech stack, description, screenshots, features,
 * metadata, and optional sections. Header (title, back button, badges, links) is handled
 * by DetailHeader in the page's PageLayout header slot.
 */

import ReactMarkdown from "react-markdown";
import type { Project, ContentItem } from "@/types/project";
import { ImageGallery } from "./ImageGallery";
import { DetailCard } from "./DetailCard";

interface ProjectDetailProps {
  project: Project;
}

/**
 * Renders inline markdown (bold, italic, links, code) with consistent styling.
 * Used for descriptions and content items.
 */
function InlineMarkdown({ children, className }: { children: string; className?: string }) {
  return (
    <ReactMarkdown
      components={{
        // Render as span to avoid block-level elements inside p tags
        p: ({ children }) => <span className={className}>{children}</span>,
        strong: ({ children }) => <strong>{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        code: ({ children }) => (
          <code className="rounded bg-muted px-1 py-0.5 text-sm font-mono">{children}</code>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:text-accent/80"
          >
            {children}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

/**
 * Normalizes content items to a consistent format.
 * Handles both string items and typed { text, paragraph } objects.
 * Also handles legacy [p] prefix for backwards compatibility.
 */
function normalizeContentItem(item: ContentItem): { text: string; isParagraph: boolean } {
  if (typeof item === "string") {
    // Legacy [p] prefix support
    if (item.startsWith("[p]")) {
      return { text: item.slice(3), isParagraph: true };
    }
    return { text: item, isParagraph: false };
  }
  return { text: item.text, isParagraph: item.paragraph ?? false };
}

/**
 * Renders a mixed list of bullet items and paragraphs with markdown support.
 */
function ContentList({ items }: { items: ContentItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const { text, isParagraph } = normalizeContentItem(item);

        if (isParagraph) {
          return (
            <p key={index} className="text-muted-foreground">
              <InlineMarkdown>{text}</InlineMarkdown>
            </p>
          );
        }

        return (
          <p key={index} className="text-muted-foreground">
            • <InlineMarkdown>{text}</InlineMarkdown>
          </p>
        );
      })}
    </div>
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

  // Section labels with customization support
  const labels = {
    features: project.sectionLabels?.features ?? "Key Features",
    highlights: project.sectionLabels?.highlights ?? "Highlights",
    architectureNotes: project.sectionLabels?.architectureNotes ?? "Architecture",
  };

  // Split description into paragraphs
  const descriptionParagraphs = project.description.split("\n\n").filter((p) => p.trim());

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

      {/* Description - supports multiple paragraphs and markdown formatting */}
      <div className="mt-6 space-y-4">
        {descriptionParagraphs.map((paragraph, index) => (
          <p key={index} className="text-base sm:text-lg text-foreground">
            <InlineMarkdown>{paragraph}</InlineMarkdown>
          </p>
        ))}
      </div>

      {/* Screenshots Gallery - tighter spacing from description */}
      {project.images.screenshots.length > 0 && (
        <div className="mt-6">
          <ImageGallery images={project.images.screenshots} />
        </div>
      )}

      {/* Features */}
      <DetailCard title={labels.features} className="mt-8">
        <ContentList items={project.features} />
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
        <DetailCard title={labels.highlights} className="mt-8">
          <ContentList items={project.highlights} />
        </DetailCard>
      )}

      {/* Architecture Notes */}
      {project.architectureNotes && project.architectureNotes.length > 0 && (
        <DetailCard title={labels.architectureNotes} className="mt-8">
          <ContentList items={project.architectureNotes} />
        </DetailCard>
      )}

      {/* More Information - links to external page (e.g., NexusMods) */}
      {project.links.external && (
        <DetailCard title="More Information" className="mt-8">
          <p className="text-muted-foreground">
            For compatibility details, installation instructions, and additional information, visit the{" "}
            <a
              href={project.links.external}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-accent/80"
            >
              NexusMods page
            </a>
            .
          </p>
        </DetailCard>
      )}
    </div>
  );
}
