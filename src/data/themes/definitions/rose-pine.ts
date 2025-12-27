/**
 * Rosé Pine Theme Definition
 *
 * Maps Rosé Pine palette colors to shadcn/ui semantic roles.
 * Uses Main variant for dark mode, Dawn variant for light mode.
 */

import { rosePineMain, rosePineDawn } from "../palettes/rose-pine";
import type { Theme } from "../types";

/**
 * Convert hex color to RGB space-separated string for Tailwind.
 * Example: "#191724" → "25 23 36"
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
}

export const rosePineTheme: Theme = {
  name: "rose-pine",
  label: "Rosé Pine",

  light: {
    // Base colors (Dawn variant)
    background: hexToRgb(rosePineDawn.base), // #faf4ed
    foreground: hexToRgb(rosePineDawn.text), // #575279

    // Card colors
    card: hexToRgb(rosePineDawn.surface), // #fffaf3
    "card-foreground": hexToRgb(rosePineDawn.text),

    // Popover colors
    popover: hexToRgb(rosePineDawn.overlay), // #f2e9e1
    "popover-foreground": hexToRgb(rosePineDawn.text),

    // Primary colors (pine - teal accent)
    primary: hexToRgb(rosePineDawn.pine), // #286983
    "primary-foreground": hexToRgb(rosePineDawn.base),

    // Secondary colors (foam - cyan accent)
    secondary: hexToRgb(rosePineDawn.foam), // #56949f
    "secondary-foreground": hexToRgb(rosePineDawn.base),

    // Muted colors
    muted: hexToRgb(rosePineDawn.muted), // #9893a5
    "muted-foreground": hexToRgb(rosePineDawn.subtle), // #797593

    // Default accent (rose - mauve accent)
    accent: hexToRgb(rosePineDawn.rose), // #d7827e
    "accent-foreground": hexToRgb(rosePineDawn.base),

    // Accent variants
    "accent-blue": hexToRgb(rosePineDawn.pine), // #286983 (teal as blue)
    "accent-blue-foreground": hexToRgb(rosePineDawn.base),
    "accent-purple": hexToRgb(rosePineDawn.iris), // #907aa9
    "accent-purple-foreground": hexToRgb(rosePineDawn.base),
    "accent-orange": hexToRgb(rosePineDawn.gold), // #ea9d34
    "accent-orange-foreground": hexToRgb(rosePineDawn.base),

    // Destructive colors
    destructive: hexToRgb(rosePineDawn.love), // #b4637a
    "destructive-foreground": hexToRgb(rosePineDawn.base),

    // UI element colors
    border: hexToRgb(rosePineDawn.highlight_med), // #dfdad9
    input: hexToRgb(rosePineDawn.surface),
    ring: hexToRgb(rosePineDawn.pine),

    // Semantic layer tokens (alternating pattern for light mode)
    "layer-01": hexToRgb(rosePineDawn.surface), // #fffaf3 (≈ card)
    "layer-02": hexToRgb(rosePineDawn.overlay), // #f2e9e1 (≈ popover)
    "layer-03": hexToRgb(rosePineDawn.highlight_low), // #f4ede8

    // Semantic border tokens
    "border-subtle": hexToRgb(rosePineDawn.highlight_med), // #dfdad9 (≈ border)
    "border-strong": hexToRgb(rosePineDawn.highlight_high), // #cecacd (higher contrast)

    // Interactive state tokens
    "layer-hover-01": hexToRgb(rosePineDawn.highlight_low), // #f4ede8
    "layer-hover-02": hexToRgb(rosePineDawn.highlight_med), // #dfdad9
    "layer-active-01": hexToRgb(rosePineDawn.highlight_med), // #dfdad9
    "layer-active-02": hexToRgb(rosePineDawn.highlight_high), // #cecacd

    // Shadow tokens
    "shadow-sm": "0 1px 2px rgba(87, 82, 121, 0.08)",
    "shadow-md": "0 2px 8px rgba(87, 82, 121, 0.12)",
    "shadow-lg": "0 4px 16px rgba(87, 82, 121, 0.16)",
  },

  dark: {
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
    primary: hexToRgb(rosePineMain.pine), // #31748f
    "primary-foreground": hexToRgb(rosePineMain.base),

    // Secondary colors (foam - cyan accent)
    secondary: hexToRgb(rosePineMain.foam), // #9ccfd8
    "secondary-foreground": hexToRgb(rosePineMain.base),

    // Muted colors
    muted: hexToRgb(rosePineMain.muted), // #6e6a86
    "muted-foreground": hexToRgb(rosePineMain.subtle), // #908caa

    // Default accent (rose - mauve accent)
    accent: hexToRgb(rosePineMain.rose), // #ebbcba
    "accent-foreground": hexToRgb(rosePineMain.base),

    // Accent variants
    "accent-blue": hexToRgb(rosePineMain.pine), // #31748f (teal as blue)
    "accent-blue-foreground": hexToRgb(rosePineMain.base),
    "accent-purple": hexToRgb(rosePineMain.iris), // #c4a7e7
    "accent-purple-foreground": hexToRgb(rosePineMain.base),
    "accent-orange": hexToRgb(rosePineMain.gold), // #f6c177
    "accent-orange-foreground": hexToRgb(rosePineMain.base),

    // Destructive colors
    destructive: hexToRgb(rosePineMain.love), // #eb6f92
    "destructive-foreground": hexToRgb(rosePineMain.base),

    // UI element colors
    border: hexToRgb(rosePineMain.highlight_med), // #403d52
    input: hexToRgb(rosePineMain.surface),
    ring: hexToRgb(rosePineMain.pine),

    // Semantic layer tokens (progressive lightening for dark mode)
    "layer-01": hexToRgb(rosePineMain.surface), // #1f1d2e (≈ card)
    "layer-02": hexToRgb(rosePineMain.overlay), // #26233a (≈ popover)
    "layer-03": hexToRgb(rosePineMain.highlight_med), // #403d52 (lighter)

    // Semantic border tokens
    "border-subtle": hexToRgb(rosePineMain.highlight_med), // #403d52 (≈ border)
    "border-strong": hexToRgb(rosePineMain.highlight_high), // #524f67 (higher contrast)

    // Interactive state tokens
    "layer-hover-01": hexToRgb(rosePineMain.highlight_low), // #21202e
    "layer-hover-02": hexToRgb(rosePineMain.highlight_med), // #403d52
    "layer-active-01": hexToRgb(rosePineMain.highlight_med), // #403d52
    "layer-active-02": hexToRgb(rosePineMain.highlight_high), // #524f67

    // Shadow tokens
    "shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.16)",
    "shadow-md": "0 2px 8px rgba(0, 0, 0, 0.24)",
    "shadow-lg": "0 4px 16px rgba(0, 0, 0, 0.32)",
  },

  accentVariants: {
    default: "aqua", // Using "aqua" as alias for pine (teal)
    available: ["aqua", "blue", "purple", "orange"],
  },
} as const;
