/**
 * Layout Token Definitions
 *
 * Defines layout tokens for the TWM (Tiling Window Manager) system.
 * These tokens control spatial and visual properties for the window-based layout.
 */

/**
 * Layout tokens for TWM (Tiling Window Manager) system.
 *
 * These tokens define spatial and visual properties for the window-based layout.
 * Values are numeric (pixels) or ratios for flexibility in calculations.
 *
 * **Per-theme overrides:** Themes can override these defaults for visual variety.
 */
export interface LayoutTokens {
  /**
   * Gap between windows in the TWM layout.
   *
   * **Default:** 8 (pixels)
   * **Usage:** Grid gap, window spacing
   */
  windowGap: number;

  /**
   * Border width for window containers.
   *
   * **Default:** 2 (pixels)
   * **Usage:** Window frame borders
   */
  windowBorderWidth: number;

  /**
   * Background opacity for window containers.
   *
   * **Default:** 0.85 (85%)
   * **Range:** 0-1
   * **Usage:** Semi-transparent window backgrounds
   */
  windowOpacity: number;

  /**
   * Top bar height (header/navigation area).
   *
   * **Default:** TBD during TWM implementation
   * **Usage:** Fixed header height
   */
  topBarHeight: number;

  /**
   * Footer height (status bar area).
   *
   * **Default:** TBD during TWM implementation
   * **Usage:** Fixed footer height
   */
  footerHeight: number;

  /**
   * Half-width of the Navigation gap in the TUI frame border.
   *
   * The TUI frame border uses clip-path to create a centered gap where
   * Navigation sits. This value is half the total gap width.
   *
   * **Default:** 190 (pixels)
   * **Usage:** TUI frame border clip-path calculation
   * **Note:** Adjust if Navigation width changes significantly
   */
  navGapHalf: number;

  /**
   * Maximum width for main page content.
   *
   * **Default:** 1152 (pixels) - equivalent to Tailwind's max-w-6xl
   * **Usage:** PageLayout content constraint, FooterBar inner content
   */
  contentMaxWidth: number;

  /**
   * Maximum width for TopBar inner content.
   *
   * **Default:** 1400 (pixels) - slightly wider than main content
   * **Usage:** TopBar inner content constraint for visual hierarchy
   */
  topBarContentMaxWidth: number;
}

/**
 * Default layout token values.
 *
 * Themes can override these via `layoutOverrides` property.
 */
export const DEFAULT_LAYOUT_TOKENS: LayoutTokens = {
  windowGap: 8,
  windowBorderWidth: 2,
  windowOpacity: 0.85,
  topBarHeight: 42, // 28px content + 8px padding + 4px borders + 2px breathing room
  footerHeight: 36, // 18px icons + 12px padding + 4px borders + 2px breathing room
  navGapHalf: 190,
  contentMaxWidth: 1152, // Tailwind max-w-6xl equivalent (72rem)
  topBarContentMaxWidth: 1200, // Wider than content for visual hierarchy
};

/**
 * All layout token names for type-safe token access.
 */
export type LayoutTokenName = keyof LayoutTokens;
