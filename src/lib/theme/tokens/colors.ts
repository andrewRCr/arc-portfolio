/**
 * Semantic Color Token Definitions
 *
 * Defines the semantic color token system for arc-portfolio's multi-theme support.
 * Adapted from CineXplorer's UnifiedTheme pattern, streamlined for portfolio scope.
 *
 * **Token Categories:**
 * 1. Core Structure - Base surfaces and layers for elevation
 * 2. Semantic Colors - Primary, secondary, accent, muted, destructive with foreground pairs
 * 3. Borders & Focus - Border hierarchy and focus ring
 * 4. Interactive States - Hover and active states per layer
 * 5. Shadows - Elevation shadows (sm, md, lg)
 *
 * **Naming Conventions:**
 * - Uses `-foreground` suffix (shadcn/ui convention) for text-on-surface tokens
 * - Layer-based elevation: `layer-01`, `layer-02`, `layer-03` (IBM Carbon pattern)
 * - All color values are RGB space-separated (e.g., "251 241 199") for Tailwind opacity support
 *
 * @see PRD Section 4.4 for token specification
 * @see CineXplorer frontend/src/theme/color/types.ts for source patterns
 */

/**
 * Semantic color tokens providing consistent cross-theme vocabulary.
 *
 * **Token Count:** 25 tokens organized by purpose
 *
 * **Usage in Components:**
 * ```tsx
 * // Layer-based elevation
 * <div className="bg-layer-01">Card content</div>
 * <div className="bg-layer-02">Modal content</div>
 *
 * // Semantic colors with foreground pairs
 * <button className="bg-primary text-primary-foreground">Submit</button>
 * ```
 */
export interface SemanticColorTokens {
  // ===========================================================================
  // CORE STRUCTURE (5 tokens)
  // ===========================================================================

  /**
   * Default page background color (base canvas).
   * Lowest elevation level in the visual hierarchy.
   *
   * **Usage:** Body backgrounds, main page containers
   */
  background: string;

  /**
   * Default text color on background surfaces.
   *
   * **Usage:** Primary text, body copy, main headings
   */
  foreground: string;

  /**
   * First elevation level (card surfaces).
   *
   * **Semantic meaning:** Card containers, content panels, first elevated surface.
   *
   * **Usage:**
   * - Project cards, content cards
   * - Panel backgrounds
   * - First-level elevated containers
   *
   * **Text color:** Use `foreground` for text on layer-01 surfaces
   *
   * **Design pattern:** IBM Carbon layer system
   * - Light mode: Alternating pattern (white → gray → white)
   * - Dark mode: Progressive lightening (dark → lighter → lightest)
   */
  "layer-01": string;

  /**
   * Second elevation level (elevated surfaces, modals).
   *
   * **Semantic meaning:** Modals, dialogs, elevated panels.
   *
   * **Usage:**
   * - Modal dialogs
   * - Elevated panels over cards
   * - Dropdowns and popovers
   *
   * **Text color:** Use `foreground` for text on layer-02 surfaces
   */
  "layer-02": string;

  /**
   * Third elevation level (highest elevation).
   *
   * **Semantic meaning:** Dropdowns over modals, highest z-index surfaces.
   *
   * **Usage:**
   * - Dropdown menus over modal dialogs
   * - Tooltips over elevated surfaces
   * - Context menus in complex UIs
   *
   * **Text color:** Use `foreground` for text on layer-03 surfaces
   */
  "layer-03": string;

  // ===========================================================================
  // SEMANTIC COLORS (10 tokens - 5 pairs)
  // ===========================================================================

  /**
   * Primary action color.
   *
   * **Usage:** Primary buttons, key CTAs, important links
   */
  primary: string;

  /**
   * Text color on primary backgrounds.
   *
   * **Usage:** Text on primary buttons, icons on primary surfaces
   */
  "primary-foreground": string;

  /**
   * Secondary action color.
   *
   * **Usage:** Secondary buttons, less prominent actions
   */
  secondary: string;

  /**
   * Text color on secondary backgrounds.
   *
   * **Usage:** Text on secondary buttons
   */
  "secondary-foreground": string;

  /**
   * Accent/highlight color.
   *
   * **Usage:** Highlighted elements, active states, accent UI elements
   */
  accent: string;

  /**
   * Text color on accent backgrounds.
   *
   * **Usage:** Text on accent surfaces
   */
  "accent-foreground": string;

  /**
   * Muted/deemphasized background color.
   *
   * **Usage:** Disabled states, subtle backgrounds, deemphasized content
   */
  muted: string;

  /**
   * Text color for muted/secondary text.
   *
   * **Usage:** Help text, labels, captions, timestamps, metadata
   */
  "muted-foreground": string;

  /**
   * Destructive/danger action color.
   *
   * **Usage:** Delete buttons, error states, destructive actions
   */
  destructive: string;

  /**
   * Text color on destructive backgrounds.
   *
   * **Usage:** Text on destructive buttons, error alerts
   */
  "destructive-foreground": string;

  // ===========================================================================
  // BORDERS & FOCUS (3 tokens)
  // ===========================================================================

  /**
   * Subtle border color for decorative/aesthetic use.
   *
   * **Contrast:** May not meet WCAG 3:1 (design choice for subtlety)
   * **Usage:** Aesthetic borders, non-critical dividers, card outlines
   * **Fallback:** Use `border-strong` for accessibility-critical contexts
   */
  "border-subtle": string;

  /**
   * Strong border color for accessible UI.
   *
   * **Contrast:** Meets WCAG 3:1 minimum for non-text elements
   * **Usage:** Interactive element borders, form inputs, button outlines
   */
  "border-strong": string;

  /**
   * Focus ring color for keyboard navigation.
   *
   * **Accessibility:** Must meet WCAG contrast requirements
   * **Usage:** Focus indicators, keyboard navigation highlights
   */
  ring: string;

  // ===========================================================================
  // INTERACTIVE STATES (4 tokens)
  // ===========================================================================

  /**
   * Hover state background for layer-01 surfaces.
   *
   * **Usage:** Card hover effects, interactive list items on layer-01
   * **Implementation:** Slight darkening/lightening of layer-01
   */
  "layer-hover-01": string;

  /**
   * Hover state background for layer-02 surfaces.
   *
   * **Usage:** Interactive elements within modals, hover on layer-02
   */
  "layer-hover-02": string;

  /**
   * Active/pressed state background for layer-01 surfaces.
   *
   * **Usage:** Button press feedback, active click state on layer-01
   * **Note:** More pronounced than hover state
   */
  "layer-active-01": string;

  /**
   * Active/pressed state background for layer-02 surfaces.
   *
   * **Usage:** Button press in modals, active state on layer-02
   */
  "layer-active-02": string;

  // ===========================================================================
  // SHADOWS (3 tokens)
  // ===========================================================================

  /**
   * Small shadow for subtle elevation.
   *
   * **Usage:** Card containers, subtle hover states
   * **Value format:** CSS box-shadow value
   */
  "shadow-sm": string;

  /**
   * Medium shadow for moderate elevation.
   *
   * **Usage:** Dropdown menus, popovers, tooltips
   * **Value format:** CSS box-shadow value
   */
  "shadow-md": string;

  /**
   * Large shadow for high elevation.
   *
   * **Usage:** Modal dialogs, overlays, drawer panels
   * **Value format:** CSS box-shadow value
   */
  "shadow-lg": string;
}

/**
 * All semantic color token names for type-safe token access.
 */
export type SemanticColorTokenName = keyof SemanticColorTokens;
