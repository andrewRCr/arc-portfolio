/**
 * Site-wide constants and metadata.
 *
 * Centralizes branding, navigation, and metadata that appears across
 * multiple components. Import these constants rather than hardcoding
 * values to ensure consistency and simplify updates.
 *
 * Also serves as the single source of truth for SEO fields consumed by
 * per-page metadata, OG tags, sitemap, and JSON-LD structured data.
 */

import { SocialLink } from "@/types/contact";

const name = "Andrew Creekmore" as const;

/**
 * Core site identity and metadata.
 */
export const SITE = {
  /** Full name for display (Hero, page titles) */
  name,
  /** SEO author attribution (alias of name) */
  author: name,
  /** Username/handle for branding (TopBar, social links) */
  handle: "andrewRCr",
  /** Browser tab title */
  title: "Andrew Creekmore - Portfolio",
  /** Tagline for Hero section */
  tagline: "Full-stack developer | code & creativity",
  /** Meta description for SEO */
  metaDescription: "Portfolio showcasing full-stack development projects and technical expertise",
  /** Production URL for metadataBase, OG tags, sitemap, and canonical URLs */
  url: "https://andrewcreekmore.dev",
  /** Locale for OG tags and structured data */
  locale: "en_US",
  /** Professional title for JSON-LD Person structured data */
  jobTitle: "Software Engineer",
} as const;

/**
 * Social/professional profile links.
 *
 * Single source of truth consumed by contact data, footer, and JSON-LD sameAs.
 * Order: professional links first, hobby/community links after.
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/andrewRCr",
    icon: "github",
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/andrewRCr",
    icon: "linkedin",
  },
  {
    platform: "NexusMods",
    url: "https://next.nexusmods.com/profile/andrewRCr/mods",
    icon: "nexusmods",
  },
];

/**
 * Main navigation items.
 * Order determines display order in Navigation component.
 */
export const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "PROJECTS", href: "/projects" },
  { label: "SKILLS", href: "/skills" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
] as const;

/** Type for a single navigation item */
export type NavItem = (typeof NAV_ITEMS)[number];
