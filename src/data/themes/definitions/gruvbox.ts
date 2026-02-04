/**
 * Gruvbox Theme Definition
 *
 * Maps Gruvbox palette colors to shadcn/ui semantic roles.
 * Supports light and dark modes with extended accent variants.
 *
 * **Semantic Mapping:**
 * - Primary: Green (visually lime - Gruvbox's distinctive signature)
 * - Secondary: Orange/Yellow (subtle - used sparingly)
 * - Default accent: Aqua (visually mint - main interactive color)
 * - Destructive: Red
 *
 * **Gruvbox Color Naming (non-standard):**
 * Official Gruvbox uses idiosyncratic color names that don't match visual perception:
 * - "aqua" (#8ec07c) = visually mint/light green
 * - "green" (#b8bb26) = visually lime/yellow-green
 * - "blue" (#83a598) = visually muted teal/seafoam
 * We preserve official naming in palette references but note visual reality in comments.
 *
 * **Surface Type Mapping:**
 * Gruvbox palette doesn't define distinct surface levels, so we follow
 * shadcn's default convention: `card` and `popover` use the same color.
 * Depth perception comes from shadow utilities (shadow-sm/md/lg).
 */

import { gruvboxPalette as p, gruvboxA11y } from "../palettes/gruvbox";
import type { Theme, ThemeColors, ThemeOpacities, ThemeSurfaces } from "../types";
import { hexToRgb, deriveSwatchColors } from "../utils";

// Opacity configuration
const opacities: ThemeOpacities = {
  light: {
    accent: { high: 1, mid: 0.9, low: 0.8 },
    secondary: { high: 0.8, mid: 0.4, low: 0.2 },
    accentForeground: { high: "background", mid: "background", low: "background" },
    accentDecorativeOpacity: 1,
  },
  dark: {
    accent: { high: 0.8, mid: 0.74, low: 0.2 }, // mid bumped for WCAG AA
    secondary: { high: 0.8, mid: 0.2, low: 0.1 },
    accentForeground: { high: "accent-foreground", mid: "foreground", low: "foreground" },
    accentDecorativeOpacity: 1,
  },
};

// Surface configuration - Gruvbox light keeps "normal" hierarchy (exception)
const surfaces: ThemeSurfaces = {
  light: { surfaceOpacity: 0.7, surfaceDarken: 20, windowOpacity: 0.7, windowDarken: 10, surfaceHierarchy: "normal" },
  dark: { surfaceOpacity: 0.8, surfaceDarken: 0, windowOpacity: 0.8, windowDarken: 0, surfaceHierarchy: "normal" },
};

// Define tokens as standalone objects to enable swatch derivation
const lightTokens: ThemeColors = {
  // Base colors
  background: hexToRgb(p.light0), // #fbf1c7
  foreground: hexToRgb(p.dark1), // #3c3836

  // Card colors
  card: hexToRgb(p.light0_hard), // #f9f5d7
  "card-foreground": hexToRgb(p.dark1),

  // Popover colors
  popover: hexToRgb(p.light0_hard),
  "popover-foreground": hexToRgb(p.dark1),

  // Primary colors (green - Gruvbox signature)
  // A11Y: faded_green darkened 5% for WCAG AA (4.67:1)
  primary: hexToRgb(gruvboxA11y.faded_green_dark), // #736E0D (original: #79740e)
  "primary-foreground": hexToRgb(p.light0),

  // Secondary colors (orange - warm accent)
  secondary: hexToRgb(p.faded_orange), // #af3a03
  "secondary-foreground": hexToRgb(p.light0),

  // Muted colors
  muted: hexToRgb(p.light1), // #ebdbb2
  "muted-foreground": hexToRgb(p.dark3), // #665c54

  // Default accent (official "aqua", visually mint green)
  // A11Y: darkened 12.5% for WCAG AA as text on light background (4.54:1)
  accent: hexToRgb("#4E774F"), // darkened from #689d6a
  // A11Y: white foreground for accent-as-background usage (menu focus, etc.)
  "accent-foreground": hexToRgb("#FFFFFF"),

  // Decorative accent variants (all faded for light mode)
  // No -foreground pairs - decorative use only (borders, text color, indicators)
  "accent-red": hexToRgb(p.faded_red), // #9d0006
  "accent-orange": hexToRgb(p.faded_orange), // #af3a03
  "accent-green": hexToRgb(p.faded_green), // #79740e (official "green", visually lime)
  "accent-blue": hexToRgb(p.faded_blue), // #076678 (official "blue", visually teal)
  "accent-purple": hexToRgb(p.faded_purple), // #8f3f71

  // Destructive colors
  destructive: hexToRgb(p.faded_red), // #9d0006
  "destructive-foreground": hexToRgb(p.light0),

  // UI element colors
  border: hexToRgb(p.light2), // #d5c4a1
  "border-strong": hexToRgb(p.light3), // #bdae93 (higher contrast for window frames)
  input: hexToRgb(p.light2),
  ring: hexToRgb(p.faded_green),

  // Shadow tokens
  "shadow-sm": "0 1px 2px rgba(60, 56, 54, 0.08)",
  "shadow-md": "0 2px 8px rgba(60, 56, 54, 0.12)",
  "shadow-lg": "0 4px 16px rgba(60, 56, 54, 0.16)",
};

