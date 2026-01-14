"use client";

/**
 * DetailHeader Component
 *
 * Project detail page header with hero image background, title, back button,
 * category badges, and external links. Fades out as user scrolls, coordinated
 * with DetailHeaderCompact which fades in.
 *
 * Uses ResponsiveSwitch to render different layouts:
 * - Mobile (< md): Card-style layout with hero on top, metadata below
 * - Desktop (>= md): Overlay layout with metadata on hero image
 *
 * @see DetailHeaderMobile - Card-style mobile layout
 * @see DetailHeaderDesktop - Overlay desktop layout
 */

import { ResponsiveSwitch } from "@/components/ui/ResponsiveSwitch";
import { DetailHeaderMobile } from "./DetailHeaderMobile";
import { DetailHeaderDesktop } from "./DetailHeaderDesktop";
import type { ProjectLinks } from "@/types/project";

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
}

export function DetailHeader(props: DetailHeaderProps) {
  return (
    <ResponsiveSwitch
      mobile={<DetailHeaderMobile {...props} />}
      desktop={<DetailHeaderDesktop {...props} />}
    />
  );
}
