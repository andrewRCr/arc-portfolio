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
import type { DetailHeaderProps } from "./DetailHeader";

export function DetailHeaderDesktop({
  title,
  categories,
  heroImage,
  backHref,
  backLabel,
  links,
  stats,
}: DetailHeaderProps) {
  const hasCategories = categories && categories.length > 0;
  const hasStats = stats && (stats.uniqueDownloads !== undefined || stats.endorsements !== undefined);
  const { opacity } = useHeaderCrossfade("out");
  const iconLinks = buildIconLinkItems(links);
  const hasLinks = iconLinks.length > 0;
  const hasFooter = hasCategories || hasStats || hasLinks;

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

        {/* Back button - top-left, icon only */}
        <Link
          href={backHref}
          aria-label={`Back to ${backLabel}`}
          className="absolute top-3 left-3 z-10 inline-flex items-center justify-center rounded-md bg-muted/90 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {/* Title - bottom left */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
          <h1 className="font-mono text-3xl font-bold text-white drop-shadow-md">{title}</h1>
        </div>
      </div>

      {/* Footer: category badges (left) + icon links (right) */}
      {/* Tighter padding for single row, more room when categories may wrap */}
      {hasFooter && (
        <div
          className={`flex items-center justify-between gap-4 px-4 bg-card/80 rounded-b-lg ${
            categories && categories.length > 1 ? "py-1.5" : "py-1"
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

          {/* Icon links - ghost buttons */}
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
