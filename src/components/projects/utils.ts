/**
 * Utility functions for project components.
 * Server-compatible (no "use client" directive).
 */

/**
 * Helper to compute back destination based on navigation context.
 * Used by page components to configure DetailHeader.
 */
export function getBackDestination(from?: string, currentTab: "software" | "games" | "mods" = "software") {
  if (from === "home") {
    return { href: "/", label: "Home" };
  }
  return { href: `/projects?tab=${currentTab}`, label: "Projects" };
}
