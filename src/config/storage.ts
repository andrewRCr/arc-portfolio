/**
 * localStorage key constants.
 *
 * Centralized to ensure app code and E2E tests use identical keys.
 * The "arc-portfolio-" prefix namespaces keys to avoid collisions.
 */

/** User's selected color palette (remedy, rose-pine, gruvbox) */
export const PALETTE_STORAGE_KEY = "arc-portfolio-palette";

/**
 * Light/dark mode key (next-themes default).
 *
 * We don't control this directly - next-themes manages it.
 * Exported for E2E tests that need to set localStorage before navigation.
 */
export const MODE_STORAGE_KEY = "theme";
