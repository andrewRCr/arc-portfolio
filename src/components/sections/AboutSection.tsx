/**
 * AboutSection - Modular component for displaying biographical content
 *
 * Renders bio paragraphs with support for:
 * - Basic markdown links [text](url)
 * - Dynamic NexusMods download count via props
 * - TextLink component for the modding profile link
 */

import React from "react";
import { about } from "@/data/about";
import { TextLink } from "@/components/ui/text-link";

interface AboutSectionProps {
  /** Dynamic unique download count from NexusMods API (optional) */
  uniqueDownloads?: number;
}

/** NexusMods profile URL */
export const NEXUSMODS_PROFILE_URL = "https://next.nexusmods.com/profile/andrewRCr/mods";

/** Static fallback text when API is unavailable (includes "over" prefix) */
const FALLBACK_DOWNLOAD_TEXT = "over 300 thousand";

/**
 * Format download count for natural prose display
 * e.g., 345678 → "345,678"
 */
function formatDownloadCountForProse(count: number): string {
  return new Intl.NumberFormat("en-US").format(count);
}

/**
 * Simple markdown link parser
 * Converts [text](url) to <a> elements with external link attributes
 */
function parseMarkdownLinks(text: string): React.ReactElement[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactElement[] = [];
  let lastIndex = 0;
  let match;
  let keyIndex = 0;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${keyIndex++}`}>{text.substring(lastIndex, match.index)}</span>);
    }

    // Add the link
    const linkText = match[1];
    const url = match[2];
    parts.push(
      <a
        key={`link-${keyIndex++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:text-accent/80 underline"
      >
        {linkText}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last link
  if (lastIndex < text.length) {
    parts.push(<span key={`text-${keyIndex++}`}>{text.substring(lastIndex)}</span>);
  }

  return parts;
}

/**
 * Render paragraph with placeholder substitution
 * Handles {{MODDING_LINK}} and {{DOWNLOAD_COUNT}} placeholders
 */
function renderParagraphWithPlaceholders(paragraph: string, uniqueDownloads?: number): React.ReactElement[] {
  // If no placeholders, use standard markdown parsing
  if (!paragraph.includes("{{")) {
    return parseMarkdownLinks(paragraph);
  }

  const parts: React.ReactElement[] = [];
  let keyIndex = 0;

  // Split by placeholders, keeping delimiters
  const segments = paragraph.split(/(\{\{[A-Z_]+\}\})/);

  for (const segment of segments) {
    if (segment === "{{MODDING_LINK}}") {
      parts.push(
        <TextLink key={`link-${keyIndex++}`} href={NEXUSMODS_PROFILE_URL}>
          modding work
        </TextLink>
      );
    } else if (segment === "{{DOWNLOAD_COUNT}}") {
      // Use formatted count if available, otherwise fallback with "over" prefix
      if (uniqueDownloads !== undefined) {
        // Real value: style as inline code for emphasis
        parts.push(
          <code key={`count-${keyIndex++}`} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">
            {formatDownloadCountForProse(uniqueDownloads)}
          </code>
        );
      } else {
        // Fallback: plain text
        parts.push(<span key={`count-${keyIndex++}`}>{FALLBACK_DOWNLOAD_TEXT}</span>);
      }
    } else if (segment) {
      // Regular text - check for any remaining markdown links
      parts.push(
        ...parseMarkdownLinks(segment).map((el, i) => React.cloneElement(el, { key: `text-${keyIndex++}-${i}` }))
      );
    }
  }

  return parts;
}

export function AboutSection({ uniqueDownloads }: AboutSectionProps) {
  return (
    <section className="px-0 md:px-4 py-2">
      <div className="rounded-lg border border-border p-6">
        <div className="space-y-4 text-foreground">
          {about.paragraphs.map((paragraph, index) => (
            <p key={index} className="leading-relaxed">
              {renderParagraphWithPlaceholders(paragraph, uniqueDownloads)}
            </p>
          ))}
        </div>
      </div>

      {about.highlightedAchievements && about.highlightedAchievements.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {about.highlightedAchievements.map((achievement) => (
            <div key={achievement.label} className="rounded-lg border border-border p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{achievement.value}</p>
              <p className="text-sm text-muted-foreground">{achievement.label}</p>
              {achievement.link && (
                <a
                  href={achievement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-accent hover:text-accent/80 underline"
                >
                  View →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
