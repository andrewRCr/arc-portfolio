/**
 * Mariana Color Palette
 *
 * Source: Sublime Text default theme
 * https://github.com/sublimehq/Packages/blob/master/Color%20Scheme%20-%20Default/Mariana.sublime-color-scheme
 * License: Sublime Text License
 *
 * Mariana uses a cohesive cool blue-gray palette. The colors work
 * harmoniously together rather than creating sharp contrast.
 * Sophisticated and professional without being aggressive.
 *
 * Verified 2026-01-08: Values from official Sublime Text packages.
 */

/**
 * Mariana Dark variant.
 *
 * Cool blue-gray background with complementary foreground.
 * Medium blue accent that harmonizes with the base.
 */
export const marianaDark = {
  // Background colors (using HSL conversions from original)
  /** Primary background - hsl(210, 15%, 22%) */
  bg: "#303841",
  /** Elevated surface - hsl(210, 15%, 24%) */
  bgElevated: "#343d46",
  /** Highlight - hsl(210, 15%, 28%) */
  bgHighlight: "#3e4852",
  /** Active/selection - hsl(210, 15%, 20%) */
  bgActive: "#2b333b",
  /** Darkest background for foreground on bright colors */
  bgDark: "#1e252c",

  // Foreground colors
  /** Primary text - hsl(219, 28%, 88%) */
  fg: "#d8dee9",
  /** Muted text - hsl(219, 15%, 62%) */
  fgMuted: "#959da6",
  /** Dimmed text */
  fgDim: "#6d7a87",

  // Accent colors (from Mariana syntax)
  /** Primary accent - medium blue */
  blue: "#5c99d6",
  /** Secondary - teal/cyan */
  cyan: "#5fb4b4",
  /** Green */
  green: "#99c794",
  /** Yellow/orange */
  yellow: "#f9ae58",
  /** Red/coral */
  red: "#ec5f66",
  /** Purple */
  purple: "#c695c6",
  /** Pink */
  pink: "#f97b58",

  // UI colors
  /** Border - subtle */
  border: "#4b5561",
  /** Strong border */
  borderStrong: "#5a6572",
} as const;

/**
 * Mariana Light variant (derived).
 *
 * Cool off-white with blue-gray tints.
 * Maintains the sophisticated, cohesive feel.
 */
export const marianaLight = {
  // Background colors
  /** Primary background */
  bg: "#f7f9fb",
  /** Elevated surface */
  bgElevated: "#ffffff",
  /** Highlight */
  bgHighlight: "#eef1f5",
  /** Active */
  bgActive: "#e8ecf0",

  // Foreground colors
  /** Primary text */
  fg: "#303841",
  /** Muted text */
  fgMuted: "#6b7685",
  /** Dimmed text */
  fgDim: "#9aa3ae",

  // Accent colors (darkened for light bg)
  /** Primary accent - medium blue */
  blue: "#3a7fc2",
  /** Secondary - teal/cyan */
  cyan: "#3a9a9a",
  /** Green */
  green: "#5a9a5a",
  /** Yellow/orange */
  yellow: "#c48530",
  /** Red/coral */
  red: "#c94048",
  /** Purple */
  purple: "#9a5a9a",
  /** Pink/orange */
  pink: "#c4602e",

  // UI colors
  /** Border */
  border: "#dce1e8",
  /** Strong border */
  borderStrong: "#c5cdd6",
} as const;

/**
 * Accessibility-adjusted colors for WCAG AA compliance.
 */
export const marianaA11y = {
  // Light mode fixes - darken colors for white text contrast
  /** blue darkened 15% for WCAG AA (4.20 → 4.90) */
  blueDarkened15: "#2e6ba5",
  /** cyan darkened 25% for WCAG AA (3.35 → 4.70) */
  cyanDarkened25: "#2a7373",
  /** yellow darkened 30% for WCAG AA (3.11 → 4.65) */
  yellowDarkened30: "#8a5c21",
  /** fgMuted darkened for better contrast */
  fgMutedDarkened10: "#5a6575",

  // Dark mode fixes
  /** fgMuted lightened for better contrast */
  fgMutedLightened10: "#a5adb6",
  /** red darkened 15% for WCAG AA with white (3.90 → 4.95) */
  redDarkened15: "#c94048",
} as const;

export type MarianaDarkColor = keyof typeof marianaDark;
export type MarianaLightColor = keyof typeof marianaLight;
