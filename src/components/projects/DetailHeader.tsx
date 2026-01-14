"use client";

/**
 * DetailHeader Component
 *
 * Project detail page header with hero image background, title, back button,
 * category badges, and external links. Fades out as user scrolls, coordinated
 * with DetailHeaderCompact which fades in.
 *
 * Features:
 * - Hero image background with bottom gradient for text readability
 * - Fallback to bg-card when no hero image
 * - Back button positioned top-left with solid muted style
 * - Title and category badges positioned at bottom-left of hero
 * - External links positioned at bottom-right of hero
 * - Standardized aspect ratio for banner images
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
      {/* Hero container with standardized aspect ratio and rounded corners */}
      <div className="relative overflow-hidden rounded-lg" style={aspectRatioStyle}>
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
            {/* Bottom gradient overlay - transparent at top, dark at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </>
        ) : (
          /* Fallback solid background */
          <div className="absolute inset-0 bg-card" />
        )}

        {/* Back button - positioned top-left with solid muted style */}
        <Link
          href={backHref}
          aria-label={`Back to ${backLabel}`}
          className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-md bg-muted/90 px-3 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>

        {/* Bottom content area - title left, links right */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between gap-4 p-4">
          {/* Title and badges - left side */}
          <div className="space-y-2 min-w-0">
            <h1 className="font-mono text-2xl sm:text-3xl font-bold text-white drop-shadow-md">{title}</h1>

            {hasCategories && (
              <div data-testid="category-badges" className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* External links - right side */}
          {hasLinks && (
            <div data-testid="header-links" className="flex flex-wrap justify-end gap-2 shrink-0">
              {linkItems.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-muted/90 px-3 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted"
                >
                  {link.label} →
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
