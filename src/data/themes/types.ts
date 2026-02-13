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
  /** Subtle backgrounds, less prominent actions (used sparingly in UI) */
  secondary: string;
  /** Text on secondary backgrounds */
  "secondary-foreground": string;

  // Muted colors
  /** Muted/disabled backgrounds */
  muted: string;
  /** Secondary text, deemphasized content */
  "muted-foreground": string;

  // Default accent colors
  /** Main interactive color: links, focus states, highlights (the "workhorse" outside primary) */
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
 * Swatch color arrays for neofetch-inspired theme preview grid.
 *
 * **Slot Mapping (Weighted by visual dominance):**
 * - Position 0: Muted background
 * - Position 1: Primary (signature color)
 * - Position 2: Accent (main interactive color - links, focus, highlights)
 * - Position 3: Secondary (subtle, used sparingly)
 * - Positions 4-6: Three unique "other" colors (per-theme, avoiding P/S/A duplicates)
 * - Position 7: Foreground
 *
 * Note: Accent appears before Secondary because it's the dominant interactive color
 * in the UI (following shadcn/Material Design conventions where accent/tertiary
 * is the workhorse color for links, focus states, and highlights).
 *
 * Each theme maps these slots to its palette's characteristic colors.
 */
/** 8-element tuple for swatch colors */
type SwatchTuple = readonly [string, string, string, string, string, string, string, string];

export interface SwatchColors {
  /** 8 hex colors for light mode swatch display */
  readonly light: SwatchTuple;
  /** 8 hex colors for dark mode swatch display */
  readonly dark: SwatchTuple;
}

/**
 * Gradient stop definition for wallpaper fallback.
 */
export interface GradientStop {
  /** Theme color token to use */
  readonly token: keyof ThemeColors;
  /** CSS gradient position (e.g., "0%", "50%", "100%") */
  readonly position: string;
}

/**
 * Complete theme definition with light and dark color palettes.
 *
 * Each theme provides:
 * - Name and display label
 * - Light mode color palette
 * - Dark mode color palette
 * - Swatch colors for visual theme preview
 * - Default wallpaper for new users
 * - Accent variant metadata (optional)
 * - Custom gradient stops (optional)
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
  /** 8-color swatch arrays for theme preview grid */
  readonly swatchColors: SwatchColors;
  /** Default wallpaper ID for this theme (used when no preference saved) */
  readonly defaultWallpaper: string;
  /** Accent variant configuration (optional) */
  readonly accentVariants?: AccentMetadata;
  /** Custom gradient stops for wallpaper fallback (optional, defaults to accent→background→secondary) */
  readonly gradientStops?: readonly GradientStop[];
  /** Opacity and foreground configuration for accent/secondary variants (optional) */
  readonly opacities?: ThemeOpacities;
  /** Surface and window configuration for visual layering (optional) */
  readonly surfaces?: ThemeSurfaces;
  /** Hover darkening configuration for interactive elements (optional) */
  readonly hover?: ThemeHoverConfig;
}

/**
 * Theme registry mapping theme names to theme definitions.
 * All registered themes available for selection.
 */
export type ThemeRegistry = Readonly<Record<string, Theme>>;

// =============================================================================
// OPACITY & FOREGROUND CONFIGURATION
// =============================================================================

/**
 * Foreground token reference for opacity variants.
 * Maps to CSS variable names: var(--foreground), var(--background), var(--accent-foreground)
 */
export type ForegroundToken = "foreground" | "background" | "accent-foreground";

/**
 * Opacity levels for a token variant (high/mid/low).
 * Values should be 0-1 representing CSS opacity.
 */
export interface OpacityLevels {
  readonly high: number;
  readonly mid: number;
  readonly low: number;
}

/**
 * Foreground token mapping for accent opacity variants.
 * Determines which foreground color to use for text on accent-high/mid/low backgrounds.
 *
 * Light mode typically uses "background" (light text on darker accent backgrounds).
 * Dark mode varies: "accent-foreground" for high, "foreground" for mid/low.
 */
export interface AccentForegroundMapping {
  readonly high: ForegroundToken;
  readonly mid: ForegroundToken;
  readonly low: ForegroundToken;
}

