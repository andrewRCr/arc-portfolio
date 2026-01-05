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
   * Half-width of the Navigation gap in the TUI frame border (desktop).
   *
   * The TUI frame border uses clip-path to create a centered gap where
   * Navigation sits. This value is half the total gap width.
   *
   * **Default:** 190 (pixels)
   * **Usage:** TUI frame border clip-path calculation (tablet and above)
   * **Note:** Adjust if Navigation width changes significantly
   */
  navGapHalf: number;

  /**
   * Half-width of the Navigation gap in the TUI frame border (mobile).
   *
   * On phone viewports, navigation collapses to a dropdown showing the
   * current page. This narrower gap accommodates the single-item display.
   *
   * **Default:** 70 (pixels) - fits widest item "PROJECTS" + chevron
   * **Usage:** TUI frame border clip-path calculation (phone only)
   */
  navGapHalfMobile: number;

  /**
   * Minimum height for navigation container.
   *
   * Ensures consistent vertical positioning for both desktop (horizontal links)
   * and mobile (dropdown trigger) navigation variants.
   *
   * **Default:** 28 (pixels)
   * **Usage:** Navigation container min-height for consistent border gap positioning
   */
  navHeight: number;

  /**
   * Depth of the navigation gap notch in the TUI frame border.
   *
   * The clip-path creates a notch at the top of the frame where the Navigation
   * sits. This value controls how deep the notch cuts into the border area.
   * Should be slightly larger than `windowBorderWidth` to fully clear the border.
   *
   * **Default:** 3 (pixels)
   * **Usage:** TUI frame border clip-path vertical offset
   */
  navGapDepth: number;

  /**
   * Maximum width for main page content.
   *
   * **Default:** 1152 (pixels) - equivalent to Tailwind's max-w-6xl
   * **Usage:** PageLayout content constraint, FooterBar inner content
   */
  contentMaxWidth: number;

  /**
   * Vertical padding for scrollable page content area.
   *
   * **Default:** 28 (pixels)
   * **Usage:** PageLayout top/bottom padding, scrollbar track alignment
   * **CSS Variable:** --content-padding-y (auto-generated)
   */
  contentPaddingY: number;

  /**
   * Horizontal padding for scrollable page content area.
   *
   * **Default:** 8 (pixels)
   * **Usage:** PageLayout left/right padding
   * **CSS Variable:** --content-padding-x (auto-generated)
   */
  contentPaddingX: number;

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
  windowOpacity: 0.8,
  topBarHeight: 42, // 28px content + 8px padding + 4px borders + 2px breathing room
  footerHeight: 36, // 18px icons + 12px padding + 4px borders + 2px breathing room
  navGapHalf: 190,
  navGapHalfMobile: 70,
  navHeight: 28,
  navGapDepth: 3,
  contentMaxWidth: 1152, // Tailwind max-w-6xl equivalent (72rem)
  contentPaddingY: 28, // CSS variable: --content-padding-y (auto-generated)
  contentPaddingX: 8, // CSS variable: --content-padding-x (auto-generated)
  topBarContentMaxWidth: 1200, // Wider than content for visual hierarchy
};

/**
 * All layout token names for type-safe token access.
 */
export type LayoutTokenName = keyof LayoutTokens;
