/**
 * Rosé Pine Theme Definition
 *
 * Maps Rosé Pine palette colors to shadcn/ui semantic roles.
 * Uses Main variant for dark mode, Dawn variant for light mode.
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
    // A11Y: love darkened 10% for WCAG AA (4.59:1)
    destructive: hexToRgb(rosePineA11y.love_dark), // #A2596E (original: #b4637a)
    "destructive-foreground": hexToRgb(rosePineDawn.base),

    // UI element colors
    border: hexToRgb(rosePineDawn.highlight_med), // #dfdad9
    input: hexToRgb(rosePineDawn.surface),
    ring: hexToRgb(rosePineDawn.pine),

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
    input: hexToRgb(rosePineMain.surface),
    ring: hexToRgb(rosePineMain.pine),

    // Shadow tokens
    "shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.20)",
    "shadow-md": "0 2px 8px rgba(0, 0, 0, 0.24)",
    "shadow-lg": "0 4px 16px rgba(0, 0, 0, 0.32)",
  },

  accentVariants: {
    default: "red", // Rose Pine signature is rose/love (mauve-red)
    available: ["red", "orange", "green", "blue", "purple"],
  },
} as const;
