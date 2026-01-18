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
 */
export interface LayoutTokens {
  /**
   * Gap between windows in the TWM layout.
   * **Usage:** Grid gap, window spacing
   */
  windowGap: number;

  /**
   * Border width for window containers.
   * **Usage:** Window frame borders
   */
  windowBorderWidth: number;

  /**
   * Background opacity for window containers.
   * **Range:** 0-1
   * **Usage:** Semi-transparent window backgrounds
   */
  windowOpacity: number;

  /**
   * Top bar height (header/navigation area).
   * **Usage:** Fixed header height
   */
  topBarHeight: number;

  /**
   * Footer height (status bar area).
   * **Usage:** Fixed footer height
   */
  footerHeight: number;

  /**
   * Half-width of the Navigation gap in the TUI frame border (desktop).
   *
   * The TUI frame border uses clip-path to create a centered gap where
   * Navigation sits. This value is half the total gap width.
   *
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
   * **Usage:** TUI frame border clip-path calculation (phone only)
   */
  navGapHalfMobile: number;

  /**
   * Minimum height for navigation container.
   *
   * Ensures consistent vertical positioning for both desktop (horizontal links)
   * and mobile (dropdown trigger) navigation variants.
   *
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
   * **Usage:** TUI frame border clip-path vertical offset
   */
  navGapDepth: number;

  /**
   * Maximum width for main page content.
   * **Usage:** PageLayout content constraint, FooterBar inner content
   */
  contentMaxWidth: number;

  /**
   * Vertical padding for scrollable page content area.
   * **Usage:** PageLayout top/bottom padding, scrollbar track alignment
   * **CSS Variable:** --content-padding-y (auto-generated)
   */
  contentPaddingY: number;

  /**
   * Horizontal padding for scrollable page content area.
   * **Usage:** PageLayout left/right padding
   * **CSS Variable:** --content-padding-x (auto-generated)
   */
  contentPaddingX: number;

  /**
   * Maximum width for TopBar inner content.
   * **Usage:** TopBar inner content constraint for visual hierarchy
   */
  topBarContentMaxWidth: number;

  /**
   * Maximum width for the window container column.
   * At large viewports, constrains all three windows (TopBar, main, Footer)
   * to reveal wallpaper margins on either side.
   * **Usage:** LayoutWrapper outer container constraint
   */
  windowContainerMaxWidth: number;

  /**
   * Maximum width for the TUI frame content area.
   * Narrower than contentMaxWidth to allow centering with padding.
   * **Usage:** ConditionalFrame inner content constraint
   */
  tuiFrameMaxWidth: number;
}

/**
 * Default layout token values.
 */
export const DEFAULT_LAYOUT_TOKENS: LayoutTokens = {
  windowGap: 8,
  windowBorderWidth: 2,
  windowOpacity: 0.8,
  topBarHeight: 48, // 44px touch target + 4px borders
  footerHeight: 48, // 44px touch target + 4px borders
  navGapHalf: 190,
  navGapHalfMobile: 70,
  navHeight: 28,
  navGapDepth: 3,
  contentMaxWidth: 1152, // Tailwind max-w-6xl equivalent (72rem)
  contentPaddingY: 24, // CSS variable: --content-padding-y (auto-generated)
  contentPaddingX: 8, // CSS variable: --content-padding-x (auto-generated)
  topBarContentMaxWidth: 1200, // Wider than content for visual hierarchy
  windowContainerMaxWidth: 1200, // Reveals wallpaper margins at large viewports
  tuiFrameMaxWidth: 1120, // Narrower than content for centering with padding
};

/**
 * All layout token names for type-safe token access.
 */
export type LayoutTokenName = keyof LayoutTokens;
