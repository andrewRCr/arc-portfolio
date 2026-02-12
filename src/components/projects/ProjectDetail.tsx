"use client";

/**
 * ProjectDetail component
 *
 * Displays scrollable project content: tech stack, description, screenshots, key features,
 * implementation details, and optional footer. Header (title, back button, badges, links)
 * is handled by DetailHeader in the page's PageLayout header slot.
 */

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import type { Project, ContentItem } from "@/types/project";
import { ImageGallery } from "./ImageGallery";
import { DetailCard } from "./DetailCard";
import { TextLink } from "@/components/common/TextLink";
import { TechStackScroller } from "@/components/projects/TechStackScroller";
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
 * Handles string items, paragraphs, and category headings.
 */
function normalizeContentItem(item: ContentItem): { text: string; type: "bullet" | "paragraph" | "heading" } {
  if (typeof item === "string") {
    return { text: item, type: "bullet" };
  }
  const type = item.heading ? "heading" : item.paragraph ? "paragraph" : "bullet";
  return { text: item.text, type };
}

/**
 * Renders a mixed list of bullet items and paragraphs with markdown support.
 * Groups consecutive bullet items into semantic <ul>/<li> for accessibility.
 */
function ContentList({ items }: { items: ContentItem[] }) {
  // Group consecutive items by type for semantic rendering
  type GroupType = "bullet" | "paragraph" | "heading";
  const groups: Array<{ type: GroupType; items: Array<{ text: string; key: number }> }> = [];

  items.forEach((item, index) => {
    const { text, type } = normalizeContentItem(item);

    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.type === type) {
      lastGroup.items.push({ text, key: index });
    } else {
      groups.push({ type, items: [{ text, key: index }] });
    }
  });

  return (
    <div>
      {groups.map((group, groupIndex) => {
        const isFirst = groupIndex === 0;
        const prevGroup = groups[groupIndex - 1];

        // Headings and paragraphs both render as <p> tags
        if (group.type === "heading" || group.type === "paragraph") {
          return group.items.map(({ text, key }) => (
            <p key={key} className={`text-muted-foreground ${isFirst ? "" : "mt-4"}`}>
              <InlineMarkdown>{text}</InlineMarkdown>
            </p>
          ));
        }

        // Indent bullets that follow a category heading
        const isNested = prevGroup?.type === "heading";

        return (
          <ul
            key={`group-${groupIndex}`}
            className={cn(
              "space-y-1.5 text-muted-foreground list-['▸_'] list-inside",
              !isFirst && (isNested ? "mt-1.5" : "mt-2"),
              isNested
                ? "ml-4 border-l-2 border-accent-low pl-3"
                : "marker:text-accent-low"
            )}
          >
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

export default function ProjectDetail({ project, footer }: ProjectDetailProps) {
  const isPhone = useIsPhone();

  // Section labels with customization support
  const labels = {
    features: project.sectionLabels?.features ?? "Key Features",
    details: project.sectionLabels?.details ?? "Implementation Details",
  };

  // Split description into paragraphs
  const descriptionParagraphs = project.description.split("\n\n").filter((p) => p.trim());

  // Mobile: no container padding (tech stack aligns with header elements)
  // Desktop: px-2 for visual breathing room from edges
  const containerPadding = isPhone ? "" : "px-2";

  return (
    <div className={`mt-2 mb-1 relative ${containerPadding}`}>
      {/* Tech Stack - aligns with header elements (no extra padding) */}
      <TechStackScroller techStack={project.techStack} size={isPhone ? "sm" : "md"} />

      {/* Description - supports multiple paragraphs and markdown formatting */}
      <div className="mt-4 space-y-4">
        {descriptionParagraphs.map((paragraph, index) => (
          <p key={index} className="text-base sm:text-lg text-foreground">
            <InlineMarkdown>{paragraph}</InlineMarkdown>
          </p>
        ))}
      </div>

      {/* Screenshots Gallery */}
      {project.images.screenshots.length > 0 && (
        <div className="mt-4 sm:mt-6">
          <ImageGallery images={project.images.screenshots} />
        </div>
      )}

      {/* Key Features - technical capabilities inventory */}
      {project.features && project.features.length > 0 && (
        <DetailCard title={labels.features} className="mt-6 sm:mt-8">
          <ContentList items={project.features} />
        </DetailCard>
      )}

      {/* Implementation Details - extended technical deep-dive */}
      {project.details && project.details.length > 0 && (
        <DetailCard title={labels.details} className="mt-6 sm:mt-8">
          <ContentList items={project.details} />
        </DetailCard>
      )}

      {/* Optional page-specific footer content */}
      {footer}
    </div>
  );
}
