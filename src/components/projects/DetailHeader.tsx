"use client";

/**
 * DetailHeader Component
 *
 * Project detail page header in scrollable body content.
 *
 * Uses ResponsiveSwitch to render different layouts:
 * - Mobile (< md): Banner with categories + icon links (no crossfade)
 * - Desktop (>= md): Overlay layout with title/badges/links on hero (crossfade)
 *
 * @see DetailBannerMobile - Mobile banner with categories and icon links
 * @see DetailHeaderDesktop - Desktop overlay layout with crossfade
 */

import { ResponsiveSwitch } from "@/components/ui/ResponsiveSwitch";
import { DetailBannerMobile } from "./DetailBannerMobile";
import { DetailHeaderDesktop } from "./DetailHeaderDesktop";
import type { DetailHeaderProps } from "./detail-header.types";

// Re-export types for consumers that import from DetailHeader
export type { DetailHeaderStats, DetailHeaderProps } from "./detail-header.types";

export function DetailHeader(props: DetailHeaderProps) {
  return (
    <ResponsiveSwitch
      mobile={
        <DetailBannerMobile
          categories={props.categories}
          heroImage={props.heroImage}
          links={props.links}
          stats={props.stats}
          metadata={props.metadata}
        />
      }
      desktop={<DetailHeaderDesktop {...props} />}
    />
  );
}
