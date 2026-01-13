/**
 * DetailHeader Component
 *
 * Project detail page header with hero image background, title, back button,
 * and category badges. Designed to work with PageLayout's header slot.
 *
 * Features:
 * - Hero image background with overlay for text readability
 * - Fallback to bg-card when no hero image
 * - Back button with icon and customizable destination
 * - Category badges below title
 * - Bottom border separator (matches PageHeader pattern)
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
}

export function DetailHeader({ title, categories, heroImage, backHref, backLabel }: DetailHeaderProps) {
  const hasCategories = categories && categories.length > 0;

  return (
    <div data-testid="detail-header">
      {/* Header content area with optional hero image background */}
      <div className="relative overflow-hidden">
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
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/80 to-card/60" />
          </>
        ) : (
          /* Fallback solid background */
          <div className="absolute inset-0 bg-card" />
        )}

        {/* Content positioned above background */}
        <div className="relative z-10 space-y-3 py-4">
          {/* Back button */}
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to {backLabel}</span>
          </Link>

          {/* Title */}
          <h1 className="font-mono text-3xl font-bold text-foreground">{title}</h1>

          {/* Category badges */}
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
      </div>

      {/* Bottom separator - matches PageHeader pattern */}
      <div className="mt-3 mx-4 border-b border-border/50" />
    </div>
  );
}
