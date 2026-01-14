"use client";

/**
 * DetailHeader Component
 *
 * Project detail page header in scrollable body content.
 *
 * Uses ResponsiveSwitch to render different layouts:
 * - Mobile (< md): HeroBanner with categories + icon links (no crossfade)
 * - Desktop (>= md): Overlay layout with title/badges/links on hero (crossfade)
 *
 * @see DetailHeaderHeroBanner - Mobile hero with categories and icon links
 * @see DetailHeaderDesktop - Desktop overlay layout with crossfade
 */

import { ResponsiveSwitch } from "@/components/ui/ResponsiveSwitch";
import { DetailHeaderHeroBanner } from "./DetailHeaderHeroBanner";
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
      mobile={<DetailHeaderHeroBanner categories={props.categories} heroImage={props.heroImage} links={props.links} />}
      desktop={<DetailHeaderDesktop {...props} />}
    />
  );
}