const darkTokens: ThemeColors = {
  // Base colors
  background: hexToRgb(p.dark0), // #282828
  foreground: hexToRgb(p.light1), // #ebdbb2

  // Card colors
  card: hexToRgb(p.dark0_soft), // #32302f
  "card-foreground": hexToRgb(p.light1),

  // Popover colors
  popover: hexToRgb(p.dark0_soft),
  "popover-foreground": hexToRgb(p.light1),

  // Primary colors (green - Gruvbox signature)
  primary: hexToRgb(p.bright_green), // #b8bb26
  "primary-foreground": hexToRgb(p.dark0),

  // Secondary colors (yellow - toned down for UI backgrounds)
  // Using neutral_yellow instead of bright_yellow for less intensity
  secondary: hexToRgb(p.neutral_yellow), // #d79921
  "secondary-foreground": hexToRgb(p.dark0),

  // Muted colors
  // A11Y: foreground changed from light4 to light3 for WCAG AA (5.32:1)
  muted: hexToRgb(p.dark1), // #3c3836
  "muted-foreground": hexToRgb(p.light3), // #bdae93

  // Default accent (official "aqua", visually mint green)
  accent: hexToRgb(p.bright_aqua), // #8ec07c
  "accent-foreground": hexToRgb(p.dark0),

  // Decorative accent variants (all bright for dark mode)
  // No -foreground pairs - decorative use only (borders, text color, indicators)
  "accent-red": hexToRgb(p.bright_red), // #fb4934
  "accent-orange": hexToRgb(p.bright_orange), // #fe8019
  "accent-green": hexToRgb(p.bright_green), // #b8bb26 (official "green", visually lime)
  "accent-blue": hexToRgb(p.bright_blue), // #83a598 (official "blue", visually teal)
  "accent-purple": hexToRgb(p.bright_purple), // #d3869b

  // Destructive colors
  // A11Y: foreground changed from dark0 to dark0_hard for WCAG AA (4.77:1)
  destructive: hexToRgb(p.bright_red), // #fb4934
  "destructive-foreground": hexToRgb(p.dark0_hard), // #1d2021

  // UI element colors
  border: hexToRgb(p.dark2), // #504945
  "border-strong": hexToRgb(p.dark3), // #665c54 (higher contrast for window frames)
  input: hexToRgb(p.dark2),
  ring: hexToRgb(p.bright_green),

  // Shadow tokens
  "shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.20)",
  "shadow-md": "0 2px 8px rgba(0, 0, 0, 0.24)",
  "shadow-lg": "0 4px 16px rgba(0, 0, 0, 0.32)",
};

export const gruvboxTheme: Theme = {
  name: "gruvbox",
  label: "Gruvbox",

  light: lightTokens,
  dark: darkTokens,

  // Default wallpaper for this theme
  defaultWallpaper: "c-shi",

  // Swatch colors derived from tokens - guarantees accuracy, prevents drift
  swatchColors: {
    light: deriveSwatchColors(lightTokens),
    dark: deriveSwatchColors(darkTokens),
  },

  accentVariants: {
    // Variant names map to accent-{name} tokens. "green" = accent-green (lime/yellow-green).
    // Base "accent" token uses Gruvbox "aqua" (mint) - see accent token definitions above.
    default: "green",
    available: ["red", "orange", "green", "blue", "purple"],
  },

  opacities,
  surfaces,
} as const;
