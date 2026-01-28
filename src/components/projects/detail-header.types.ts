/**
 * Shared types for DetailHeader components.
 *
 * Extracted to break circular dependency between:
 * - DetailHeader.tsx
 * - DetailHeaderDesktop.tsx
 * - DetailBannerMobile.tsx
 */

import type { ProjectLinks } from "@/types/project";

/**
 * Stats to display in the header (from NexusMods API)
 */
export interface DetailHeaderStats {
  downloads?: number;
  uniqueDownloads?: number;
  endorsements?: number;
}

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
  /** External project links (GitHub, demo, etc.) */
  links?: ProjectLinks;
  /** NexusMods stats (optional, for mods) */
  stats?: DetailHeaderStats;
}
