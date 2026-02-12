/**
 * Rosé Pine Theme Definition
 *
 * Maps Rosé Pine palette colors to shadcn/ui semantic roles.
 * Uses Main variant for dark mode, Dawn variant for light mode.
 *
 * **Semantic Mapping:**
 * - Primary: Pine (teal - Rose Pine's signature)
 * - Secondary: Foam (cyan - subtle, used sparingly)
 * - Default accent: Rose (mauve - main interactive color)
 * - Destructive: Love (red)
 *
 * **Surface Type Mapping:**
 * Rose Pine's official palette defines distinct surface levels:
 * - `surface`: "Secondary background (cards, panels)" → maps to `card`
 * - `overlay`: "Tertiary background (popovers, temporary elements)" → maps to `popover`
 *
 * Unlike shadcn's default (where card = popover), Rose Pine intentionally
 * distinguishes these surfaces.
 */

import { rosePineMain, rosePineDawn, rosePineA11y } from "../palettes/rose-pine";
import type { Theme, ThemeColors, ThemeOpacities, ThemeSurfaces, ThemeHoverConfig } from "../types";
import { hexToRgb, deriveSwatchColors } from "../utils";

// Opacity configuration - Rose Pine has muted accents, needs higher opacities
const opacities: ThemeOpacities = {
  light: {
    accent: { high: 1, mid: 0.85, low: 0.75 },
    secondary: { high: 0.8, mid: 0.4, low: 0.2 },
    accentForeground: { high: "background", mid: "background", low: "background" },
    accentDecorativeOpacity: 1,
  },
  dark: {
    accent: { high: 1, mid: 0.8, low: 0.6 }, // low bumped from 0.4 for muted pink visibility
    secondary: { high: 0.8, mid: 0.2, low: 0.1 },
    accentForeground: { high: "accent-foreground", mid: "accent-foreground", low: "accent-foreground" }, // low uses dark text
    accentDecorativeOpacity: 1,
  },
  // Use iris (purple) for decorative accent instead of primary
  accentDecorative: { token: "accent-purple", foreground: "background" },
};

// Surface configuration - controls visual layering
const surfaces: ThemeSurfaces = {
  light: {
    surfaceOpacity: 0.7,
    surfaceDarken: 20,
    windowOpacity: 0.7,
    windowDarken: 10,
    surfaceHierarchy: "swapped",
    surfaceBorderStrong: true,
    surfaceShadow: "md",
  },
  dark: {
    surfaceOpacity: 0.8,
    surfaceDarken: 0,
    windowOpacity: 0.8,
    windowDarken: 0,
    surfaceHierarchy: "normal",
    surfaceBorderStrong: false,
    surfaceShadow: "none",
  },
};

// Hover configuration - primary swaps to accent-decorative (iris/purple), accent-mid darkens in-family
// Rose Pine: Secondary (foam/cyan) is too close to primary (pine/teal), so we use
//            accent-decorative (iris/purple) for a distinct complementary shift
// Primary: Pine (teal) → Iris (purple)
const hover: ThemeHoverConfig = {
  light: {
    primaryDarken: 40, // fallback
    accentMidDarken: 40,
    primaryHoverColor: "accent-decorative",
  },
  dark: {
    primaryDarken: 10, // fallback
    accentMidDarken: 10, // fallback (uses accent-low-opacity)
    primaryHoverColor: "accent-decorative-high",
    // Rose Pine dark: Flip to light foreground for contrast on dimmed rose
    accentMidHoverForeground: "foreground",
  },
};

// Define tokens as standalone objects to enable swatch derivation
const lightTokens: ThemeColors = {
  // Base colors (Dawn variant)
  background: hexToRgb(rosePineDawn.base), // #faf4ed
  foreground: hexToRgb(rosePineDawn.text), // #575279

  // Card colors
  // Light mode adjustment: surface (#fffaf3) is lighter than base - inverse elevation
  // Using overlay for darker card that harmonizes with semi-transparent window
  card: hexToRgb(rosePineDawn.overlay), // #f2e9e1
  "card-foreground": hexToRgb(rosePineDawn.text),

  // Popover colors (same as card for consistency)
  popover: hexToRgb(rosePineDawn.overlay), // #f2e9e1
  "popover-foreground": hexToRgb(rosePineDawn.text),

  // Primary colors (pine - teal accent)
  primary: hexToRgb(rosePineDawn.pine), // #286983
  "primary-foreground": hexToRgb(rosePineDawn.base),

  // Secondary colors (foam - cyan accent)
  // A11Y: foam darkened 20% for WCAG AA (4.63:1)
  secondary: hexToRgb(rosePineA11y.foam_dark), // #45767F (original: #56949f)
  "secondary-foreground": hexToRgb(rosePineDawn.base),

  // Muted colors
  // A11Y: Rose Pine's "muted" is a TEXT color, not a background
  // Using highlight_med as proper background + darkened subtle for contrast (5.44:1)
  muted: hexToRgb(rosePineDawn.highlight_med), // #dfdad9 (semantic fix)
  "muted-foreground": hexToRgb(rosePineA11y.subtle_dark), // #555267 (original: #797593)

  // Default accent (rose - mauve accent)
  // A11Y: rose darkened 30% for WCAG AA (4.86:1)
  accent: hexToRgb(rosePineA11y.rose_dark), // #975B58 (original: #d7827e)
  "accent-foreground": hexToRgb(rosePineDawn.base),

  // Decorative accent variants
  // No -foreground pairs - decorative use only (borders, text color, indicators)
  "accent-red": hexToRgb(rosePineDawn.love), // #b4637a
  "accent-orange": hexToRgb(rosePineDawn.gold), // #ea9d34
  "accent-green": hexToRgb(rosePineDawn.foam), // #56949f (cyan as green)
  "accent-blue": hexToRgb(rosePineDawn.pine), // #286983 (teal as blue)
  "accent-purple": hexToRgb(rosePineDawn.iris), // #907aa9

  // Destructive colors
  // A11Y: love darkened 13% for WCAG AA + surface-muted contrast
  destructive: hexToRgb(rosePineA11y.love_dark), // #9D566A (original: #b4637a)
  "destructive-foreground": hexToRgb(rosePineDawn.base),

  // UI element colors
  border: hexToRgb(rosePineDawn.highlight_med), // #dfdad9
  "border-strong": hexToRgb(rosePineDawn.highlight_high), // #cecacd (higher contrast for window frames)
  input: hexToRgb(rosePineDawn.surface),
  ring: hexToRgb(rosePineDawn.pine),

  // Shadow tokens
  "shadow-sm": "0 1px 2px rgba(87, 82, 121, 0.08)",
  "shadow-md": "0 2px 8px rgba(87, 82, 121, 0.12)",
  "shadow-lg": "0 4px 16px rgba(87, 82, 121, 0.16)",
};

