/**
 * Feature flags for toggling functionality.
 *
 * These flags allow non-destructive enabling/disabling of features
 * without removing code. Useful for A/B testing or deferring features.
 */
export const FEATURES = {
  /**
   * Show the project category tabs (Software, Games, Mods) on the /projects page.
   * When false, only software projects are displayed (no tab UI).
   * Tab routes and data remain intact for future re-enablement.
   */
  SHOW_PROJECT_TABS: true,
} as const;
