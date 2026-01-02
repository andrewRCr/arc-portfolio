/**
 * Site-wide constants and metadata.
 *
 * Centralizes branding, navigation, and metadata that appears across
 * multiple components. Import these constants rather than hardcoding
 * values to ensure consistency and simplify updates.
 */

/**
 * Core site identity and metadata.
 */
export const SITE = {
  /** Full name for display (Hero, page titles) */
  name: "Andrew Creekmore",
  /** Username/handle for branding (TopBar, social links) */
  handle: "andrewRCr",
  /** Browser tab title */
  title: "Andrew Creekmore - Portfolio",
  /** Tagline for Hero section */
  tagline: "Full-stack developer & creative technologist",
  /** Meta description for SEO */
  metaDescription: "Portfolio showcasing full-stack development projects and technical expertise",
} as const;

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
