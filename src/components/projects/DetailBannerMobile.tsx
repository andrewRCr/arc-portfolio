"use client";

/**
 * DetailBannerMobile Component
 *
 * Mobile-only banner: hero image with category badges and icon links.
 * Sits at top of scrollable content (not in header slot) while
 * DetailHeaderCompact serves as the sticky header.
 *
 * This architecture avoids iOS Safari scroll jank caused by height
 * animations in the header slot during momentum scrolling.
 */

import { DETAIL_HEADER_ASPECT_RATIO } from "@/hooks/useHeaderCrossfade";
import { buildIconLinkItems } from "./utils/buildLinkItems";
import { TouchTarget } from "@/components/ui/TouchTarget";
import { ModStatsGroup } from "./ModStatsBadge";
import type { ProjectLinks } from "@/types/project";
import type { DetailHeaderStats } from "./DetailHeader";

export interface DetailBannerMobileProps {
  /** Category badges displayed in footer */
  categories?: string[];
  /** Path to hero background image (falls back to bg-card if not provided) */
  heroImage?: string;
  /** External project links (rendered as icons) */
  links?: ProjectLinks;
  /** NexusMods stats (optional, for mods) */
  stats?: DetailHeaderStats;
}

export function DetailBannerMobile({ categories, heroImage, links, stats }: DetailBannerMobileProps) {
  const hasCategories = categories && categories.length > 0;
  const hasStats = stats && (stats.uniqueDownloads !== undefined || stats.endorsements !== undefined);
  const iconLinks = buildIconLinkItems(links);
  const hasLinks = iconLinks.length > 0;
  const hasFooter = hasCategories || hasStats || hasLinks;
  const aspectRatioStyle = { aspectRatio: `${DETAIL_HEADER_ASPECT_RATIO}/1` };

  return (
    <div data-testid="hero-banner">
      {/* Hero image */}
      <div className={`relative overflow-hidden ${hasFooter ? "rounded-t-lg" : "rounded-lg"}`} style={aspectRatioStyle}>
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- Native img for background, not content
          <img
            data-testid="hero-image"
            src={heroImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-card" />
        )}
      </div>

      {/* Footer: category badges (left) + icon links (right) */}
      {/* Use tighter padding when single row (0-1 categories), more breathing room when categories may wrap */}
      {hasFooter && (
        <div
          className={`flex items-center justify-between gap-4 px-4 bg-card/80 rounded-b-lg ${
            categories && categories.length > 1 ? "py-2" : "py-1"
          }`}
        >
          {/* Category badges + stats */}
          {hasCategories || hasStats ? (
            <div data-testid="category-badges" className="flex flex-wrap items-center gap-2">
              {hasCategories &&
                categories.map((category) => (
                  <span
                    key={category}
                    className="rounded bg-accent px-2 py-0.5 text-sm font-semibold text-accent-foreground"
                  >
                    {category}
                  </span>
                ))}
              {hasStats && <ModStatsGroup uniqueDownloads={stats.uniqueDownloads} endorsements={stats.endorsements} />}
            </div>
          ) : (
            <div /> // Spacer to push links right
          )}

          {/* Icon links */}
          {hasLinks && (
            <div data-testid="header-links" className="flex items-center">
              {iconLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <TouchTarget key={link.label} align={index === iconLinks.length - 1 ? "end" : "center"}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.ariaLabel}
                      className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                    >
                      <Icon size={18} />
                    </a>
                  </TouchTarget>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
