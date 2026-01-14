"use client";

/**
 * DetailHeaderMobile Component
 *
 * Mobile version of the project detail header with card-style layout:
 * - Hero image on top (rounded top corners)
 * - Metadata sections below hero (title/badges, then links)
 * - Back button overlays hero top-left (icon only)
 * - Scroll-based opacity fade coordinated with DetailHeaderCompact
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useHeaderCrossfade, DETAIL_HEADER_ASPECT_RATIO } from "@/hooks/useHeaderCrossfade";
import { buildLinkItems } from "./utils/buildLinkItems";
import type { DetailHeaderProps } from "./DetailHeader";

export function DetailHeaderMobile({
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
      <div className="relative">
        {/* Hero image container - rounded top for card style */}
        <div className="relative overflow-hidden rounded-t-lg" style={aspectRatioStyle}>
          {/* Hero image or fallback background */}
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

          {/* Back button - icon only on mobile */}
          <Link
            href={backHref}
            aria-label={`Back to ${backLabel}`}
            className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-md bg-muted/90 px-2 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* Metadata sections below hero */}
        <div>
          {/* Title and badges section */}
          <div
            className={`space-y-2 min-w-0 px-4 pt-3 pb-4 bg-card/80 ${hasLinks ? "" : "rounded-b-lg"}`}
          >
            <h1 className="font-mono text-2xl font-bold text-foreground">{title}</h1>

            {hasCategories && (
              <div data-testid="category-badges" className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* External links section */}
          {hasLinks && (
            <div
              data-testid="header-links"
              className="flex flex-wrap justify-end gap-2 shrink-0 px-4 py-2 bg-background/80 rounded-b-lg"
            >
              {linkItems.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
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
