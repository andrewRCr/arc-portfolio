"use client";

/**
 * DetailHeader Component
 *
 * Project detail page header with hero image background, title, back button,
 * category badges, and external links. Fades out as user scrolls, coordinated
 * with DetailHeaderCompact which fades in.
 *
 * Features:
 * - Responsive layout: card-style on mobile, overlay on desktop
 * - Hero image background with bottom gradient (desktop) for text readability
 * - Fallback to bg-card when no hero image
 * - Back button: in metadata section on mobile, top-left overlay on desktop
 * - Title, badges, links: below hero on mobile, overlaid at bottom on desktop
 * - Standardized aspect ratio for banner images (same on all viewports)
 * - Rounded corners on hero container
 * - Scroll-based opacity fade for crossfade effect with compact header
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useHeaderCrossfade, DETAIL_HEADER_ASPECT_RATIO } from "@/hooks/useHeaderCrossfade";
import type { ProjectLinks } from "@/types/project";

export interface DetailHeaderProps {
  /** Project title displayed as h1 */
  title: string;
  /** Category badges displayed below title */
  categories?: string[];
  /** Path to hero background image (falls back to bg-card if not provided) */
  heroImage?: string;
  /** Back button destination URL */
  backHref: string;
  /** Back button label text (e.g., "Projects", "Home") */
  backLabel: string;
  /** External project links (GitHub, demo, etc.) */
  links?: ProjectLinks;
}

export function DetailHeader({ title, categories, heroImage, backHref, backLabel, links }: DetailHeaderProps) {
  const hasCategories = categories && categories.length > 0;
  const { opacity } = useHeaderCrossfade("out");

  // Build link items from available links
  const linkItems = [
    links?.github && { href: links.github, label: "GitHub" },
    links?.liveDemo && { href: links.liveDemo, label: "Live Demo" },
    links?.download && { href: links.download, label: "Download" },
    links?.external && { href: links.external, label: "NexusMods" },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  const hasLinks = linkItems.length > 0;

  // Dynamic aspect ratio style using the shared constant
  const aspectRatioStyle = { aspectRatio: `${DETAIL_HEADER_ASPECT_RATIO}/1` };

  return (
    <div data-testid="detail-header" style={{ opacity }}>
      {/* Outer container - provides positioning context for desktop overlay */}
      <div className="relative">
        {/* Hero image container - rounded top on mobile (card style), full rounded on desktop */}
        <div
          className="relative overflow-hidden rounded-t-lg sm:rounded-lg"
          style={aspectRatioStyle}
        >
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
              {/* Bottom gradient overlay - only on desktop where text overlays image */}
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </>
          ) : (
            /* Fallback solid background */
            <div className="absolute inset-0 bg-card" />
          )}

          {/* Back button on hero - icon-only on mobile, with text on desktop */}
          <Link
            href={backHref}
            aria-label={`Back to ${backLabel}`}
            className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-md bg-muted/90 px-2 py-1.5 sm:px-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </div>

        {/* Metadata section - below hero on mobile, overlaid at bottom on desktop */}
        <div className="relative sm:absolute sm:bottom-0 sm:left-0 sm:right-0 z-10">
          {/* Desktop: single overlay row */}
          {/* Mobile: card sections (title/badges, then links) */}
          <div className="sm:flex sm:items-end sm:justify-between sm:gap-4 sm:p-4">
            {/* Title and badges section */}
            <div className={`space-y-2 min-w-0 px-4 pt-3 pb-4 sm:p-0 bg-card/80 sm:bg-transparent ${hasLinks ? "rounded-none" : "rounded-b-lg"} sm:rounded-none`}>
              <h1 className="font-mono text-2xl sm:text-3xl font-bold text-foreground sm:text-white sm:drop-shadow-md">
                {title}
              </h1>

              {hasCategories && (
                <div data-testid="category-badges" className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span
                      key={category}
                      className="rounded bg-accent px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold text-accent-foreground"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* External links section - separate bottom section on mobile, inline on desktop */}
            {hasLinks && (
              <div
                data-testid="header-links"
                className="flex flex-wrap justify-end gap-2 shrink-0 px-4 py-2 sm:p-0 bg-background/80 sm:bg-transparent rounded-b-lg sm:rounded-none"
              >
                {linkItems.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-muted sm:bg-muted/90 px-3 py-1.5 text-sm font-medium text-foreground sm:backdrop-blur-sm transition-colors hover:bg-muted/80 sm:hover:bg-muted"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
