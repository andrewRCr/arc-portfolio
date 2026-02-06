/**
 * Feature flags for toggling functionality.
 *
 * Pattern for adding a new flag:
 * 1. Define the flag here with a descriptive name and JSDoc
 * 2. Import `FEATURES` in the consuming route/component
 * 3. Use `FEATURES.YOUR_FLAG` to conditionally render UI or guard routes
 */
export const FEATURES = {
  /**
   * Controls visibility of non-software projects (games, mods) across the site.
   *
   * When `true`: full portfolio with category tabs, all project routes, and
   * cross-type skill filtering.
   *
   * When `false`: software-only mode — tabs hidden, filter scoped to software
   * projects, game/mod detail routes return 404.
   */
  SHOW_ALL_PROJECT_TYPES: true,
} as const;
