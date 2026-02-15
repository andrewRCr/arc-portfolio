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
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useHeaderCrossfade, DETAIL_HEADER_ASPECT_RATIO } from "@/hooks/useHeaderCrossfade";
import { useBackDestination } from "@/hooks/useBackDestination";
import { getBlurDataURL } from "@/lib/blur-placeholders";
import { ExternalLinksToolbar } from "./ExternalLinksToolbar";
import { InDevelopmentBadge } from "./InDevelopmentBadge";
import { ModStatsGroup } from "./ModStatsBadge";
import type { DetailHeaderProps } from "./detail-header.types";

export function DetailHeaderDesktop({
  title,
  status,
  categories,
  heroImage,
  backHref: backHrefProp,
  backLabel: backLabelProp,
  defaultTab,
  links,
  stats,
  metadata,
}: DetailHeaderProps) {
  const dest = useBackDestination(defaultTab ?? "software");
  const backHref = backHrefProp ?? dest.href;
  const backLabel = backLabelProp ?? dest.label;
  const isInDevelopment = status === "in-development";
  const hasCategories = categories && categories.length > 0;
  const hasStats = stats && (stats.downloads !== undefined || stats.endorsements !== undefined);
  const { opacity } = useHeaderCrossfade("out");
  const hasLinks = Boolean(links?.github || links?.liveDemo || links?.download || links?.nexusmods);

  // Build metadata string (default to "Solo project" when no team role specified)
  const metadataParts = [metadata?.teamRole ?? "Solo project", metadata?.developmentTime].filter(Boolean);
  const hasMetadata = metadataParts.length > 0;

  const hasFooter = hasCategories || hasStats || hasLinks || hasMetadata;
  const blurDataURL = heroImage ? getBlurDataURL(heroImage) : undefined;

  const aspectRatioStyle = { aspectRatio: `${DETAIL_HEADER_ASPECT_RATIO}/1` };

  return (
    <div data-testid="detail-header" style={{ opacity }}>
      {/* Hero image with overlaid back button and title */}
      <div className={`relative overflow-hidden ${hasFooter ? "rounded-t-lg" : "rounded-lg"}`} style={aspectRatioStyle}>
        {/* Hero image or fallback background */}
        {heroImage ? (
          <>
            <Image
              data-testid="hero-image"
              src={heroImage}
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 1200px) 1136px, calc(100vw - 16px)"
              className="object-cover"
              placeholder={blurDataURL ? "blur" : undefined}
              blurDataURL={blurDataURL}
            />
            {/* Bottom gradient overlay for title readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-card" />
        )}

        {/* In Development Badge - overlaid bottom right */}
        {isInDevelopment && <InDevelopmentBadge className="absolute bottom-4 right-4 z-10" />}

        {/* Back button + Title - bottom left, connected blocks */}
        <div className="absolute bottom-0 left-0 z-10 flex p-4">
          <Link
            href={backHref}
            aria-label={`Back to ${backLabel}`}
            className="inline-flex items-center justify-center bg-muted/80 px-3 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-accent-high hover:text-accent-high-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="inline-flex items-center bg-secondary-high px-3 font-title text-3xl font-bold text-secondary-foreground backdrop-blur-sm">
            {title}
          </h1>
        </div>
      </div>

      {/* Footer: category badges (left) + metadata + icon links (right) */}
      {/* Tighter padding for single row, more room when categories may wrap */}
      {hasFooter && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-surface-card rounded-b-lg">
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
              {hasStats && <ModStatsGroup downloads={stats.downloads} endorsements={stats.endorsements} />}
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
