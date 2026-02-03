"use client";

/**
 * DetailHeaderCompact Component
 *
 * Compact version of the project detail header, shown in PageLayout's header slot.
 *
 * Responsive behavior:
 * - Mobile: Always visible, single row (back + title), no links (they're in body's HeroBanner)
 * - Desktop: Crossfade animation (fades in as DetailHeader scrolls out), includes text links
 *
 * @see ResponsiveSwitch - CSS-based viewport switching to avoid hydration flash
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useHeaderCrossfade } from "@/hooks/useHeaderCrossfade";
import { ResponsiveSwitch } from "@/components/ui/ResponsiveSwitch";
import { ExternalLinksToolbar } from "./ExternalLinksToolbar";
import type { ProjectLinks } from "@/types/project";

export interface DetailHeaderCompactProps {
  /** Project title */
  title: string;
  /** Shorter title for mobile (falls back to title) */
  compactTitle?: string;
  /** Back button destination URL */
  backHref: string;
  /** Back button label text */
  backLabel: string;
  /** External project links */
  links?: ProjectLinks;
}

/** Mobile variant: always visible, single row, no links */
function DetailHeaderCompactMobile({
  title,
  compactTitle,
  backHref,
  backLabel,
}: Omit<DetailHeaderCompactProps, "links">) {
  const { opacity: scrollOpacity } = useHeaderCrossfade("in");

  return (
    <div>
      <div className="flex items-center py-2">
        <Link
          href={backHref}
          aria-label={`Back to ${backLabel}`}
          className="inline-flex h-8 shrink-0 items-center justify-center bg-muted px-2 text-muted-foreground transition-colors hover:bg-accent-high hover:text-accent-high-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="flex h-8 flex-1 items-center bg-secondary-high px-2 font-title text-lg font-bold text-secondary-foreground truncate">
          {compactTitle || title}
        </h1>
      </div>

      {/* Divider fades in on scroll */}
      <div className="mx-4 border-b border-border/50" style={{ opacity: scrollOpacity }} />
    </div>
  );
}

/** Desktop variant: crossfade animation, shows icon links */
function DetailHeaderCompactDesktop({ title, backHref, backLabel, links }: DetailHeaderCompactProps) {
  const { opacity, isExpanded } = useHeaderCrossfade("in");

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
      <div className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 py-2">
          <div className="flex min-w-0">
            <Link
              href={backHref}
              aria-label={`Back to ${backLabel}`}
              className="inline-flex h-8 items-center justify-center bg-muted px-3 text-muted-foreground transition-colors hover:bg-accent-high hover:text-accent-high-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="inline-flex h-8 items-center bg-secondary-high px-2 font-title text-lg font-bold text-secondary-foreground truncate">
              {title}
            </h1>
          </div>

          <ExternalLinksToolbar links={links} variant="compact" />
        </div>

        <div className="mx-4 border-b border-border/50" />
      </div>
    </div>
  );
}

export function DetailHeaderCompact(props: DetailHeaderCompactProps) {
  return (
    <ResponsiveSwitch
      mobile={<DetailHeaderCompactMobile {...props} />}
      desktop={<DetailHeaderCompactDesktop {...props} />}
    />
  );
}
