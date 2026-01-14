"use client";

/**
 * DetailHeaderCompact Component
 *
 * Compact version of the project detail header, shown in PageLayout's header slot.
 * Fades in as the full DetailHeader scrolls out of view (coordinated crossfade).
 *
 * Features:
 * - Desktop: single row with back button, title, and external links
 * - Mobile: two rows (back + title, then links) for better readability
 * - Bottom border separator (matches PageHeader style)
 * - Scroll-based opacity fade (inverse of full header)
 * - Grid height animation for smooth expand/collapse
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useHeaderCrossfade } from "@/hooks/useHeaderCrossfade";
import { TouchTarget } from "@/components/ui/TouchTarget";
import type { ProjectLinks } from "@/types/project";

export interface DetailHeaderCompactProps {
  /** Project title */
  title: string;
  /** Back button destination URL */
  backHref: string;
  /** Back button label text */
  backLabel: string;
  /** External project links */
  links?: ProjectLinks;
}

export function DetailHeaderCompact({ title, backHref, backLabel, links }: DetailHeaderCompactProps) {
  const { opacity, isExpanded } = useHeaderCrossfade("in");

  // Build link items from available links
  const linkItems = [
    links?.github && { href: links.github, label: "GitHub" },
    links?.liveDemo && { href: links.liveDemo, label: "Demo" },
    links?.download && { href: links.download, label: "Download" },
    links?.external && { href: links.external, label: "NexusMods" },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  const hasLinks = linkItems.length > 0;

  return (
    <div
      className="grid"
      style={{
        gridTemplateRows: isExpanded ? "1fr" : "0fr",
        opacity,
        pointerEvents: isExpanded ? "auto" : "none",
        transition: "grid-template-rows 0.15s ease-out",
      }}
    >
      {/* Inner container must have overflow-hidden for grid animation to work */}
      <div className="overflow-hidden">
        {/* Compact header - stacked on mobile, single row on desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0 sm:gap-4 pt-2 pb-0 sm:py-2">
          {/* Back button + title */}
          <div className="flex items-center min-w-0">
            <TouchTarget align="start">
              <Link
                href={backHref}
                aria-label={`Back to ${backLabel}`}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </TouchTarget>

            {/* Separator: sized to match text, pull left into TouchTarget space on mobile */}
            <div className="h-4 w-px bg-border -ml-2 sm:ml-3" aria-hidden="true" />

            <h1 className="font-mono text-lg font-bold text-foreground truncate ml-4 sm:ml-6">{title}</h1>
          </div>

          {/* External links - second row on mobile, right-aligned */}
          {hasLinks && (
            <div className="flex items-center justify-end -mt-4 sm:mt-0 shrink-0">
              {linkItems.map((link, index) => (
                <TouchTarget key={link.label} align={index === linkItems.length - 1 ? "end" : "center"}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                  >
                    {link.label} →
                  </a>
                </TouchTarget>
              ))}
            </div>
          )}
        </div>

        {/* Bottom separator */}
        <div className="mx-4 border-b border-border/50" />
      </div>
    </div>
  );
}
