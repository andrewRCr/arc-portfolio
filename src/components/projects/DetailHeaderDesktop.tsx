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
import { buildIconLinkItems } from "./utils/buildLinkItems";
import { TouchTarget } from "@/components/ui/TouchTarget";
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
  const iconLinks = buildIconLinkItems(links);
  const hasLinks = iconLinks.length > 0;

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
            className="inline-flex items-center justify-center bg-muted/90 px-3 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted/70 hover:text-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="inline-flex items-center bg-accent/80 px-3 font-title text-3xl font-bold text-accent-foreground">
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
                    className="min-h-6 bg-accent/20 px-2 py-0.5 font-terminal text-sm font-semibold text-foreground"
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

          {/* Icon links - right side */}
          {hasLinks && (
            <div data-testid="header-links" className="flex items-center">
              {iconLinks.map((link, index) => {
                const Icon = link.icon;
                const showAsButton = iconLinks.length === 1 && link.label === "NexusMods";

                if (showAsButton) {
                  // Custom styled link matching category badge sizing
                  // leading-none eliminates line-height padding that causes icon/text misalignment
                  // TouchTarget ensures 44px touch area for tablet accessibility
                  return (
                    <TouchTarget key={link.label} align="end">
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.ariaLabel}
                        className="inline-flex min-h-6 items-center gap-1.5 px-2 py-0.5 font-terminal text-sm leading-none text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {/* mt-px: optical alignment - SVG box model sits higher than text baseline */}
                        <Icon size={16} className="shrink-0 mt-px" />
                        <span>{link.label}</span>
                      </a>
                    </TouchTarget>
                  );
                }

                return (
                  <TouchTarget key={link.label} align={index === iconLinks.length - 1 ? "end" : "center"}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.ariaLabel}
                      className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
