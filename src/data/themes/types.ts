/**
 * Theme System Type Definitions
 *
 * Defines type-safe interfaces for multi-theme support.
 * Based on shadcn/ui color convention with extended accent variants.
 *
 * @see https://ui.shadcn.com/docs/theming
 */

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

  // UI element colors
  /** Standard borders */
  border: string;
  /** Input field borders */
  input: string;
  /** Focus ring color */
  ring: string;
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
