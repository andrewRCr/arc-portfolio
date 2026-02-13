/**
 * Tailwind Breakpoint Configuration
 *
 * Centralized source of truth for responsive breakpoints.
 * Matches Tailwind CSS default breakpoints.
 *
 * Usage:
 * - Import constants for JS-based viewport checks
 * - Import query strings for useMediaQuery hook
 * - Use preset hooks (useIsPhone, useIsMobileSm) for common patterns
 */

/**
 * Breakpoint values in pixels (Tailwind defaults)
 */
export const BREAKPOINTS = {
  /** Small mobile boundary (Tailwind `sm`) */
  sm: 640,
  /** Phone/tablet boundary (Tailwind `md`) */
  md: 768,
  /** Tablet/desktop boundary (Tailwind `lg`) */
  lg: 1024,
  /** Large desktop boundary (Tailwind `xl`) */
  xl: 1280,
  /** Extra large boundary (Tailwind `2xl`) */
  "2xl": 1536,
} as const;

/**
 * Media query strings for useMediaQuery hook
 * Use max-width for "below breakpoint" checks (mobile-first inversion)
 */
export const MEDIA_QUERIES = {
  /** Below sm breakpoint (< 640px) - small mobile devices */
  belowSm: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  /** Below md breakpoint (< 768px) - phone devices */
  belowMd: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  /** Below lg breakpoint (< 1024px) - phone and tablet */
  belowLg: `(max-width: ${BREAKPOINTS.lg - 1}px)`,
} as const;

/**
 * Semantic aliases for common use cases
 */
export const VIEWPORT_QUERIES = {
  /** Mobile viewport (phone or tablet portrait) - collapsed nav, mobile-specific UI */
  mobile: MEDIA_QUERIES.belowMd,
  /** Phone viewport - extra compact layouts (2-col gallery, card-style headers) */
  phone: MEDIA_QUERIES.belowSm,
  /**
   * Short viewport - not enough vertical space for full body content.
   * Triggers at <=875px viewport height (laptop screens ~900px minus browser chrome).
   * Used to move key elements (e.g., skills logos) into fixed header areas.
   */
  shortViewport: "(max-height: 875px)",
} as const;
