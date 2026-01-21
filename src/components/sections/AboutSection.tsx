/**
 * AboutSection - Modular component for displaying biographical content
 *
 * Renders bio paragraphs with support for:
 * - Dynamic NexusMods download count via props
 * - TextLink component for the modding profile link
 * - Profile photo with responsive layout
 */
import Image from "next/image";
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
 * Render paragraph with placeholder substitution
 * Handles {{MODDING_LINK}} and {{DOWNLOAD_COUNT}} placeholders
 */
function renderParagraphWithPlaceholders(paragraph: string, uniqueDownloads?: number): React.ReactNode {
  // If no placeholders, render as plain text
  if (!paragraph.includes("{{")) {
    return paragraph;
  }

  const parts: React.ReactNode[] = [];
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
          <code key={`count-${keyIndex++}`} className="bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">
            {formatDownloadCountForProse(uniqueDownloads)}
          </code>
        );
      } else {
        // Fallback: plain text
        parts.push(<span key={`count-${keyIndex++}`}>{FALLBACK_DOWNLOAD_TEXT}</span>);
      }
    } else if (segment) {
      // Regular text
      parts.push(<span key={`text-${keyIndex++}`}>{segment}</span>);
    }
  }

  return parts;
}

export function AboutSection({ uniqueDownloads }: AboutSectionProps) {
  return (
    <section className="px-0 md:px-4 py-2">
      {/* Two-pane card: vertical split with different backgrounds */}
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex flex-col md:flex-row">
          {/* Photo pane - appears first on mobile, right on desktop */}
          <div className="order-first flex flex-shrink-0 items-center justify-center bg-card/80 p-4 md:order-last md:p-6">
            {/* Photo card with caption footer */}
            <div className="overflow-hidden border-2 border-secondary/80">
              <Image
                src="/profile-photo.webp"
                alt="Andrew Creekmore, full-stack developer"
                width={200}
                height={267}
                priority
              />
              <div className="flex items-center justify-center bg-accent/80 px-2 py-1">
                <span className="py-1 font-mono text-xs text-accent-foreground">{"// andrew.jpg"}</span>
              </div>
            </div>
          </div>

          {/* Bio pane - main content area */}
          <div className="flex flex-1 flex-col bg-background/80 p-6">
            <div className="space-y-4 text-foreground">
              {about.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed sm:text-lg">
                  {renderParagraphWithPlaceholders(paragraph, uniqueDownloads)}
                </p>
              ))}
            </div>
            {about.tagline && (
              <p className="mt-auto pt-4 text-base leading-relaxed text-muted-foreground">{about.tagline}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
