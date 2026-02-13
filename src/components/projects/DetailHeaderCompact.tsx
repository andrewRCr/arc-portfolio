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

import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useHeaderCrossfade } from "@/hooks/useHeaderCrossfade";
import { useBackDestination } from "@/hooks/useBackDestination";
import { ResponsiveSwitch } from "@/components/common/ResponsiveSwitch";
import { ExternalLinksToolbar } from "./ExternalLinksToolbar";
import type { ProjectLinks } from "@/types/project";

export interface DetailHeaderCompactProps {
  /** Project title */
  title: string;
  /** Shorter title for mobile (falls back to title) */
  compactTitle?: string;
  /** Back button destination URL (resolved by useBackDestination if omitted) */
  backHref?: string;
  /** Back button label text (resolved by useBackDestination if omitted) */
  backLabel?: string;
  /** Default tab for back navigation — used by useBackDestination hook */
  defaultTab?: "software" | "games" | "mods";
  /** External project links */
  links?: ProjectLinks;
}

/** Internal props with resolved (required) back navigation values */
interface ResolvedCompactProps {
  title: string;
  compactTitle?: string;
  backHref: string;
  backLabel: string;
  links?: ProjectLinks;
}

/** Mobile variant: always visible, single row, no links */
function DetailHeaderCompactMobile({ title, compactTitle, backHref, backLabel }: Omit<ResolvedCompactProps, "links">) {
  const { opacity: scrollOpacity } = useHeaderCrossfade("in");

  return (
    <div>
      <div className="flex items-center py-2">
        <Link
          href={backHref}
          aria-label={`Back to ${backLabel}`}
          className="relative inline-flex h-8 shrink-0 items-center justify-center bg-surface-muted px-2 text-muted-foreground transition-colors hover:bg-accent-high hover:text-accent-high-foreground after:absolute after:inset-x-0 after:-top-1.5 after:-bottom-1.5 after:content-['']"
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
function DetailHeaderCompactDesktop({ title, backHref, backLabel, links }: ResolvedCompactProps) {
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
              className="relative inline-flex h-8 items-center justify-center bg-surface-muted px-3 text-muted-foreground transition-colors hover:bg-accent-high hover:text-accent-high-foreground after:absolute after:inset-x-0 after:-top-1.5 after:-bottom-1.5 after:content-['']"
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

function DetailHeaderCompactInner({
  backHref: backHrefProp,
  backLabel: backLabelProp,
  defaultTab,
  ...rest
}: DetailHeaderCompactProps) {
  const dest = useBackDestination(defaultTab ?? "software");
  const resolved: ResolvedCompactProps = {
    ...rest,
    backHref: backHrefProp ?? dest.href,
    backLabel: backLabelProp ?? dest.label,
  };

  return (
    <ResponsiveSwitch
      mobile={<DetailHeaderCompactMobile {...resolved} />}
      desktop={<DetailHeaderCompactDesktop {...resolved} />}
    />
  );
}

export function DetailHeaderCompact(props: DetailHeaderCompactProps) {
  return (
    <Suspense>
      <DetailHeaderCompactInner {...props} />
    </Suspense>
  );
}
