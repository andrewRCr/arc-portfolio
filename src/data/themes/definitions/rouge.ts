/**
 * Rouge Theme Definition
 *
 * Maps Rouge palette colors to shadcn/ui semantic roles.
 * Uses Dark variant for dark mode, derived Light variant for light mode.
 *
 * **Semantic Mapping:**
 * - Primary: Rouge (signature muted red - #c6797e)
 * - Secondary: Blue (muted, subtle - rarely used in portfolio)
 * - Default accent: Peach/yellow (warm complement - heavily used)
 * - Destructive: Rouge error variant
 *
 * **Design Philosophy:**
 * Rouge emphasizes an industrial, restrained aesthetic. The muted red
 * pairs with warm peach/yellow tones as the dominant accent colors,
 * with blue as a subtle secondary. This creates a cohesive, professional
 * look distinct from vibrant red themes.
 */

import { rougeDark, rougeLight, rougeA11y } from "../palettes/rouge";
import type { Theme } from "../types";
import { hexToRgb } from "../utils";

export const rougeTheme: Theme = {
  name: "rouge",
  label: "Rouge",

  light: {
    // Base colors (Light variant)
    background: hexToRgb(rougeLight.bg), // #f8f6f4
    foreground: hexToRgb(rougeLight.fg), // #2d3748

    // Card colors
    card: hexToRgb(rougeLight.bgElevated), // #ffffff
    "card-foreground": hexToRgb(rougeLight.fg),

    // Popover colors
    popover: hexToRgb(rougeLight.bgElevated),
    "popover-foreground": hexToRgb(rougeLight.fg),

    // Primary colors (rouge - signature)
    primary: hexToRgb(rougeLight.rouge), // #9c4a50
    "primary-foreground": hexToRgb("#ffffff"),

    // Secondary colors (blue - muted, subtle)
    secondary: hexToRgb(rougeLight.blue), // #4a7a8f
    "secondary-foreground": hexToRgb("#ffffff"),

    // Muted colors
    // A11Y: fgMuted darkened 10% for WCAG AA (3.91 → 4.60)
    muted: hexToRgb(rougeLight.bgFocus), // #e8e4e0
    "muted-foreground": hexToRgb(rougeA11y.fgMutedDarkened10), // #5a6771

    // Default accent (peach - warm complement, heavily used)
    // A11Y: peach darkened 5% for WCAG AA (4.29 → 4.69)
    accent: hexToRgb(rougeA11y.peachDarkened5), // #926d3d
    "accent-foreground": hexToRgb("#ffffff"),

    // Decorative accent variants
    "accent-red": hexToRgb(rougeLight.rouge), // #9c4a50
    "accent-orange": hexToRgb(rougeLight.peach), // #9a7340
    "accent-green": hexToRgb(rougeLight.green), // #4a6741
    "accent-blue": hexToRgb(rougeLight.blue), // #4a7a8f
    "accent-purple": hexToRgb(rougeLight.purple), // #7c5a7c

    // Destructive colors
    destructive: hexToRgb(rougeLight.rougeError), // #a33d44
    "destructive-foreground": hexToRgb("#ffffff"),

    // UI element colors
    border: hexToRgb(rougeLight.border), // #d1d5db
    "border-strong": hexToRgb(rougeLight.borderStrong), // #9ca3af
    input: hexToRgb(rougeLight.bgElevated),
    ring: hexToRgb(rougeLight.rouge),

    // Shadow tokens
    "shadow-sm": "0 1px 2px rgba(45, 55, 72, 0.08)",
    "shadow-md": "0 2px 8px rgba(45, 55, 72, 0.12)",
    "shadow-lg": "0 4px 16px rgba(45, 55, 72, 0.16)",
  },

  dark: {
    // Base colors (Dark variant)
    background: hexToRgb(rougeDark.bg), // #172030
    foreground: hexToRgb(rougeDark.fg), // #bbbbbb

    // Card colors
    card: hexToRgb(rougeDark.bgElevated), // #1e2a3d
    "card-foreground": hexToRgb(rougeDark.fg),

    // Popover colors
    popover: hexToRgb(rougeDark.bgFocus), // #293a57
    "popover-foreground": hexToRgb(rougeDark.fg),

    // Primary colors (rouge - signature)
    primary: hexToRgb(rougeDark.rouge), // #c6797e
    "primary-foreground": hexToRgb(rougeDark.bg),

    // Secondary colors (blue - muted, subtle)
    secondary: hexToRgb(rougeDark.blue), // #7eb2c9
    "secondary-foreground": hexToRgb(rougeDark.bg),

    // Muted colors
    muted: hexToRgb(rougeDark.bgElevated), // #1e2a3d
    "muted-foreground": hexToRgb(rougeDark.fgMuted), // #A7ACB9

    // Default accent (peach - warm complement, heavily used)
    accent: hexToRgb(rougeDark.peach), // #eabe9a
    "accent-foreground": hexToRgb(rougeDark.bg),

    // Decorative accent variants
    "accent-red": hexToRgb(rougeDark.rouge), // #c6797e
    "accent-orange": hexToRgb(rougeDark.peach), // #eabe9a
    "accent-green": hexToRgb(rougeDark.green), // #A3B09A
    "accent-blue": hexToRgb(rougeDark.blue), // #7eb2c9
    "accent-purple": hexToRgb(rougeDark.purple), // #b18bb1

    // Destructive colors
    // A11Y: rougeError darkened 10% for WCAG AA with white (2.16 → 4.96)
    destructive: hexToRgb(rougeA11y.rougeErrorDarkened10), // #b84d55
    "destructive-foreground": hexToRgb("#ffffff"),

    // UI element colors
    border: hexToRgb(rougeDark.borderDark), // #4a5568
    "border-strong": hexToRgb(rougeDark.border), // #758095
    input: hexToRgb(rougeDark.bgElevated),
    ring: hexToRgb(rougeDark.rouge),

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
      rougeLight.bgFocus, // 0: Muted
      rougeLight.rouge, // 1: Primary (rouge)
      rougeLight.peach, // 2: Accent (peach, main interactive color)
      rougeLight.blue, // 3: Secondary (blue, subtle)
      rougeLight.green, // 4: Other-1
      rougeLight.yellow, // 5: Other-2
      rougeLight.purple, // 6: Other-3
      rougeLight.fg, // 7: Foreground
    ],
    dark: [
      rougeDark.bgElevated, // 0: Muted
      rougeDark.rouge, // 1: Primary (rouge)
      rougeDark.peach, // 2: Accent (peach, main interactive color)
      rougeDark.blue, // 3: Secondary (blue, subtle)
      rougeDark.green, // 4: Other-1
      rougeDark.yellow, // 5: Other-2
      rougeDark.purple, // 6: Other-3
      rougeDark.fg, // 7: Foreground
    ],
  },

  accentVariants: {
    default: "red", // Rouge is signature
    available: ["red", "orange", "green", "blue", "purple"],
  },
} as const;