const darkTokens: ThemeColors = {
  // Base colors (Main variant)
  background: hexToRgb(rosePineMain.base), // #191724
  foreground: hexToRgb(rosePineMain.text), // #e0def4

  // Card colors
  card: hexToRgb(rosePineMain.surface), // #1f1d2e
  "card-foreground": hexToRgb(rosePineMain.text),

  // Popover colors
  popover: hexToRgb(rosePineMain.overlay), // #26233a
  "popover-foreground": hexToRgb(rosePineMain.text),

  // Primary colors (pine - teal accent)
  // A11Y: pine lightened 15% for WCAG AA (4.56:1)
  primary: hexToRgb(rosePineA11y.pine_light), // #5089A0 (original: #31748f)
  "primary-foreground": hexToRgb(rosePineMain.base),

  // Secondary colors (foam - cyan accent)
  secondary: hexToRgb(rosePineMain.foam), // #9ccfd8
  "secondary-foreground": hexToRgb(rosePineMain.base),

  // Muted colors
  // A11Y: Rose Pine's "muted" is a TEXT color, not a background
  // Using highlight_med as proper background + lightened subtle for contrast (4.57:1)
  muted: hexToRgb(rosePineMain.highlight_med), // #403d52 (semantic fix)
  "muted-foreground": hexToRgb(rosePineA11y.subtle_light), // #ACA9BF (original: #908caa)

  // Default accent (rose - mauve accent)
  accent: hexToRgb(rosePineMain.rose), // #ebbcba
  "accent-foreground": hexToRgb(rosePineMain.base),

  // Decorative accent variants
  // No -foreground pairs - decorative use only (borders, text color, indicators)
  "accent-red": hexToRgb(rosePineMain.love), // #eb6f92
  "accent-orange": hexToRgb(rosePineMain.gold), // #f6c177
  "accent-green": hexToRgb(rosePineMain.foam), // #9ccfd8 (cyan as green)
  "accent-blue": hexToRgb(rosePineMain.pine), // #31748f (teal as blue)
  "accent-purple": hexToRgb(rosePineMain.iris), // #c4a7e7

  // Destructive colors
  destructive: hexToRgb(rosePineMain.love), // #eb6f92
  "destructive-foreground": hexToRgb(rosePineMain.base),

  // UI element colors
  border: hexToRgb(rosePineMain.highlight_med), // #403d52
  "border-strong": hexToRgb(rosePineMain.highlight_high), // #524f67 (higher contrast for window frames)
  input: hexToRgb(rosePineMain.surface),
  ring: hexToRgb(rosePineMain.pine),

  // Shadow tokens
  "shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.20)",
  "shadow-md": "0 2px 8px rgba(0, 0, 0, 0.24)",
  "shadow-lg": "0 4px 16px rgba(0, 0, 0, 0.32)",
};

export const rosePineTheme: Theme = {
  name: "rose-pine",
  label: "Rosé Pine",

  light: lightTokens,
  dark: darkTokens,

  // Default wallpaper for this theme
  defaultWallpaper: "jr-korpa-2",

  // Swatch colors derived from tokens - guarantees accuracy, prevents drift
  // Light mode passes surfaces config to apply surface-muted darkening to slot 0
  swatchColors: {
    light: deriveSwatchColors(lightTokens, surfaces.light),
    dark: deriveSwatchColors(darkTokens, surfaces.dark),
  },

  accentVariants: {
    default: "red", // Rose Pine signature is rose/love (mauve-red)
    available: ["red", "orange", "green", "blue", "purple"],
  },

  opacities,
  surfaces,
  hover,
} as const;
