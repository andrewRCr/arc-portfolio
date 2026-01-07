/**
 * Storage key constants (localStorage and cookies).
 *
 * Centralized to ensure app code and E2E tests use identical keys.
 * The "arc-portfolio-" prefix namespaces keys to avoid collisions.
 *
 * Architecture: Cookies are SSR source of truth, localStorage is client cache.
 */

/** User's selected color palette - localStorage (client cache) */
export const PALETTE_STORAGE_KEY = "arc-portfolio-palette";

/** User's selected color palette - cookie (SSR source of truth) */
export const PALETTE_COOKIE_NAME = "arc-portfolio-palette";

/**
 * Light/dark mode key (next-themes default).
 *
 * We don't control this directly - next-themes manages it.
 * Exported for E2E tests that need to set localStorage before navigation.
 */
export const MODE_STORAGE_KEY = "theme";

/** Per-theme wallpaper preferences (keyed by theme name) - localStorage */
export const WALLPAPER_PREFS_STORAGE_KEY = "arc-portfolio-wallpaper-prefs";

/** Per-theme wallpaper preferences (keyed by theme name) - cookie for SSR */
export const WALLPAPER_COOKIE_NAME = "arc-portfolio-wallpaper";
