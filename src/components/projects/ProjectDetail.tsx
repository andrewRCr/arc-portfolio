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
import { TextLink } from "@/components/ui/text-link";
import { useIsPhone } from "@/hooks/useMediaQuery";

interface ProjectDetailProps {
  project: Project;
  /** Optional footer content for page-specific sections */
  footer?: React.ReactNode;
}

/**
 * Renders inline markdown (bold, italic, links, code) with consistent styling.
 * Used for descriptions and content items.
 */
function InlineMarkdown({ children, className }: { children: string; className?: string }) {
  return (
    <ReactMarkdown
      allowedElements={["p", "strong", "em", "code", "a", "span"]}
      unwrapDisallowed={true}
      components={{
        // Render as span to avoid block-level elements inside p tags
        p: ({ children }) => <span className={className}>{children}</span>,
        strong: ({ children }) => <strong>{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        code: ({ children }) => <code className="rounded bg-muted px-1 py-0.5 text-sm font-mono">{children}</code>,
        a: ({ href, children }) => <TextLink href={href || "#"}>{children}</TextLink>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

/**
 * Normalizes content items to a consistent format.
 * Handles both string items and typed { text, paragraph } objects.
 */
function normalizeContentItem(item: ContentItem): { text: string; isParagraph: boolean } {
  if (typeof item === "string") {
    return { text: item, isParagraph: false };
  }
  return { text: item.text, isParagraph: item.paragraph ?? false };
}

/**
 * Renders a mixed list of bullet items and paragraphs with markdown support.
 * Groups consecutive bullet items into semantic <ul>/<li> for accessibility.
 */
function ContentList({ items }: { items: ContentItem[] }) {
  // Group consecutive items by type for semantic rendering
  const groups: Array<{ type: "bullets" | "paragraph"; items: Array<{ text: string; key: number }> }> = [];

  items.forEach((item, index) => {
    const { text, isParagraph } = normalizeContentItem(item);
    const type = isParagraph ? "paragraph" : "bullets";

    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.type === type) {
      lastGroup.items.push({ text, key: index });
    } else {
      groups.push({ type, items: [{ text, key: index }] });
    }
  });

  return (
    <div className="space-y-2">
      {groups.map((group, groupIndex) => {
        if (group.type === "paragraph") {
          return group.items.map(({ text, key }) => (
            <p key={key} className="text-muted-foreground">
              <InlineMarkdown>{text}</InlineMarkdown>
            </p>
          ));
        }

        return (
          <ul key={`group-${groupIndex}`} className="space-y-1 list-disc list-inside text-muted-foreground">
            {group.items.map(({ text, key }) => (
              <li key={key}>
                <InlineMarkdown>{text}</InlineMarkdown>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

/** Renders inline project metadata (team, role, timeline) as subtle text */
function ProjectMetadata({ project }: { project: Project }) {
  // Only show role for team projects (not solo) - "Developer" is obvious for solo work
  const isSolo = project.teamSize?.toLowerCase().includes("solo");
  const showRole = !isSolo && project.role;

  const parts = [project.teamSize, showRole ? project.role : null, project.developmentTime].filter(Boolean);
  if (parts.length === 0) return null;

  return <p className="mt-4 text-sm italic text-muted-foreground">{parts.join(" · ")}</p>;
}

export default function ProjectDetail({ project, footer }: ProjectDetailProps) {
  const isPhone = useIsPhone();
  // Smaller tech stack badges on phone for visual hierarchy
  const techBadgeTextSize = isPhone ? "text-xs" : "text-sm";

  // Section labels with customization support
  const labels = {
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
          <span
            key={tech}
            className={`rounded border border-border bg-muted px-3 py-1 ${techBadgeTextSize} text-foreground`}
          >
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

      {/* Inline metadata - subtle text below description */}
      <ProjectMetadata project={project} />

      {/* Screenshots Gallery */}
      {project.images.screenshots.length > 0 && (
        <div className="mt-6">
          <ImageGallery images={project.images.screenshots} />
        </div>
      )}

      {/* Highlights - primary content section (merged from features + highlights) */}
      {project.highlights && project.highlights.length > 0 && (
        <DetailCard title={labels.highlights} className="mt-8">
          <ContentList items={project.highlights} />
        </DetailCard>
      )}

      {/* Architecture Notes - optional technical deep-dive */}
      {project.architectureNotes && project.architectureNotes.length > 0 && (
        <DetailCard title={labels.architectureNotes} className="mt-8">
          <ContentList items={project.architectureNotes} />
        </DetailCard>
      )}

      {/* Optional page-specific footer content */}
      {footer}
    </div>
  );
}
