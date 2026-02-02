"use client";

/**
 * ModStatsBadge - Display NexusMods statistics with icon
 *
 * Reusable badge for showing download counts and endorsements.
 */

import { Download, ThumbsUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { formatStatNumber } from "@/lib/nexusmods";
import { useIsPhone } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export type ModStatType = "downloads" | "uniqueDownloads" | "endorsements";

interface ModStatsBadgeProps {
  /** The stat value to display */
  value: number;
  /** Type of statistic */
  type: ModStatType;
  /** Additional class names */
  className?: string;
  /** Show the raw number instead of formatted (e.g., 1234 instead of 1.2K) */
  showRaw?: boolean;
}

const statConfig: Record<
  ModStatType,
  {
    icon: typeof Download;
    label: string;
    tooltip: string;
    ariaLabel: (value: number) => string;
  }
> = {
  downloads: {
    icon: Download,
    label: "downloads",
    tooltip: "Total Downloads",
    ariaLabel: (v) => `${v.toLocaleString()} total downloads`,
  },
  uniqueDownloads: {
    icon: Users,
    label: "unique downloads",
    tooltip: "Unique Downloads",
    ariaLabel: (v) => `${v.toLocaleString()} unique downloads`,
  },
  endorsements: {
    icon: ThumbsUp,
    label: "endorsements",
    tooltip: "Endorsements",
    ariaLabel: (v) => `${v.toLocaleString()} endorsements`,
  },
};

/**
 * Badge displaying a NexusMods statistic with appropriate icon
 *
 * @example
 * <ModStatsBadge type="uniqueDownloads" value={5951} />
 * // Renders: [Users icon] 6K
 *
 * @example
 * <ModStatsBadge type="endorsements" value={212} />
 * // Renders: [ThumbsUp icon] 212
 */
export function ModStatsBadge({ value, type, className, showRaw = false }: ModStatsBadgeProps) {
  const config = statConfig[type];
  const Icon = config.icon;
  const displayValue = showRaw ? value.toLocaleString() : formatStatNumber(value);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="secondary"
          className={cn("gap-1.5 border border-border bg-muted text-foreground", className)}
          aria-label={config.ariaLabel(value)}
        >
          <Icon className="size-3" aria-hidden="true" />
          <span>{displayValue}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{config.tooltip}</TooltipContent>
    </Tooltip>
  );
}

/**
 * Compact badge combining multiple stats in one (for phone viewports)
 * Renders: [👍 212 · 👥 6K · ⬇️ 9K]
 */
interface ModStatsCompactProps {
  downloads?: number;
  uniqueDownloads?: number;
  endorsements?: number;
  className?: string;
}

function ModStatsCompact({ downloads, uniqueDownloads, endorsements, className }: ModStatsCompactProps) {
  // Build array of stats to display, deriving from shared statConfig
  const entries: Array<{ type: ModStatType; value: number }> = [];
  if (endorsements !== undefined) entries.push({ type: "endorsements", value: endorsements });
  if (uniqueDownloads !== undefined) entries.push({ type: "uniqueDownloads", value: uniqueDownloads });
  if (downloads !== undefined) entries.push({ type: "downloads", value: downloads });

  const stats = entries.map(({ type, value }) => {
    const config = statConfig[type];
    return {
      icon: config.icon,
      value: formatStatNumber(value),
      label: config.ariaLabel(value),
    };
  });

  if (stats.length === 0) return null;

  const ariaLabel = stats.map((s) => s.label).join(", ");

  return (
    <Badge
      variant="secondary"
      className={cn("gap-2.5 border border-border bg-muted text-foreground", className)}
      aria-label={ariaLabel}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <span key={index} className="inline-flex items-center gap-1">
            <Icon className="size-3" aria-hidden="true" />
            <span>{stat.value}</span>
          </span>
        );
      })}
    </Badge>
  );
}

/**
 * Group of stat badges for displaying multiple stats together
 *
 * On phone: renders a single compact badge combining all stats
 * On tablet/desktop: renders separate badges for each stat
 *
 * @example
 * <ModStatsGroup
 *   uniqueDownloads={5951}
 *   endorsements={212}
 * />
 */
interface ModStatsGroupProps {
  /** Total downloads (optional, usually not shown) */
  downloads?: number;
  /** Unique downloads */
  uniqueDownloads?: number;
  /** Endorsements */
  endorsements?: number;
  /** Additional class names for the container */
  className?: string;
}

export function ModStatsGroup({ downloads, uniqueDownloads, endorsements, className }: ModStatsGroupProps) {
  const isPhone = useIsPhone();
  const hasStats = downloads !== undefined || uniqueDownloads !== undefined || endorsements !== undefined;

  if (!hasStats) {
    return null;
  }

  // Phone: single compact badge with all stats
  if (isPhone) {
    return (
      <ModStatsCompact
        downloads={downloads}
        uniqueDownloads={uniqueDownloads}
        endorsements={endorsements}
        className={className}
      />
    );
  }

  // Tablet/Desktop: separate badges
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {endorsements !== undefined && <ModStatsBadge type="endorsements" value={endorsements} />}
      {uniqueDownloads !== undefined && <ModStatsBadge type="uniqueDownloads" value={uniqueDownloads} />}
      {downloads !== undefined && <ModStatsBadge type="downloads" value={downloads} />}
    </div>
  );
}

/**
 * Inline stats display (no badge wrapper) - for embedding in other components
 * Renders: [👍 212 · 👥 6K · ⬇️ 9K] as inline content
 */
interface ModStatsInlineProps {
  downloads?: number;
  uniqueDownloads?: number;
  endorsements?: number;
  className?: string;
}

export function ModStatsInline({ downloads, uniqueDownloads, endorsements, className }: ModStatsInlineProps) {
  const entries: Array<{ type: ModStatType; value: number }> = [];
  if (endorsements !== undefined) entries.push({ type: "endorsements", value: endorsements });
  if (uniqueDownloads !== undefined) entries.push({ type: "uniqueDownloads", value: uniqueDownloads });
  if (downloads !== undefined) entries.push({ type: "downloads", value: downloads });

  if (entries.length === 0) return null;

  const stats = entries.map(({ type, value }) => {
    const config = statConfig[type];
    return {
      icon: config.icon,
      value: formatStatNumber(value),
      label: config.ariaLabel(value),
    };
  });

  const ariaLabel = stats.map((s) => s.label).join(", ");

  return (
    <span className={cn("inline-flex items-center gap-3 text-foreground", className)} aria-label={ariaLabel}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <span key={index} className="inline-flex items-center gap-1">
            <Icon className="size-2.5" aria-hidden="true" />
            <span className="text-xs">{stat.value}</span>
          </span>
        );
      })}
    </span>
  );
}
