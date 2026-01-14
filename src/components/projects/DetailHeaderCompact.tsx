"use client";

/**
 * DetailHeaderCompact Component
 *
 * Compact version of the project detail header, shown in PageLayout's header slot.
 * Fades in as the full DetailHeader scrolls out of view (coordinated crossfade).
 *
 * Features:
 * - Single row: back button, title, external links
 * - Bottom border separator (matches PageHeader style)
 * - Scroll-based opacity fade (inverse of full header)
 * - Grid height animation for smooth expand/collapse
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useHeaderCrossfade } from "@/hooks/useHeaderCrossfade";
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
        {/* Compact header row */}
        <div className="flex items-center justify-between gap-4 py-2">
          {/* Left: back button + title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={backHref}
              aria-label={`Back to ${backLabel}`}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>

            <span className="text-border">|</span>

            <h1 className="font-mono text-lg font-bold text-foreground truncate">{title}</h1>
          </div>

          {/* Right: external links */}
          {hasLinks && (
            <div className="flex items-center gap-2 shrink-0">
              {linkItems.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                >
                  {link.label} →
                </a>
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
