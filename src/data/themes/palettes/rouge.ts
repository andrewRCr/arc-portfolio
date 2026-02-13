/**
 * Rouge Theme Color Palette
 *
 * Source: https://github.com/josefaidt/rouge-theme
 * License: MIT
 *
 * Rouge is a dark theme with muted, earthy tones emphasizing a desaturated
 * red ("rouge") accent. The palette is industrial and restrained, pairing
 * the signature rouge with cool blue-grays.
 *
 * Verified 2026-01-08: Values from official rouge-theme.json.
 */

/**
 * Rouge Dark variant.
 *
 * Industrial dark theme with navy background and muted rouge accents.
 * Primary variant for dark mode implementation.
 */
export const rougeDark = {
  // Background colors
  /** Primary background - dark navy */
  bg: "#172030",
  /** Elevated background - slightly lighter */
  bgElevated: "#1e2a3d",
  /** Focus/selection background */
  bgFocus: "#293a57",

  // Foreground colors
  /** Primary text - light gray */
  fg: "#bbbbbb",
  /** Muted text - soft gray-blue */
  fgMuted: "#A7ACB9",
  /** Comments - darker gray */
  fgComment: "#64727d",

  // Rouge accent family (signature)
  /** Primary rouge - muted red */
  rouge: "#c6797e",
  /** Error rouge - darker variant */
  rougeError: "#CC565E",
  /** Bright red accent */
  rougeBright: "#d19498",

  // Neutral grays
  /** Border/focus color - muted gray-blue */
  border: "#758095",
  /** Darker border */
  borderDark: "#4a5568",

  // Syntax colors
  /** Green - strings */
  green: "#A3B09A",
  /** Purple - keywords */
  purple: "#b18bb1",
  /** Peach - constants */
  peach: "#eabe9a",
  /** Yellow - entity names */
  yellow: "#F7E3AF",
  /** Blue - functions */
  blue: "#7eb2c9",
  /** Teal - selection (with transparency) */
  teal: "#91d1bd",
} as const;

/**
 * Rouge Light variant.
 *
 * Derived light variant maintaining the industrial character.
 * Uses warm off-white background with darker rouge accents.
 *
 * Note: Rouge doesn't have an official light variant, so this is derived
 * to maintain palette consistency while ensuring readability.
 */
export const rougeLight = {
  // Background colors
  /** Primary background - warm off-white */
  bg: "#f8f6f4",
  /** Elevated background */
  bgElevated: "#ffffff",
  /** Focus/selection background */
  bgFocus: "#e8e4e0",

  // Foreground colors
  /** Primary text - dark gray */
  fg: "#2d3748",
  /** Muted text */
  fgMuted: "#64727d",
  /** Comments */
  fgComment: "#8a9199",

  // Rouge accent family (darkened for light mode)
  /** Primary rouge - darkened for contrast */
  rouge: "#9c4a50",
  /** Error rouge */
  rougeError: "#a33d44",
  /** Bright rouge */
  rougeBright: "#b85a61",

  // Neutral grays
  /** Border color */
  border: "#d1d5db",
  /** Stronger border */
  borderStrong: "#9ca3af",

  // Syntax colors (darkened for light mode)
  /** Green */
  green: "#4a6741",
  /** Purple */
  purple: "#7c5a7c",
  /** Peach */
  peach: "#9a7340",
  /** Yellow - muted gold */
  yellow: "#8a7030",
  /** Blue */
  blue: "#4a7a8f",
  /** Teal */
  teal: "#4a8a7a",
} as const;

/**
 * Accessibility-adjusted colors for WCAG AA compliance.
 *
 * Rouge's muted tones need minor adjustments for proper contrast ratios.
 */
export const rougeA11y = {
  // Light mode fixes
  /** Peach darkened 5% for white text contrast (4.29 → 4.69) */
  peachDarkened5: "#926d3d",
  /** FgMuted darkened 10% for bgFocus contrast (3.91 → 4.60) */
  fgMutedDarkened10: "#5a6771",

  // Dark mode fixes
  /** RougeError darkened 7% — balances white text contrast (4.69) + surface-muted contrast */
  rougeErrorDarkened7: "#BE5058",
} as const;

/**
 * Type-safe palette color names.
 */
export type RougeDarkColor = keyof typeof rougeDark;
export type RougeLightColor = keyof typeof rougeLight;
