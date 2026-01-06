/**
 * Shared constants for E2E tests.
 *
 * Breakpoints mirror the app's responsive design (src/hooks/useMediaQuery.ts):
 * - PHONE_QUERY = "(max-width: 767px)" → mobile behavior
 * - Tailwind md breakpoint = 768px → tablet/desktop behavior
 */

/**
 * Tailwind md breakpoint - the boundary between phone and tablet/desktop.
 * Mobile viewport: width < MD_BREAKPOINT (767px and below)
 * Tablet/desktop viewport: width >= MD_BREAKPOINT (768px and above)
 */
export const MD_BREAKPOINT = 768;

/**
 * Standard viewport sizes used across E2E tests.
 * These match the Playwright config project definitions.
 */
export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: MD_BREAKPOINT, height: 1024 },
  desktop: { width: 1920, height: 1080 },
} as const;
