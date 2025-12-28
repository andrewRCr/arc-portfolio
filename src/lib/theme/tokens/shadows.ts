/**
 * Shadow Token Definitions
 *
 * Theme-aware shadow tokens for shadow-based elevation.
 * Shadows provide depth perception in the shadcn/ui model.
 *
 * **Shadow Progression:**
 * - `shadow-sm`: Subtle lift (cards at rest, standard containers)
 * - `shadow-md`: Clear separation (dropdowns, floating panels)
 * - `shadow-lg`: Prominent elevation (modals, critical overlays)
 *
 * **Visibility Thresholds:**
 * - Light mode: opacity >= 0.08 (subtle is acceptable)
 * - Dark mode: opacity >= 0.20 (must be more prominent)
 *
 */

/**
 * Shadow tokens for theme-aware elevation.
 *
 * Values are CSS box-shadow strings, not RGB values.
 * Each theme can define different shadow colors/opacities
 * to ensure visibility against its background.
 */
export interface ShadowTokens {
  /** Subtle lift - cards at rest, standard containers */
  "shadow-sm": string;

  /** Clear separation - dropdowns, floating panels, hover states */
  "shadow-md": string;

  /** Prominent elevation - modals, dialogs, critical overlays */
  "shadow-lg": string;
}

/**
 * All shadow token names for type-safe token access.
 */
export type ShadowTokenName = keyof ShadowTokens;

/**
 * Minimum shadow opacity thresholds for visibility validation.
 */
export const SHADOW_OPACITY_THRESHOLDS = {
  /** Light mode: subtle shadows are acceptable */
  light: 0.08,
  /** Dark mode: shadows must be more prominent */
  dark: 0.2,
} as const;

/**
 * Default shadow tokens for light mode.
 *
 * Uses neutral gray shadows that work with most light backgrounds.
 * Themes may override these with palette-appropriate shadows.
 */
export const DEFAULT_SHADOW_TOKENS_LIGHT: ShadowTokens = {
  "shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.08)",
  "shadow-md": "0 2px 8px rgba(0, 0, 0, 0.12)",
  "shadow-lg": "0 4px 16px rgba(0, 0, 0, 0.16)",
};

/**
 * Default shadow tokens for dark mode.
 *
 * Higher opacity than light mode to ensure visibility
 * against dark backgrounds where shadows are harder to see.
 */
export const DEFAULT_SHADOW_TOKENS_DARK: ShadowTokens = {
  "shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.20)",
  "shadow-md": "0 2px 8px rgba(0, 0, 0, 0.25)",
  "shadow-lg": "0 4px 16px rgba(0, 0, 0, 0.30)",
};
