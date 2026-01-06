/**
 * Theme System Type Definitions
 *
 * Defines type-safe interfaces for multi-theme support.
 * Follows shadcn/ui token conventions with minimal extensions.
 *
 * **Token Strategy (ADR-001):**
 * - Primary vocabulary: shadcn/ui conventions (card, popover, border, etc.)
 * - Extensions: Shadow tokens (no shadcn equivalent), layout tokens for TWM
 * - Surface types: `card` = static containers, `popover` = floating overlays
 * - Elevation: Shadow-based (shadow-sm/md/lg), not background color hierarchy
 *
 * @see https://ui.shadcn.com/docs/theming
 */

/**
 * Available accent color variants for theme customization.
 *
 * These are **decorative** colors - they provide palette access without
 * semantic meaning. Use these for styling choices, not to convey state.
 * For semantic colors, use `primary`, `secondary`, `destructive`, etc.
 *
 * Example: A red decorative border uses `accent-red`, while an error
 * state uses `destructive`. Both may be red, but for different reasons.
 */
export type AccentVariant = "red" | "orange" | "green" | "blue" | "purple";

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
 * **Token Categories:**
 * - Semantic tokens (shadcn): primary, secondary, destructive, muted - convey meaning
 * - Decorative accents (extension): accent-red/orange/green/blue/purple - palette access
 *
 * Use semantic tokens for functional meaning, accent tokens for design styling.
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

  // Decorative accent variants (palette access, no semantic meaning)
  // NOTE: No -foreground pairs - these are for decorative use only (borders, text color, indicators)
  // NOT for backgrounds with text. Use semantic tokens (primary, secondary, etc.) for that.
  /** Red accent - decorative use, distinct from destructive */
  "accent-red": string;
  /** Orange accent */
  "accent-orange": string;
  /** Green accent - decorative use, no success semantics */
  "accent-green": string;
  /** Blue accent */
  "accent-blue": string;
  /** Purple accent */
  "accent-purple": string;

  // Destructive colors
  /** Danger/error states */
  destructive: string;
  /** Text on destructive backgrounds */
  "destructive-foreground": string;

  // UI element colors (shadcn/ui convention)
  /** Standard borders */
  border: string;
  /** High-contrast borders for prominent UI elements (window frames, TUI frame) */
  "border-strong": string;
  /** Input field borders */
  input: string;
  /** Focus ring color */
  ring: string;

  // ===========================================================================
  // SHADOW TOKENS (extension - no shadcn equivalent)
  // ===========================================================================

  /** Small shadow for subtle elevation (cards) */
  "shadow-sm": string;

  /** Medium shadow for moderate elevation (popovers, dropdowns) */
  "shadow-md": string;

  /** Large shadow for high elevation (modals, overlays) */
  "shadow-lg": string;
}

/**
 * Complete theme definition with light and dark color palettes.
 *
 * Each theme provides:
 * - Name and display label
 * - Light mode color palette
 * - Dark mode color palette
 * - Accent variant metadata (optional)
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
}

/**
 * Theme registry mapping theme names to theme definitions.
 * All registered themes available for selection.
 */
export type ThemeRegistry = Readonly<Record<string, Theme>>;