/**
 * Mode-specific opacity and foreground configuration.
 * Captures all opacity-related CSS variables for a single mode (light or dark).
 */
export interface ModeOpacityConfig {
  /** Accent opacity levels (--accent-high/mid/low-opacity) */
  readonly accent: OpacityLevels;

  /** Secondary opacity levels (--secondary-high/mid/low-opacity) */
  readonly secondary: OpacityLevels;

  /** Foreground tokens for accent variants (--accent-high/mid/low-foreground) */
  readonly accentForeground: AccentForegroundMapping;

  /** Accent decorative opacity (--accent-decorative-opacity) */
  readonly accentDecorativeOpacity: number;
}

/**
 * Decorative accent configuration (mode-independent).
 * Controls which color token to use for decorative accents and its foreground.
 *
 * Defaults: accentDecorativeToken = "primary", accentDecorativeForeground = "primary-foreground"
 */
export interface AccentDecorativeConfig {
  /** Color token for decorative accent (e.g., "primary", "accent-purple") */
  readonly token?: keyof ThemeColors;

  /** Foreground token for text on decorative accent backgrounds */
  readonly foreground?: ForegroundToken | "primary-foreground";
}

/**
 * Complete theme opacity configuration.
 *
 * Centralizes all opacity-related CSS variable values. Enables:
 * 1. Single source of truth for opacity values
 * 2. Type-safe configuration
 * 3. Automatic CSS generation
 * 4. Direct import in contrast tests
 *
 * @example
 * ```typescript
 * const remedyOpacities: ThemeOpacities = {
 *   light: {
 *     accent: { high: 1, mid: 0.9, low: 0.8 },
 *     secondary: { high: 0.8, mid: 0.4, low: 0.2 },
 *     accentForeground: { high: "background", mid: "background", low: "background" },
 *     accentDecorativeOpacity: 0.9,
 *   },
 *   dark: {
 *     accent: { high: 0.8, mid: 0.76, low: 0.2 },
 *     secondary: { high: 0.8, mid: 0.2, low: 0.1 },
 *     accentForeground: { high: "accent-foreground", mid: "foreground", low: "foreground" },
 *     accentDecorativeOpacity: 0.9,
 *   },
 * };
 * ```
 */
export interface ThemeOpacities {
  /** Light mode opacity configuration */
  readonly light: ModeOpacityConfig;

  /** Dark mode opacity configuration */
  readonly dark: ModeOpacityConfig;

  /** Decorative accent overrides (optional, defaults to primary) */
  readonly accentDecorative?: AccentDecorativeConfig;
}

// =============================================================================
// SURFACE & WINDOW CONFIGURATION
// =============================================================================

/**
 * Surface hierarchy determines which color token is used for card vs background surfaces.
 *
 * - "normal": card surfaces use --card, background surfaces use --background
 * - "swapped": card surfaces use --background, background surfaces use --card
 *
 * Light mode typically uses "swapped" to achieve correct visual hierarchy
 * (headers lighter than bodies). Exception: Gruvbox light already has correct
 * hierarchy in its palette, so uses "normal".
 */
export type SurfaceHierarchy = "normal" | "swapped";

/**
 * Shadow level for surface elements.
 * Maps to CSS shadow tokens: --shadow-sm, --shadow-md, --shadow-lg.
 * "none" disables shadow entirely.
 */
export type SurfaceShadow = "none" | "sm" | "md" | "lg";

/**
 * Mode-specific surface and window configuration.
 * Controls transparency, darkening, and surface hierarchy for a single mode.
 *
 * These values map to CSS variables:
 * - --surface-opacity, --surface-darken
 * - --window-bg-opacity, --window-darken
 * - --surface-card-base, --surface-background-base (via hierarchy)
 * - --surface-border-color, --surface-shadow (border/shadow treatment)
 */
export interface ModeSurfaceConfig {
  /** Surface transparency (0-1). Higher = more solid. Default: 0.8 dark, 0.7 light */
  readonly surfaceOpacity: number;

  /** Surface darkening via foreground mix (0-100%). Higher = darker. Default: 0% dark, 20% light */
  readonly surfaceDarken: number;

  /** Window container background opacity (0-1). Default: 0.8 dark, 0.7 light */
  readonly windowOpacity: number;

