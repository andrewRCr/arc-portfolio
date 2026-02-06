/**
 * Mariana Theme Definition
 *
 * Maps Mariana palette colors to shadcn/ui semantic roles.
 * Uses Sublime Text's Mariana color scheme.
 *
 * **Semantic Mapping:**
 * - Primary: Medium blue (Mariana's signature - #5c99d6)
 * - Secondary: Yellow/orange (warm, subtle - used sparingly)
 * - Default accent: Teal/cyan (main interactive color - links, focus, highlights)
 * - Destructive: Coral red
 *
 * **Design Philosophy:**
 * Mariana uses a cohesive cool blue-gray palette. Colors work
 * harmoniously together rather than creating sharp contrast.
 * Sophisticated and professional without being aggressive.
 */

import { marianaDark, marianaLight, marianaA11y } from "../palettes/mariana";
import type { Theme, ThemeColors, ThemeOpacities, ThemeSurfaces, ThemeHoverConfig } from "../types";
import { hexToRgb, deriveSwatchColors } from "../utils";

// Opacity configuration - Mariana needs high opacities for WCAG compliance
const opacities: ThemeOpacities = {
  light: {
    accent: { high: 0.95, mid: 0.8, low: 0.75 },
    secondary: { high: 0.7, mid: 0.4, low: 0.2 }, // secondary-high toned down
    accentForeground: { high: "background", mid: "background", low: "background" },
    accentDecorativeOpacity: 0.9,
  },
  dark: {
    accent: { high: 0.94, mid: 0.94, low: 0.2 }, // high/mid bumped for WCAG AA
    secondary: { high: 0.7, mid: 0.2, low: 0.1 }, // secondary-high toned down
    accentForeground: { high: "accent-foreground", mid: "accent-foreground", low: "foreground" },
    accentDecorativeOpacity: 0.9,
  },
};

// Surface configuration - controls visual layering
const surfaces: ThemeSurfaces = {
  light: { surfaceOpacity: 0.7, surfaceDarken: 20, windowOpacity: 0.7, windowDarken: 10, surfaceHierarchy: "swapped" },
  dark: { surfaceOpacity: 0.8, surfaceDarken: 0, windowOpacity: 0.8, windowDarken: 0, surfaceHierarchy: "normal" },
};

// Hover configuration - primary swaps to secondary, accent-mid darkens in-family
// Mariana: Blue primary → Yellow/Orange secondary (cool→warm complement)
const hover: ThemeHoverConfig = {
  light: {
    primaryDarken: 30, // fallback
    accentMidDarken: 40,
    primaryHoverColor: "secondary",
  },
  dark: {
    primaryDarken: 10, // fallback
    accentMidDarken: 10, // fallback (uses accent-low-opacity)
    primaryHoverColor: "secondary-high",
  },
};

// Define tokens as standalone objects to enable swatch derivation
const lightTokens: ThemeColors = {
  // Base colors
  background: hexToRgb(marianaLight.bg), // #f7f9fb
  foreground: hexToRgb(marianaLight.fg), // #303841

  // Card colors
  // Light mode adjustment: #ffffff too stark against semi-transparent window
  // Using bgHighlight - darker with cool blue-gray tint matching theme character
  card: hexToRgb(marianaLight.bgHighlight), // #eef1f5
  "card-foreground": hexToRgb(marianaLight.fg),

  // Popover colors (same adjustment as card)
  popover: hexToRgb(marianaLight.bgHighlight), // #eef1f5
  "popover-foreground": hexToRgb(marianaLight.fg),

  // Primary colors (medium blue - signature)
  // A11Y: blue darkened 15% for WCAG AA (4.20 → 4.90)
  primary: hexToRgb(marianaA11y.blueDarkened15), // #2e6ba5
  "primary-foreground": hexToRgb("#ffffff"),

  // Secondary colors (yellow/orange - warm, workhorse interactive)
  // A11Y: yellow darkened 30% for WCAG AA (3.11 → 4.65)
  secondary: hexToRgb(marianaA11y.yellowDarkened30), // #8a5c21
  "secondary-foreground": hexToRgb("#ffffff"),

  // Muted colors
  // A11Y: fgMuted darkened for WCAG AA
  muted: hexToRgb(marianaLight.bgHighlight), // #eef1f5
  "muted-foreground": hexToRgb(marianaA11y.fgMutedDarkened10), // #5a6575

  // Default accent (teal/cyan - cool, occasional decorative)
  // A11Y: cyan darkened 25% for WCAG AA (3.35 → 4.70)
  accent: hexToRgb(marianaA11y.cyanDarkened25), // #2a7373
  "accent-foreground": hexToRgb("#ffffff"),

  // Decorative accent variants
  "accent-red": hexToRgb(marianaLight.red), // #c94048
  "accent-orange": hexToRgb(marianaLight.pink), // #c4602e
  "accent-green": hexToRgb(marianaLight.green), // #5a9a5a
  "accent-blue": hexToRgb(marianaLight.blue), // #3a7fc2
  "accent-purple": hexToRgb(marianaLight.purple), // #9a5a9a

  // Destructive colors
  destructive: hexToRgb(marianaLight.red), // #c94048
  "destructive-foreground": hexToRgb("#ffffff"),

  // UI element colors
  border: hexToRgb(marianaLight.border), // #dce1e8
  "border-strong": hexToRgb(marianaLight.borderStrong), // #c5cdd6
  input: hexToRgb(marianaLight.bgElevated),
  ring: hexToRgb(marianaLight.blue),

  // Shadow tokens
  "shadow-sm": "0 1px 2px rgba(48, 56, 65, 0.08)",
  "shadow-md": "0 2px 8px rgba(48, 56, 65, 0.12)",
  "shadow-lg": "0 4px 16px rgba(48, 56, 65, 0.16)",
};

