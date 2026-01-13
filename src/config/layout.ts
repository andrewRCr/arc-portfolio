/**
 * Layout Mode Configuration
 *
 * Centralized source of truth for layout mode identifiers.
 * Used by client context, server actions, and SSR layout.
 */

/** Valid layout mode identifiers */
export const LAYOUT_MODES = ["wide", "boxed", "full"] as const;

/** Layout mode type derived from valid modes */
export type LayoutMode = (typeof LAYOUT_MODES)[number];

/** Default layout mode for new users */
export const DEFAULT_LAYOUT_MODE: LayoutMode = "boxed";
