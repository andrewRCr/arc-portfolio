"use client";

/**
 * DetailHeaderDesktop Component
 *
 * Desktop version of the project detail header with overlay layout:
 * - Hero image with gradient overlay for text readability
 * - Title, badges, and links overlaid at bottom of hero
 * - Back button at top-left
 * - Scroll-based opacity fade coordinated with DetailHeaderCompact
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useHeaderCrossfade, DETAIL_HEADER_ASPECT_RATIO } from "@/hooks/useHeaderCrossfade";
import { buildLinkItems } from "./utils/buildLinkItems";
import type { DetailHeaderProps } from "./DetailHeader";

export function DetailHeaderDesktop({
  title,
  categories,
  heroImage,
  backHref,
  backLabel,
  links,
}: DetailHeaderProps) {
  const hasCategories = categories && categories.length > 0;
  const { opacity } = useHeaderCrossfade("out");
  const linkItems = buildLinkItems(links);
  const hasLinks = linkItems.length > 0;

  const aspectRatioStyle = { aspectRatio: `${DETAIL_HEADER_ASPECT_RATIO}/1` };

  return (
    <div data-testid="detail-header" style={{ opacity }}>
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
            {/* Bottom gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-card" />
        )}

        {/* Back button - top-left with text */}
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
          {/* Title and badges */}
          <div className="space-y-2 min-w-0">
            <h1 className="font-mono text-3xl font-bold text-white drop-shadow-md">{title}</h1>

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

          {/* External links */}
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
