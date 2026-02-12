"use client";

/**
 * DetailBannerMobile Component
 *
 * Mobile-only banner: hero image with category badges, stats, and links.
 *
 * Sits at top of scrollable content (not in header slot) while
 * DetailHeaderCompact serves as the sticky header.
 *
 * This architecture avoids iOS Safari scroll jank caused by height
 * animations in the header slot during momentum scrolling.
 */

import Image from "next/image";
import { DETAIL_HEADER_ASPECT_RATIO } from "@/hooks/useHeaderCrossfade";
import { useIsPhone } from "@/hooks/useMediaQuery";
import { getBlurDataURL } from "@/lib/blur-placeholders";
import { ModStatsInline } from "./ModStatsBadge";
import { ExternalLinksToolbar } from "./ExternalLinksToolbar";
import type { ProjectLinks } from "@/types/project";
import { InDevelopmentBadge } from "./InDevelopmentBadge";
import type { DetailHeaderStats, DetailHeaderMetadata } from "./detail-header.types";

export interface DetailBannerMobileProps {
  /** Category badges displayed in footer */
  categories?: string[];
  /** Path to hero background image (falls back to bg-card if not provided) */
  heroImage?: string;
  /** External project links */
  links?: ProjectLinks;
  /** NexusMods stats (optional, for mods) */
  stats?: DetailHeaderStats;
  /** Project metadata (team role, timeline) */
  metadata?: DetailHeaderMetadata;
  /** Project development status — shows badge when "in-development" */
  status?: "released" | "in-development";
}

export function DetailBannerMobile({ categories, heroImage, links, stats, metadata, status }: DetailBannerMobileProps) {
  const isPhone = useIsPhone();
  const isInDevelopment = status === "in-development";
  const hasCategories = categories && categories.length > 0;
  const hasStats =
    stats && (stats.downloads !== undefined || stats.uniqueDownloads !== undefined || stats.endorsements !== undefined);
  const hasLinks = Boolean(links?.github || links?.liveDemo || links?.download || links?.nexusmods);
  const aspectRatioStyle = { aspectRatio: `${DETAIL_HEADER_ASPECT_RATIO}/1` };

  // Smaller badges on phone for better visual hierarchy
  const badgeTextSize = isPhone ? "text-xs" : "text-sm";

  // Format metadata for links toolbar label
  // Uses compact versions for mobile, falls back to full versions
  const formatMetadataLabel = (): string | undefined => {
    if (!metadata) return undefined;
    const teamRole = metadata.teamRoleCompact || metadata.teamRole || "Solo";
    const devTime = metadata.developmentTimeCompact || metadata.developmentTime;
    const parts = [teamRole, devTime].filter(Boolean);
    return parts.length > 0 ? parts.join(" · ") : undefined;
  };
  const metadataLabel = formatMetadataLabel();

  // Stats go in toolbar label for mods (they have stats but no metadata)
  // Metadata goes in toolbar label for regular projects
  const statsLabelContent = hasStats ? (
    <ModStatsInline
      downloads={stats.downloads}
      uniqueDownloads={stats.uniqueDownloads}
      endorsements={stats.endorsements}
    />
  ) : undefined;

  return (
    <div data-testid="hero-banner">
      {/* Hero image - standalone, fully rounded */}
      <div className="relative overflow-hidden rounded-lg" style={aspectRatioStyle}>
        {heroImage ? (
          <Image
            data-testid="hero-image"
            src={heroImage}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 1200px) 1136px, calc(100vw - 16px)"
            className="object-cover"
            placeholder={getBlurDataURL(heroImage) ? "blur" : undefined}
            blurDataURL={getBlurDataURL(heroImage)}
          />
        ) : (
          <div className="absolute inset-0 bg-card" />
        )}
        {/* In Development Badge - overlaid bottom right */}
        {isInDevelopment && <InDevelopmentBadge compact className="absolute bottom-2 right-2" />}
      </div>

      {/* Category badges row - below hero */}
      {hasCategories && (
        <div data-testid="category-badges" className="flex flex-wrap items-center gap-2 pt-2">
          {categories.map((category) => (
            <span
              key={category}
              className={`bg-accent-low px-2 py-0.5 font-terminal ${badgeTextSize} font-semibold text-accent-low-foreground`}
            >
              {category}
            </span>
          ))}
        </div>
      )}

      {/* Links toolbar - matches compact header width (edge to edge) */}
      {/* Label shows: stats (mods) OR metadata (regular projects) OR "Links" (default) */}
      {/* Max 2 links on mobile - tertiary links (download) available via GitHub */}
      {hasLinks && (
        <div className="pt-2">
          <ExternalLinksToolbar
            links={links}
            variant="touch"
            fullWidth
            label={metadataLabel}
            labelContent={statsLabelContent}
            maxLinks={2}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
