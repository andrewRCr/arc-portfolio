/**
 * Theme System Type Definitions
 *
 * Defines type-safe interfaces for multi-theme support.
 * Combines shadcn/ui conventions with semantic token system.
 *
 * **Token Evolution:**
 * - Original: shadcn/ui convention (card, popover, border)
 * - Extended: Semantic layer system (layer-01/02/03, border-subtle/strong)
 * - Mapping: card ≈ layer-01, popover ≈ layer-02, border ≈ border-subtle
 *
 * @see https://ui.shadcn.com/docs/theming
 * @see src/lib/theme/tokens/colors.ts for SemanticColorTokens
 */

import type { LayoutTokens } from "@/lib/theme";

/**
 * Available accent color variants for theme customization.
 * Supports future accent switching UI in TWM Layout System.
 */
export type AccentVariant = "aqua" | "blue" | "purple" | "orange";

/**
 * Metadata for accent color variants.
 * Describes available accent options and default selection.
 */
export interface AccentMetadata {
  /** Default accent variant for this theme */
  readonly default: AccentVariant;
  /** All available accent variants */
  readonly available: readonly AccentVariant[];
}

/**
 * Theme color palette following shadcn/ui semantic naming convention.
 *
 * All colors are RGB space-separated values (e.g., "249 245 229") to support
 * Tailwind's opacity modifiers (bg-primary/50).
 *
 * Extended with accent color variants (aqua, blue, purple, orange) to support
 * design flexibility and future accent switching functionality.
 */
export interface ThemeColors {
  // Base colors
  /** Default page background */
  background: string;
  /** Default text color */
  foreground: string;

  // Card colors
  /** Card container backgrounds */
  card: string;
  /** Text on card backgrounds */
  "card-foreground": string;

  // Popover colors
  /** Popover/dropdown backgrounds */
  popover: string;
  /** Text on popover backgrounds */
  "popover-foreground": string;

  // Primary colors
  /** Primary action elements (buttons, key links) */
  primary: string;
  /** Text on primary backgrounds */
  "primary-foreground": string;

  // Secondary colors
  /** Secondary action elements */
  secondary: string;
  /** Text on secondary backgrounds */
  "secondary-foreground": string;

  // Muted colors
  /** Muted/disabled backgrounds */
  muted: string;
  /** Secondary text, deemphasized content */
  "muted-foreground": string;

  // Default accent colors
  /** Highlighted elements, callouts */
  accent: string;
  /** Text on accent backgrounds */
  "accent-foreground": string;

  // Extended accent variants
  /** Blue accent variant */
  "accent-blue": string;
  /** Text on blue accent backgrounds */
  "accent-blue-foreground": string;

  /** Purple accent variant */
  "accent-purple": string;
  /** Text on purple accent backgrounds */
  "accent-purple-foreground": string;

  /** Orange accent variant */
  "accent-orange": string;
  /** Text on orange accent backgrounds */
  "accent-orange-foreground": string;

  // Destructive colors
  /** Danger/error states */
  destructive: string;
  /** Text on destructive backgrounds */
  "destructive-foreground": string;

  // UI element colors (shadcn/ui convention)
  /** Standard borders (≈ border-subtle) */
  border: string;
  /** Input field borders */
  input: string;
  /** Focus ring color */
  ring: string;

  // ===========================================================================
  // SEMANTIC LAYER TOKENS (IBM Carbon pattern)
  // ===========================================================================

  /**
   * First elevation level (card surfaces).
   * Semantic equivalent of `card` - use for cards, panels, first elevated surfaces.
   */
  "layer-01": string;

  /**
   * Second elevation level (elevated surfaces, modals).
   * Semantic equivalent of `popover` - use for modals, dialogs, dropdowns.
   */
  "layer-02": string;

  /**
   * Third elevation level (highest elevation).
   * Use for dropdowns over modals, tooltips over elevated surfaces.
   */
  "layer-03": string;

  // ===========================================================================
  // SEMANTIC BORDER TOKENS
  // ===========================================================================

  /**
   * Subtle border for decorative/aesthetic use.
   * May not meet WCAG 3:1 - use border-strong for accessibility-critical contexts.
   */
  "border-subtle": string;

  /**
   * Strong border for accessible UI.
   * Meets WCAG 3:1 minimum for non-text elements.
   */
  "border-strong": string;

  // ===========================================================================
  // INTERACTIVE STATE TOKENS
  // ===========================================================================

  /** Hover state background for layer-01 surfaces */
  "layer-hover-01": string;

  /** Hover state background for layer-02 surfaces */
  "layer-hover-02": string;

  /** Active/pressed state background for layer-01 surfaces */
  "layer-active-01": string;

  /** Active/pressed state background for layer-02 surfaces */
  "layer-active-02": string;

  // ===========================================================================
  // SHADOW TOKENS
  // ===========================================================================

  /** Small shadow for subtle elevation (cards) */
  "shadow-sm": string;

  /** Medium shadow for moderate elevation (popovers, dropdowns) */
  "shadow-md": string;

  /** Large shadow for high elevation (modals, overlays) */
  "shadow-lg": string;
}

/**
 * Per-theme layout token overrides.
 *
 * Allows themes to customize layout values (window gaps, opacity, etc.)
 * while falling back to DEFAULT_LAYOUT_TOKENS for unspecified values.
 *
 * @example
 * // Theme with tighter window gaps
 * layoutOverrides: {
 *   windowGap: 4,
 *   windowOpacity: 0.9
 * }
 */
export type LayoutOverrides = Partial<LayoutTokens>;

/**
 * Complete theme definition with light and dark color palettes.
 *
 * Each theme provides:
 * - Name and display label
 * - Light mode color palette
 * - Dark mode color palette
 * - Accent variant metadata (optional)
 * - Layout overrides (optional)
 */
export interface Theme {
  /** Unique theme identifier (kebab-case) */
  readonly name: string;
  /** Human-readable theme name */
  readonly label: string;
  /** Light mode color palette */
  readonly light: ThemeColors;
  /** Dark mode color palette */
  readonly dark: ThemeColors;
  /** Accent variant configuration (optional) */
  readonly accentVariants?: AccentMetadata;
  /** Per-theme layout token overrides (optional) */
  readonly layoutOverrides?: LayoutOverrides;
}

/**
 * Theme registry mapping theme names to theme definitions.
 * All registered themes available for selection.
 */
export type ThemeRegistry = Readonly<Record<string, Theme>>;
