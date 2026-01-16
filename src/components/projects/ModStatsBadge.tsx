/**
 * ModStatsBadge - Display NexusMods statistics with icon
 *
 * Reusable badge for showing download counts and endorsements.
 */

import { Download, ThumbsUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatStatNumber } from "@/lib/nexusmods";
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
    ariaLabel: (value: number) => string;
  }
> = {
  downloads: {
    icon: Download,
    label: "downloads",
    ariaLabel: (v) => `${v.toLocaleString()} total downloads`,
  },
  uniqueDownloads: {
    icon: Users,
    label: "unique downloads",
    ariaLabel: (v) => `${v.toLocaleString()} unique downloads`,
  },
  endorsements: {
    icon: ThumbsUp,
    label: "endorsements",
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
    <Badge variant="secondary" className={cn("gap-1.5", className)} aria-label={config.ariaLabel(value)}>
      <Icon className="size-3" aria-hidden="true" />
      <span>{displayValue}</span>
    </Badge>
  );
}

/**
 * Group of stat badges for displaying multiple stats together
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
  const hasStats = downloads !== undefined || uniqueDownloads !== undefined || endorsements !== undefined;

  if (!hasStats) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {uniqueDownloads !== undefined && <ModStatsBadge type="uniqueDownloads" value={uniqueDownloads} />}
      {endorsements !== undefined && <ModStatsBadge type="endorsements" value={endorsements} />}
      {downloads !== undefined && <ModStatsBadge type="downloads" value={downloads} />}
    </div>
  );
}
