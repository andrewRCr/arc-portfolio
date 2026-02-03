"use client";

/**
 * DetailHeaderDesktop Component
 *
 * Desktop version of the project detail header:
 * - Hero image with back button and title overlaid
 * - Footer section below hero with category badges and icon links
 * - Scroll-based opacity fade coordinated with DetailHeaderCompact
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useHeaderCrossfade, DETAIL_HEADER_ASPECT_RATIO } from "@/hooks/useHeaderCrossfade";
import { ExternalLinksToolbar } from "./ExternalLinksToolbar";
import { ModStatsGroup } from "./ModStatsBadge";
import type { DetailHeaderProps } from "./detail-header.types";

export function DetailHeaderDesktop({
  title,
  categories,
  heroImage,
  backHref,
  backLabel,
  links,
  stats,
  metadata,
}: DetailHeaderProps) {
  const hasCategories = categories && categories.length > 0;
  const hasStats =
    stats && (stats.downloads !== undefined || stats.uniqueDownloads !== undefined || stats.endorsements !== undefined);
  const { opacity } = useHeaderCrossfade("out");
  const hasLinks = Boolean(links?.github || links?.liveDemo || links?.download || links?.nexusmods);

  // Build metadata string - role only shows for team projects
  const isSolo = metadata?.teamSize?.toLowerCase().includes("solo");
  const metadataParts = [
    metadata?.teamSize,
    !isSolo && metadata?.role ? metadata.role : null,
    metadata?.developmentTime,
  ].filter(Boolean);
  const hasMetadata = metadataParts.length > 0;

  const hasFooter = hasCategories || hasStats || hasLinks || hasMetadata;

  const aspectRatioStyle = { aspectRatio: `${DETAIL_HEADER_ASPECT_RATIO}/1` };

  return (
    <div data-testid="detail-header" style={{ opacity }}>
      {/* Hero image with overlaid back button and title */}
      <div className={`relative overflow-hidden ${hasFooter ? "rounded-t-lg" : "rounded-lg"}`} style={aspectRatioStyle}>
        {/* Hero image or fallback background */}
        {heroImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- Native img for background, not content */}
            <img
              data-testid="hero-image"
              src={heroImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Bottom gradient overlay for title readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-card" />
        )}

        {/* Back button + Title - bottom left, connected blocks */}
        <div className="absolute bottom-0 left-0 z-10 flex p-4">
          <Link
            href={backHref}
            aria-label={`Back to ${backLabel}`}
            className="inline-flex items-center justify-center bg-muted/80 px-3 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-accent-high hover:text-accent-high-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="inline-flex items-center bg-secondary-high px-3 font-title text-3xl font-bold text-accent-foreground backdrop-blur-sm">
            {title}
          </h1>
        </div>
      </div>

      {/* Footer: category badges (left) + metadata + icon links (right) */}
      {/* Tighter padding for single row, more room when categories may wrap */}
      {hasFooter && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-card/80 rounded-b-lg">
          {/* Category badges + stats + metadata (left side) */}
          {hasCategories || hasStats || hasMetadata ? (
            <div data-testid="category-badges" className="flex flex-wrap items-center gap-2">
              {hasCategories &&
                categories.map((category) => (
                  <span
                    key={category}
                    className="min-h-6 bg-accent-low px-2 py-0.5 font-terminal text-sm font-semibold text-accent-low-foreground"
                  >
                    {category}
                  </span>
                ))}
              {hasStats && (
                <ModStatsGroup
                  downloads={stats.downloads}
                  uniqueDownloads={stats.uniqueDownloads}
                  endorsements={stats.endorsements}
                />
              )}
              {/* Project metadata - subtle text after badges */}
              {hasMetadata && <span className="ml-2 text-sm text-muted-foreground">{metadataParts.join(" · ")}</span>}
            </div>
          ) : (
            <div /> // Spacer to push content right
          )}

          {/* Icon links - right side, framed box layout */}
          {hasLinks && <ExternalLinksToolbar links={links} variant="desktop" />}
        </div>
      )}
    </div>
  );
}
