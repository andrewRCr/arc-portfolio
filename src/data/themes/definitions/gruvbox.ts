/**
 * Gruvbox Theme Definition
 *
 * Maps Gruvbox palette colors to shadcn/ui semantic roles.
 * Supports light and dark modes with extended accent variants.
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
import type { Theme } from "../types";
import { hexToRgb } from "../utils";

export const gruvboxTheme: Theme = {
  name: "gruvbox",
  label: "Gruvbox",

  light: {
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
    // A11Y: foreground changed from dark1 to dark0 for WCAG AA (4.65:1)
    accent: hexToRgb(p.neutral_aqua), // #689d6a
    "accent-foreground": hexToRgb(p.dark0), // #282828

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
  },

  dark: {
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

    // Secondary colors (yellow - vibrant complement)
    secondary: hexToRgb(p.bright_yellow), // #fabd2f
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
  },

  // Default wallpaper for this theme
  defaultWallpaper: "gradient",

  // Swatch colors for theme preview grid (semantic-weighted, diversified)
  // Slots: 0=Muted, 1=Primary, 2=Secondary, 3=Accent, 4-6=Others, 7=Foreground
  swatchColors: {
    light: [
      p.light1, // 0: Muted
      p.faded_green, // 1: Primary (visually lime)
      p.faded_orange, // 2: Secondary
      p.faded_aqua, // 3: Accent (visually mint)
      p.faded_red, // 4: Other-1
      p.faded_blue, // 5: Other-2 (visually teal)
      p.faded_purple, // 6: Other-3
      p.dark1, // 7: Foreground
    ],
    dark: [
      p.dark1, // 0: Muted
      p.bright_green, // 1: Primary (visually lime)
      p.bright_orange, // 2: Secondary
      p.bright_aqua, // 3: Accent (visually mint)
      p.bright_red, // 4: Other-1
      p.bright_blue, // 5: Other-2 (visually teal)
      p.bright_purple, // 6: Other-3
      p.light1, // 7: Foreground
    ],
  },

  accentVariants: {
    // Variant names map to accent-{name} tokens. "green" = accent-green (lime/yellow-green).
    // Base "accent" token uses Gruvbox "aqua" (mint) - see accent token definitions above.
    default: "green",
    available: ["red", "orange", "green", "blue", "purple"],
  },
} as const;
