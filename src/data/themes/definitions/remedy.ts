/**
 * Remedy Theme Definition
 *
 * Maps Remedy palette colors to shadcn/ui semantic roles.
 * Supports light ("bright") and dark modes with orange as signature accent.
 *
 * **Semantic Mapping (derived from VS Code theme ui.ts):**
 * - Primary: Orange (Remedy's signature color)
 * - Secondary: Yellow (subtle - used sparingly)
 * - Default accent: Cyan (main interactive color - links, focus, highlights)
 * - Destructive: Red
 *
 * **Surface Type Mapping:**
 * Remedy uses slightly lightened base for code areas. We follow shadcn
 * default convention: `card` and `popover` use the same color (baseCode).
 * Depth perception comes from shadow utilities.
 */

import { remedyBright, remedyDark, remedyAccents, remedyA11y } from "../palettes/remedy";
import type { Theme, ThemeColors, ThemeOpacities, ThemeSurfaces } from "../types";
import { hexToRgb, deriveSwatchColors } from "../utils";

// Opacity configuration - mirrors CSS overrides for single source of truth
const opacities: ThemeOpacities = {
  light: {
    accent: { high: 1, mid: 0.9, low: 0.8 },
    secondary: { high: 0.8, mid: 0.4, low: 0.2 },
    accentForeground: { high: "background", mid: "background", low: "background" },
    accentDecorativeOpacity: 0.9,
  },
  dark: {
    accent: { high: 0.8, mid: 0.76, low: 0.2 }, // mid bumped for WCAG AA
    secondary: { high: 0.8, mid: 0.2, low: 0.1 },
    accentForeground: { high: "accent-foreground", mid: "accent-foreground", low: "foreground" },
    accentDecorativeOpacity: 0.9,
  },
};

// Surface configuration - controls visual layering
const surfaces: ThemeSurfaces = {
  light: { surfaceOpacity: 0.7, surfaceDarken: 20, windowOpacity: 0.7, windowDarken: 10, surfaceHierarchy: "swapped" },
  dark: { surfaceOpacity: 0.8, surfaceDarken: 0, windowOpacity: 0.8, windowDarken: 0, surfaceHierarchy: "normal" },
};

// Define tokens as standalone objects to enable swatch derivation
const lightTokens: ThemeColors = {
  // Base colors (Bright variant)
  background: hexToRgb(remedyBright.base), // #FCEED1
  foreground: hexToRgb(remedyBright.foreground), // #5C4D2E

  // Card colors
  card: hexToRgb(remedyBright.baseCode), // #F7E8C8
  "card-foreground": hexToRgb(remedyBright.foreground),

  // Popover colors (same as card per shadcn convention)
  popover: hexToRgb(remedyBright.baseCode),
  "popover-foreground": hexToRgb(remedyBright.foreground),

  // Primary colors (orange - Remedy signature)
  // A11Y: foreground changed from base to black for WCAG AA (4.53:1)
  primary: hexToRgb(remedyAccents.normal.orange), // #EB684B
  "primary-foreground": hexToRgb(remedyAccents.normal.black), // #282A2E

  // Secondary colors (yellow)
  // A11Y: foreground changed from base to black for WCAG AA (5.78:1)
  secondary: hexToRgb(remedyAccents.normal.yellow), // #DE935F
  "secondary-foreground": hexToRgb(remedyAccents.normal.black), // #282A2E

  // Muted colors
  // A11Y: foregroundDimmed darkened 20% for WCAG AA (4.81:1) - preserves muted semantic
  muted: hexToRgb(remedyBright.baseCode),
  "muted-foreground": hexToRgb(remedyA11y.foregroundDimmed_dark), // #6E6450 (original: #8A7D64)

  // Default accent (cyan - cool contrast to warm orange)
  // A11Y: darkened 12.6% for WCAG AA as text on light background (4.52:1)
  accent: hexToRgb("#527370"), // darkened from #6E9893
  // A11Y: white foreground for accent-as-background usage (menu focus, etc.)
  "accent-foreground": hexToRgb("#FFFFFF"),

  // Decorative accent variants
  // No -foreground pairs - decorative use only (borders, text color, indicators)
  "accent-red": hexToRgb(remedyAccents.normal.red), // #A54242
  "accent-orange": hexToRgb(remedyAccents.normal.orange), // #EB684B
  "accent-green": hexToRgb(remedyAccents.normal.green), // #8C9440
  "accent-blue": hexToRgb(remedyAccents.normal.blue), // #5F819D
  "accent-purple": hexToRgb(remedyAccents.normal.magenta), // #85678F

  // Destructive colors
  destructive: hexToRgb(remedyAccents.normal.red), // #A54242
  "destructive-foreground": hexToRgb(remedyBright.base),

  // UI element colors
  border: hexToRgb(remedyBright.border), // #E5D9BC
  "border-strong": hexToRgb(remedyBright.shadow), // #C9BEAA (higher contrast for window frames)
  input: hexToRgb(remedyBright.baseCode),
  ring: hexToRgb(remedyAccents.normal.orange),

  // Shadow tokens (warm brown tint for light mode)
  "shadow-sm": "0 1px 2px rgba(92, 77, 46, 0.08)",
  "shadow-md": "0 2px 8px rgba(92, 77, 46, 0.12)",
  "shadow-lg": "0 4px 16px rgba(92, 77, 46, 0.16)",
};

