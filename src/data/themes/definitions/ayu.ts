/**
 * Ayu Theme Definition
 *
 * Maps Ayu palette colors to shadcn/ui semantic roles.
 * Uses Mirage flavor for dark mode, Light flavor for light mode.
 *
 * **Semantic Mapping:**
 * - Primary: Yellow/Gold (Ayu's signature accent - #FFCC66)
 * - Secondary: Cyan (cool contrast, subtle - used sparingly)
 * - Default accent: Orange (main interactive color - links, focus, highlights)
 * - Destructive: Red
 *
 * **Design Philosophy:**
 * Ayu emphasizes comfortable, all-day use with warm golden tones.
 * The yellow primary makes it immediately distinctive from other themes.
 */

import { ayuMirage, ayuLight, ayuA11y } from "../palettes/ayu";
import type { Theme } from "../types";
import { hexToRgb } from "../utils";

export const ayuTheme: Theme = {
  name: "ayu",
  label: "Ayu",

  light: {
    // Base colors (Light variant)
    background: hexToRgb(ayuLight.bg), // #FCFCFC
    foreground: hexToRgb(ayuLight.fg), // #5C6166

    // Card colors
    card: hexToRgb(ayuLight.bgSecondary), // #F8F9FA
    "card-foreground": hexToRgb(ayuLight.fg),

    // Popover colors
    popover: hexToRgb(ayuLight.bgSecondary),
    "popover-foreground": hexToRgb(ayuLight.fg),

    // Primary colors (yellow/orange - Ayu signature)
    // A11Y: using bgDark as foreground for WCAG AA on bright yellow (7.56:1)
    primary: hexToRgb(ayuLight.accent), // #F29718
    "primary-foreground": hexToRgb(ayuMirage.bgDark), // #171B24

    // Secondary colors (cyan - cool contrast, used as workhorse interactive color)
    // A11Y: using bgDark as foreground for WCAG AA on cyan (7.27:1)
    secondary: hexToRgb(ayuLight.tag), // #55B4D4
    "secondary-foreground": hexToRgb(ayuMirage.bgDark), // #171B24

    // Muted colors
    // A11Y: fgMuted darkened 20% for WCAG AA (3.15 → 4.63)
    muted: hexToRgb(ayuLight.bgSecondary), // #F8F9FA
    "muted-foreground": hexToRgb(ayuA11y.fgMutedDarkened20), // #68727f

    // Default accent (orange - warm highlight, occasional decorative use)
    // A11Y: using bgDark as foreground for WCAG AA on bright orange (6.80:1)
    accent: hexToRgb(ayuLight.keyword), // #FF7E33
    "accent-foreground": hexToRgb(ayuMirage.bgDark), // #171B24

    // Decorative accent variants
    "accent-red": hexToRgb(ayuLight.markup), // #F07171
    "accent-orange": hexToRgb(ayuLight.keyword), // #FF7E33
    "accent-green": hexToRgb(ayuLight.string), // #86B300
    "accent-blue": hexToRgb(ayuLight.entity), // #399EE6
    "accent-purple": hexToRgb(ayuLight.constant), // #A37ACC

    // Destructive colors
    // A11Y: error darkened 15% for WCAG AA with white (3.73 → 4.93)
    destructive: hexToRgb(ayuA11y.errorDarkened15), // #c44444
    "destructive-foreground": hexToRgb("#FFFFFF"),

    // UI element colors
    border: hexToRgb("#E0E0E0"), // Derived: light gray border
    "border-strong": hexToRgb("#D0D0D0"), // Derived: stronger gray
    input: hexToRgb(ayuLight.bgSecondary),
    ring: hexToRgb(ayuLight.accent),

    // Shadow tokens
    "shadow-sm": "0 1px 2px rgba(92, 97, 102, 0.08)",
    "shadow-md": "0 2px 8px rgba(92, 97, 102, 0.12)",
    "shadow-lg": "0 4px 16px rgba(92, 97, 102, 0.16)",
  },

  dark: {
    // Base colors (Mirage variant)
    background: hexToRgb(ayuMirage.bg), // #1F2430
    foreground: hexToRgb(ayuMirage.fg), // #CCCAC2

    // Card colors
    card: hexToRgb(ayuMirage.panelBg), // #282E3B
    "card-foreground": hexToRgb(ayuMirage.fg),

    // Popover colors
    popover: hexToRgb(ayuMirage.panelBg),
    "popover-foreground": hexToRgb(ayuMirage.fg),

    // Primary colors (yellow - Ayu signature)
    primary: hexToRgb(ayuMirage.accent), // #FFCC66
    "primary-foreground": hexToRgb(ayuMirage.bgDark), // Dark bg for contrast

    // Secondary colors (cyan - cool contrast, used as workhorse interactive color)
    secondary: hexToRgb(ayuMirage.tag), // #5CCFE6
    "secondary-foreground": hexToRgb(ayuMirage.bgDark),

    // Muted colors
    // A11Y: fgMuted lightened 20% for WCAG AA (3.14 → 4.51)
    muted: hexToRgb(ayuMirage.panelBg), // #282E3B
    "muted-foreground": hexToRgb(ayuA11y.fgMutedLightened20), // #8d95a3

    // Default accent (orange - warm highlight, occasional decorative use)
    accent: hexToRgb(ayuMirage.keyword), // #FFAD66
    "accent-foreground": hexToRgb(ayuMirage.bgDark),

    // Decorative accent variants
    "accent-red": hexToRgb(ayuMirage.markup), // #F28779
    "accent-orange": hexToRgb(ayuMirage.keyword), // #FFAD66
    "accent-green": hexToRgb(ayuMirage.string), // #D5FF80
    "accent-blue": hexToRgb(ayuMirage.entity), // #73D0FF
    "accent-purple": hexToRgb(ayuMirage.constant), // #DFBFFF

    // Destructive colors
    destructive: hexToRgb(ayuMirage.error), // #FF6666
    "destructive-foreground": hexToRgb(ayuMirage.bgDark),

    // UI element colors
    border: hexToRgb("#454B5C"), // Derived: visible border (~+38 RGB from bg)
    "border-strong": hexToRgb("#555B6C"), // Derived: stronger border (~+54 RGB from bg)
    input: hexToRgb(ayuMirage.panelBg),
    ring: hexToRgb(ayuMirage.accent),

    // Shadow tokens
    "shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.20)",
    "shadow-md": "0 2px 8px rgba(0, 0, 0, 0.24)",
    "shadow-lg": "0 4px 16px rgba(0, 0, 0, 0.32)",
  },

  // Default wallpaper for this theme
  defaultWallpaper: "gradient",

  // Swatch colors for theme preview grid (semantic-weighted, diversified)
  // Slots: 0=Muted, 1=Primary, 2=Accent, 3=Secondary, 4-6=Others, 7=Foreground
  // Note: Accent at position 2 reflects its role as the dominant interactive color
  swatchColors: {
    light: [
      ayuLight.bgSecondary, // 0: Muted
      ayuLight.accent, // 1: Primary (yellow/orange)
      ayuLight.keyword, // 2: Accent (orange, main interactive color)
      ayuLight.tag, // 3: Secondary (cyan, subtle)
      ayuLight.markup, // 4: Other-1 (red)
      ayuLight.string, // 5: Other-2 (green)
      ayuLight.constant, // 6: Other-3 (purple)
      ayuLight.fg, // 7: Foreground
    ],
    dark: [
      ayuMirage.panelBg, // 0: Muted
      ayuMirage.accent, // 1: Primary (yellow)
      ayuMirage.keyword, // 2: Accent (orange, main interactive color)
      ayuMirage.tag, // 3: Secondary (cyan, subtle)
      ayuMirage.markup, // 4: Other-1 (red)
      ayuMirage.string, // 5: Other-2 (green)
      ayuMirage.constant, // 6: Other-3 (purple)
      ayuMirage.fg, // 7: Foreground
    ],
  },

  accentVariants: {
    default: "orange", // Yellow/orange family is signature
    available: ["red", "orange", "green", "blue", "purple"],
  },
} as const;