  /** Window container darkening via foreground mix (0-100%). Default: 0% dark, 10% light */
  readonly windowDarken: number;

  /** Surface hierarchy for card/background token assignment. Default: "normal" dark, "swapped" light */
  readonly surfaceHierarchy: SurfaceHierarchy;

  /** Whether surface elements use border-strong instead of default border. Default: true light, false dark */
  readonly surfaceBorderStrong: boolean;

  /** Shadow level applied to surface elements. Default: "md" light, "none" dark */
  readonly surfaceShadow: SurfaceShadow;
}

/**
 * Complete theme surface configuration for both modes.
 *
 * Controls the visual layering system: how surfaces (cards, backgrounds) and
 * windows (containers) appear in terms of transparency, darkening, and hierarchy.
 *
 * Most themes use identical surface settings within each mode. The primary
 * exception is Gruvbox light, which uses "normal" hierarchy instead of "swapped".
 */
export interface ThemeSurfaces {
  /** Light mode surface configuration */
  readonly light: ModeSurfaceConfig;

  /** Dark mode surface configuration */
  readonly dark: ModeSurfaceConfig;
}

// =============================================================================
// HOVER CONFIGURATION
// =============================================================================

/**
 * Hover color swap options.
 * - "secondary": Use secondary color at full opacity
 * - "secondary-high": Use secondary color at secondary-high-opacity (0.8)
 * - "accent-decorative": Use accent-decorative token at full opacity
 * - "accent-decorative-high": Use accent-decorative token at 0.8 opacity
 */
export type HoverColorSwap = "secondary" | "secondary-high" | "accent-decorative" | "accent-decorative-high";

/**
 * Mode-specific hover configuration.
 * Controls how interactive elements change on hover.
 *
 * Two approaches available:
 * 1. **Color swap** (recommended): Hover swaps to secondary color
 *    - More intentional, consistent across themes
 *    - Set `primaryHoverColor` and/or `accentMidHoverColor`
 *
 * 2. **Darkening** (fallback): Hover darkens the original color
 *    - Dark mode: opacity-based (85% for primary, accent-low for accent-mid)
 *    - Light mode: color-mix with foreground at specified percentage
 *    - Used when hoverColor properties are not set
 *
 * Foreground overrides allow per-theme customization for contrast needs.
 */
export interface ModeHoverConfig {
  /** Percentage to darken primary color on hover (0-100). Used when primaryHoverColor not set. */
  readonly primaryDarken: number;

  /** Percentage to darken accent-mid color on hover (0-100). Used when accentMidHoverColor not set. */
  readonly accentMidDarken: number;

  /**
   * Swap primary to secondary on hover instead of darkening.
   * - "secondary": Use secondary at full opacity
   * - "secondary-high": Use secondary at secondary-high-opacity (toned down)
   */
  readonly primaryHoverColor?: HoverColorSwap;

  /**
   * Swap accent-mid to secondary on hover instead of darkening.
   * - "secondary": Use secondary at full opacity
   * - "secondary-high": Use secondary at secondary-high-opacity (toned down)
   */
  readonly accentMidHoverColor?: HoverColorSwap;

  /**
   * Override foreground for primary hover. If not specified:
   * - With hoverColor: uses secondary-foreground
   * - Without hoverColor: uses primary-foreground (no change)
   */
  readonly primaryHoverForeground?: ForegroundToken | "primary-foreground" | "secondary-foreground";

  /**
   * Override foreground for accent-mid hover. If not specified:
   * - With hoverColor: uses secondary-foreground
   * - Without hoverColor (dark): uses accent-low-foreground
   * - Without hoverColor (light): uses accent-mid-foreground
   *
   * Special values:
   * - "foreground-lightened": foreground mixed with 10% white (for dark mode contrast boost)
   */
  readonly accentMidHoverForeground?: ForegroundToken | "secondary-foreground" | "foreground-lightened";
}

/**
 * Complete theme hover configuration for both modes.
 *
 * Enables per-theme, per-mode control over hover darkening percentages.
 * Most themes use identical values; some may need adjustment for contrast.
 */
export interface ThemeHoverConfig {
  /** Light mode hover configuration */
  readonly light: ModeHoverConfig;

  /** Dark mode hover configuration */
  readonly dark: ModeHoverConfig;
}