const darkTokens: ThemeColors = {
  // Base colors
  background: hexToRgb(marianaDark.bg), // #303841
  foreground: hexToRgb(marianaDark.fg), // #d8dee9

  // Card colors
  card: hexToRgb(marianaDark.bgElevated), // #343d46
  "card-foreground": hexToRgb(marianaDark.fg),

  // Popover colors
  popover: hexToRgb(marianaDark.bgHighlight), // #3e4852
  "popover-foreground": hexToRgb(marianaDark.fg),

  // Primary colors (medium blue - signature)
  // A11Y: using bgDark for WCAG AA (4.26 → 5.10)
  primary: hexToRgb(marianaDark.blue), // #5c99d6
  "primary-foreground": hexToRgb(marianaDark.bgDark), // #1e252c

  // Secondary colors (yellow/orange - warm, workhorse interactive)
  secondary: hexToRgb(marianaDark.yellow), // #f9ae58
  "secondary-foreground": hexToRgb(marianaDark.bgDark),

  // Muted colors
  // A11Y: fgMuted lightened for WCAG AA
  muted: hexToRgb(marianaDark.bgElevated), // #343d46
  "muted-foreground": hexToRgb(marianaA11y.fgMutedLightened10), // #a5adb6

  // Default accent (teal/cyan - cool, occasional decorative)
  accent: hexToRgb(marianaDark.cyan), // #5fb4b4
  "accent-foreground": hexToRgb(marianaDark.bgDark),

  // Decorative accent variants
  "accent-red": hexToRgb(marianaDark.red), // #ec5f66
  "accent-orange": hexToRgb(marianaDark.pink), // #f97b58
  "accent-green": hexToRgb(marianaDark.green), // #99c794
  "accent-blue": hexToRgb(marianaDark.blue), // #5c99d6
  "accent-purple": hexToRgb(marianaDark.purple), // #c695c6

  // Destructive colors
  // A11Y: using bgDark for WCAG AA (3.90 → 4.70)
  destructive: hexToRgb(marianaDark.red), // #ec5f66
  "destructive-foreground": hexToRgb(marianaDark.bgDark),

  // UI element colors
  border: hexToRgb(marianaDark.border), // #4b5561
  "border-strong": hexToRgb(marianaDark.borderStrong), // #5a6572
  input: hexToRgb(marianaDark.bgElevated),
  ring: hexToRgb(marianaDark.blue),

  // Shadow tokens
  "shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.20)",
  "shadow-md": "0 2px 8px rgba(0, 0, 0, 0.24)",
  "shadow-lg": "0 4px 16px rgba(0, 0, 0, 0.32)",
};

export const marianaTheme: Theme = {
  name: "mariana",
  label: "Mariana",

  light: lightTokens,
  dark: darkTokens,

  // Default wallpaper for this theme
  defaultWallpaper: "diana-prundeanu",

  // Swatch colors derived from tokens - guarantees accuracy, prevents drift
  // Light mode passes surfaces config to apply surface-muted darkening to slot 0
  swatchColors: {
    light: deriveSwatchColors(lightTokens, surfaces.light),
    dark: deriveSwatchColors(darkTokens, surfaces.dark),
  },

  accentVariants: {
    default: "blue", // Blue is signature
    available: ["red", "orange", "green", "blue", "purple"],
  },

  // Neutral gradient for professional/minimal aesthetic
  // Uses only background tones instead of colorful accent/secondary
  gradientStops: [
    { token: "popover", position: "0%" },
    { token: "background", position: "50%" },
    { token: "foreground", position: "100%" },
  ],

  opacities,
  surfaces,
  hover,
} as const;
