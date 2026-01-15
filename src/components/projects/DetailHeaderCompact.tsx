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
import { TouchTarget } from "@/components/ui/TouchTarget";
import { buildIconLinkItems } from "./utils/buildLinkItems";
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
        <div className="flex items-center min-w-0">
          <TouchTarget align="start" className="-ml-2">
            <Link
              href={backHref}
              aria-label={`Back to ${backLabel}`}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </TouchTarget>

          <div className="h-4 w-px bg-border -ml-3" aria-hidden="true" />

          <h1 className="font-mono text-lg font-bold text-foreground truncate ml-3">
            {compactTitle || title}
          </h1>
        </div>
      </div>

      {/* Divider fades in on scroll */}
      <div className="mx-4 border-b border-border/50" style={{ opacity: scrollOpacity }} />
    </div>
  );
}

/** Desktop variant: crossfade animation, shows icon links */
function DetailHeaderCompactDesktop({ title, backHref, backLabel, links }: DetailHeaderCompactProps) {
  const { opacity, isExpanded } = useHeaderCrossfade("in");
  const iconLinks = buildIconLinkItems(links);
  const hasLinks = iconLinks.length > 0;

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
          <div className="flex items-center min-w-0">
            <TouchTarget align="start" className="-ml-2">
              <Link
                href={backHref}
                aria-label={`Back to ${backLabel}`}
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </TouchTarget>

            <div className="h-4 w-px bg-border -ml-3" aria-hidden="true" />

            <h1 className="font-mono text-lg font-bold text-foreground truncate ml-3">{title}</h1>
          </div>

          {hasLinks && (
            <div className="flex items-center shrink-0">
              {iconLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <TouchTarget key={link.label} align={index === iconLinks.length - 1 ? "end" : "center"}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.ariaLabel}
                      className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon size={18} />
                    </a>
                  </TouchTarget>
                );
              })}
            </div>
          )}
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