const darkTokens: ThemeColors = {
  // Base colors (Dark variant)
  background: hexToRgb(remedyDark.base), // #352B2A
  foreground: hexToRgb(remedyDark.foreground), // #F5D899

  // Card colors
  card: hexToRgb(remedyDark.baseCode), // #3D3231
  "card-foreground": hexToRgb(remedyDark.foreground),

  // Popover colors (same as card per shadcn convention)
  popover: hexToRgb(remedyDark.baseCode),
  "popover-foreground": hexToRgb(remedyDark.foreground),

  // Primary colors (orange - Remedy signature)
  // A11Y: orange lightened 5% for WCAG AA (4.58:1)
  primary: hexToRgb(remedyA11y.orange_light), // #EC7054 (original: #EB684B)
  "primary-foreground": hexToRgb(remedyDark.base),

  // Secondary colors (yellow - bright variant)
  secondary: hexToRgb(remedyAccents.bright.yellow), // #F0C674
  "secondary-foreground": hexToRgb(remedyDark.base),

  // Muted colors
  // A11Y: foregroundDimmed lightened 3% for WCAG AA (4.54:1) - preserves muted semantic
  muted: hexToRgb(remedyDark.baseCode),
  "muted-foreground": hexToRgb(remedyA11y.foregroundDimmed_light), // #AB9B7C (original: #A89878)

  // Default accent (cyan - cool contrast to warm palette)
  accent: hexToRgb(remedyAccents.bright.cyan), // #8ABEB7
  "accent-foreground": hexToRgb(remedyDark.base),

  // Decorative accent variants (bright variants for dark mode)
  // No -foreground pairs - decorative use only (borders, text color, indicators)
  "accent-red": hexToRgb(remedyAccents.bright.red), // #CC6666
  "accent-orange": hexToRgb(remedyAccents.bright.orange), // #EB684B
  "accent-green": hexToRgb(remedyAccents.bright.green), // #B5BD68
  "accent-blue": hexToRgb(remedyAccents.bright.blue), // #81A2BE
  "accent-purple": hexToRgb(remedyAccents.bright.magenta), // #B294BB

  // Destructive colors
  // A11Y: red lightened 15% for WCAG AA (4.59:1)
  destructive: hexToRgb(remedyA11y.red_light), // #D47D7D (original: #CC6666)
  "destructive-foreground": hexToRgb(remedyDark.base),

  // UI element colors
  border: hexToRgb(remedyDark.border), // #4A3F3D
  "border-strong": hexToRgb(remedyDark.borderStrong),
  input: hexToRgb(remedyDark.baseCode),
  ring: hexToRgb(remedyAccents.bright.orange),

  // Shadow tokens (darker for dark mode)
  "shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.20)",
  "shadow-md": "0 2px 8px rgba(0, 0, 0, 0.24)",
  "shadow-lg": "0 4px 16px rgba(0, 0, 0, 0.32)",
};

export const remedyTheme: Theme = {
  name: "remedy",
  label: "Remedy",

  light: lightTokens,
  dark: darkTokens,

  // Default wallpaper for this theme
  defaultWallpaper: "karolis-milisauskas",

  // Swatch colors derived from tokens - guarantees accuracy, prevents drift
  swatchColors: {
    light: deriveSwatchColors(lightTokens),
    dark: deriveSwatchColors(darkTokens),
  },

  accentVariants: {
    // "green" in Remedy palette is actually a teal/cyan shade - provides cool contrast to warm orange primary
    default: "green",
    available: ["red", "orange", "green", "blue", "purple"],
  },

  opacities,
  surfaces,
} as const;
