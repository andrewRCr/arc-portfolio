/**
 * Intro Animation Cookie Utilities
 *
 * Client-side cookie management for the TWM startup animation.
 * Tracks whether user has seen the animation within the past hour.
 *
 * Usage:
 * - hasSeenIntro(): Check if animation should be skipped
 * - markIntroSeen(): Set after animation completes
 * - clearIntroCookie(): Clear for retrigger (TopBar branding click)
 */

/** Cookie name for intro animation tracking */
export const INTRO_COOKIE_NAME = "arc-intro-seen";

/** Cookie expiry in seconds (1 hour) */
export const INTRO_COOKIE_EXPIRY = 3600;

/**
 * Check if user has seen the intro animation recently.
 *
 * @returns true if valid intro cookie exists, false otherwise
 */
export function hasSeenIntro(): boolean {
  if (typeof document === "undefined") {
    // SSR safety - assume not seen on server
    return false;
  }

  const cookies = document.cookie.split("; ");
  return cookies.some((cookie) => cookie.startsWith(`${INTRO_COOKIE_NAME}=`));
}

/**
 * Mark intro animation as seen.
 *
 * Sets cookie with 1-hour expiry. Called after animation completes
 * or when skipped.
 */
export function markIntroSeen(): void {
  if (typeof document === "undefined") {
    return; // SSR safety
  }

  document.cookie = `${INTRO_COOKIE_NAME}=1; path=/; max-age=${INTRO_COOKIE_EXPIRY}`;
}

/**
 * Clear the intro cookie to allow animation replay.
 *
 * Called when user clicks TopBar branding to retrigger animation.
 */
export function clearIntroCookie(): void {
  if (typeof document === "undefined") {
    return; // SSR safety
  }

  document.cookie = `${INTRO_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
