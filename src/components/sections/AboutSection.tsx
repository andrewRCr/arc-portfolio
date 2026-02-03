/**
 * AboutSection - Modular component for displaying biographical content
 *
 * Renders bio paragraphs with support for:
 * - Dynamic NexusMods download count via props
 * - TextLink component for the modding profile link
 * - Profile photo with responsive layout
 * - ResponsiveSwitch for card/no-card layouts (phone vs tablet+)
 */
import Image from "next/image";
import { about } from "@/data/about";
import { TextLink } from "@/components/ui/text-link";
import { ResponsiveSwitch } from "@/components/ui/ResponsiveSwitch";

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

/** Photo card with caption footer - shared between layouts */
function PhotoCard() {
  return (
    <div className="overflow-hidden border-2 border-secondary-high">
      <Image src="/profile-photo.webp" alt="Andrew Creekmore, full-stack developer" width={200} height={267} priority />
      <div className="flex items-center justify-center bg-accent-decorative px-2 py-1">
        <span className="py-1 font-terminal text-xs text-accent-decorative-foreground">{"// andrew.jpg"}</span>
      </div>
    </div>
  );
}

/** Bio content - shared between layouts */
function BioContent({ uniqueDownloads }: { uniqueDownloads?: number }) {
  return (
    <>
      <div className="space-y-4 text-foreground">
        {about.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed sm:text-lg">
            {renderParagraphWithPlaceholders(paragraph, uniqueDownloads)}
          </p>
        ))}
      </div>
      {about.tagline && <p className="mt-auto pt-4 text-base leading-relaxed text-muted-foreground">{about.tagline}</p>}
    </>
  );
}

/** Mobile layout - no card wrapper, stacked with breathing room */
function MobileAboutSection({ uniqueDownloads }: { uniqueDownloads?: number }) {
  return (
    <div className="flex flex-col items-center space-y-6">
      <PhotoCard />
      <div className="flex flex-col">
        <BioContent uniqueDownloads={uniqueDownloads} />
      </div>
    </div>
  );
}

/** Desktop layout - two-pane card with different backgrounds */
function DesktopAboutSection({ uniqueDownloads }: { uniqueDownloads?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex flex-col md:flex-row">
        {/* Photo pane - right side on desktop */}
        <div className="order-last flex flex-shrink-0 items-center justify-center bg-card/80 p-6">
          <PhotoCard />
        </div>
        {/* Bio pane - main content area */}
        <div className="flex flex-1 flex-col bg-background/80 p-6">
          <BioContent uniqueDownloads={uniqueDownloads} />
        </div>
      </div>
    </div>
  );
}

export function AboutSection({ uniqueDownloads }: AboutSectionProps) {
  return (
    <section className="px-0 md:px-4">
      <ResponsiveSwitch
        breakpoint="sm"
        mobile={<MobileAboutSection uniqueDownloads={uniqueDownloads} />}
        desktop={<DesktopAboutSection uniqueDownloads={uniqueDownloads} />}
      />
    </section>
  );
}
