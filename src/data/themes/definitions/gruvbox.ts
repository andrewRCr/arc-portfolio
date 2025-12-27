/**
 * Gruvbox Theme Definition
 *
 * Maps Gruvbox palette colors to shadcn/ui semantic roles.
 * Supports light and dark modes with extended accent variants.
 */

import { gruvboxPalette as p } from "../palettes/gruvbox";
import type { Theme } from "../types";

/**
 * Convert hex color to RGB space-separated string for Tailwind.
 * Example: "#fbf1c7" → "251 241 199"
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
}

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
    primary: hexToRgb(p.faded_green), // #79740e
    "primary-foreground": hexToRgb(p.light0),

    // Secondary colors (orange - warm accent)
    secondary: hexToRgb(p.faded_orange), // #af3a03
    "secondary-foreground": hexToRgb(p.light0),

    // Muted colors
    muted: hexToRgb(p.light1), // #ebdbb2
    "muted-foreground": hexToRgb(p.dark3), // #665c54

    // Default accent (aqua - cool contrast)
    accent: hexToRgb(p.neutral_aqua), // #689d6a
    "accent-foreground": hexToRgb(p.dark1),

    // Accent variants (all faded for light mode)
    "accent-blue": hexToRgb(p.faded_blue), // #076678
    "accent-blue-foreground": hexToRgb(p.light0),
    "accent-purple": hexToRgb(p.faded_purple), // #8f3f71
    "accent-purple-foreground": hexToRgb(p.light0),
    "accent-orange": hexToRgb(p.faded_orange), // #af3a03
    "accent-orange-foreground": hexToRgb(p.light0),

    // Destructive colors
    destructive: hexToRgb(p.faded_red), // #9d0006
    "destructive-foreground": hexToRgb(p.light0),

    // UI element colors
    border: hexToRgb(p.light2), // #d5c4a1
    input: hexToRgb(p.light2),
    ring: hexToRgb(p.faded_green),

    // Semantic layer tokens (alternating pattern for light mode)
    "layer-01": hexToRgb(p.light0_hard), // #f9f5d7 (≈ card)
    "layer-02": hexToRgb(p.light0), // #fbf1c7 (modals use shadows)
    "layer-03": hexToRgb(p.light0_hard), // #f9f5d7

    // Semantic border tokens
    "border-subtle": hexToRgb(p.light2), // #d5c4a1 (≈ border)
    "border-strong": hexToRgb(p.light3), // #bdae93 (higher contrast)

    // Interactive state tokens
    "layer-hover-01": hexToRgb(p.light1), // #ebdbb2 (slightly darker)
    "layer-hover-02": hexToRgb(p.light0_soft), // #f2e5bc
    "layer-active-01": hexToRgb(p.light2), // #d5c4a1 (more pronounced)
    "layer-active-02": hexToRgb(p.light1), // #ebdbb2

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
    muted: hexToRgb(p.dark1), // #3c3836
    "muted-foreground": hexToRgb(p.light4), // #a89984

    // Default accent (aqua - cool contrast)
    accent: hexToRgb(p.bright_aqua), // #8ec07c
    "accent-foreground": hexToRgb(p.dark0),

    // Accent variants (all bright for dark mode)
    "accent-blue": hexToRgb(p.bright_blue), // #83a598
    "accent-blue-foreground": hexToRgb(p.dark0),
    "accent-purple": hexToRgb(p.bright_purple), // #d3869b
    "accent-purple-foreground": hexToRgb(p.dark0),
    "accent-orange": hexToRgb(p.bright_orange), // #fe8019
    "accent-orange-foreground": hexToRgb(p.dark0),

    // Destructive colors
    destructive: hexToRgb(p.bright_red), // #fb4934
    "destructive-foreground": hexToRgb(p.dark0),

    // UI element colors
    border: hexToRgb(p.dark2), // #504945
    input: hexToRgb(p.dark2),
    ring: hexToRgb(p.bright_green),

    // Semantic layer tokens (progressive lightening for dark mode)
    "layer-01": hexToRgb(p.dark0_soft), // #32302f (≈ card)
    "layer-02": hexToRgb(p.dark1), // #3c3836 (lighter)
    "layer-03": hexToRgb(p.dark2), // #504945 (even lighter)

    // Semantic border tokens
    "border-subtle": hexToRgb(p.dark2), // #504945 (≈ border)
    "border-strong": hexToRgb(p.dark3), // #665c54 (higher contrast)

    // Interactive state tokens
    "layer-hover-01": hexToRgb(p.dark1), // #3c3836 (slightly lighter)
    "layer-hover-02": hexToRgb(p.dark2), // #504945
    "layer-active-01": hexToRgb(p.dark2), // #504945 (more pronounced)
    "layer-active-02": hexToRgb(p.dark3), // #665c54

    // Shadow tokens
    "shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.16)",
    "shadow-md": "0 2px 8px rgba(0, 0, 0, 0.24)",
    "shadow-lg": "0 4px 16px rgba(0, 0, 0, 0.32)",
  },

  accentVariants: {
    default: "aqua",
    available: ["aqua", "blue", "purple", "orange"],
  },
} as const;
