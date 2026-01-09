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
import type { Theme } from "../types";
import { hexToRgb } from "../utils";

export const marianaTheme: Theme = {
  name: "mariana",
  label: "Mariana",

  light: {
    // Base colors
    background: hexToRgb(marianaLight.bg), // #f7f9fb
    foreground: hexToRgb(marianaLight.fg), // #303841

    // Card colors
    card: hexToRgb(marianaLight.bgElevated), // #ffffff
    "card-foreground": hexToRgb(marianaLight.fg),

    // Popover colors
    popover: hexToRgb(marianaLight.bgElevated),
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
  },

  dark: {
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
  },

  // Default wallpaper for this theme
  defaultWallpaper: "diana-prundeanu",

  // Swatch colors for theme preview grid (semantic-weighted, diversified)
  // Slots: 0=Muted, 1=Primary, 2=Accent, 3=Secondary, 4-6=Others, 7=Foreground
  // Note: Accent at position 2 reflects its role as the dominant interactive color
  swatchColors: {
    light: [
      marianaLight.bgHighlight, // 0: Muted
      marianaLight.blue, // 1: Primary (blue)
      marianaLight.cyan, // 2: Accent (cyan, main interactive color)
      marianaLight.yellow, // 3: Secondary (yellow, subtle)
      marianaLight.red, // 4: Other-1 (red)
      marianaLight.green, // 5: Other-2 (green)
      marianaLight.purple, // 6: Other-3 (purple)
      marianaLight.fg, // 7: Foreground
    ],
    dark: [
      marianaDark.bgElevated, // 0: Muted
      marianaDark.blue, // 1: Primary (blue)
      marianaDark.cyan, // 2: Accent (cyan, main interactive color)
      marianaDark.yellow, // 3: Secondary (yellow, subtle)
      marianaDark.red, // 4: Other-1 (red)
      marianaDark.green, // 5: Other-2 (green)
      marianaDark.purple, // 6: Other-3 (purple)
      marianaDark.fg, // 7: Foreground
    ],
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
} as const;
