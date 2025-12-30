/**
 * Official Gruvbox Color Palette
 *
 * Source: https://github.com/morhetz/gruvbox
 * Author: Pavel Pertsev (morhetz)
 * License: MIT
 *
 * Gruvbox is a retro groove color scheme with warm, earthy tones designed
 * for comfortable long-term use. Features three contrast variants (faded,
 * neutral, bright) for each accent color to optimize readability across
 * light and dark backgrounds.
 *
 * Verified 2025-10-25: All hex values match official palette specification.
 */

/**
 * Complete Gruvbox color palette with all official colors.
 *
 * Structure:
 * - Dark backgrounds (dark0_hard → dark4): Progressively lighter grays
 * - Light backgrounds (light0_hard → light4): Progressively darker beiges
 * - Bright accents: Vibrant colors for dark backgrounds
 * - Neutral accents: Medium contrast for flexible usage
 * - Faded accents: Subtle colors for light backgrounds
 */
export const gruvboxPalette = {
  // Dark mode backgrounds (darkest → lightest)
  /** Hardest contrast dark background */
  dark0_hard: "#1d2021",
  /** Primary dark background */
  dark0: "#282828",
  /** Softer dark background */
  dark0_soft: "#32302f",
  /** Dark gray 1 */
  dark1: "#3c3836",
  /** Dark gray 2 */
  dark2: "#504945",
  /** Dark gray 3 */
  dark3: "#665c54",
  /** Dark gray 4 */
  dark4: "#7c6f64",

  // Light mode backgrounds (lightest → darkest)
  /** Hardest contrast light background */
  light0_hard: "#f9f5d7",
  /** Primary light background */
  light0: "#fbf1c7",
  /** Softer light background */
  light0_soft: "#f2e5bc",
  /** Light beige 1 */
  light1: "#ebdbb2",
  /** Light beige 2 */
  light2: "#d5c4a1",
  /** Light beige 3 */
  light3: "#bdae93",
  /** Light beige 4 */
  light4: "#a89984",

  // Neutral gray
  /** Mid-tone gray */
  gray: "#928374",

  // Bright accent colors (for dark backgrounds)
  /** Bright red */
  bright_red: "#fb4934",
  /** Bright green */
  bright_green: "#b8bb26",
  /** Bright yellow */
  bright_yellow: "#fabd2f",
  /** Bright blue */
  bright_blue: "#83a598",
  /** Bright purple */
  bright_purple: "#d3869b",
  /** Bright aqua/teal */
  bright_aqua: "#8ec07c",
  /** Bright orange */
  bright_orange: "#fe8019",

  // Neutral accent colors (medium contrast)
  /** Neutral red */
  neutral_red: "#cc241d",
  /** Neutral green */
  neutral_green: "#98971a",
  /** Neutral yellow */
  neutral_yellow: "#d79921",
  /** Neutral blue */
  neutral_blue: "#458588",
  /** Neutral purple */
  neutral_purple: "#b16286",
  /** Neutral aqua/teal */
  neutral_aqua: "#689d6a",
  /** Neutral orange */
  neutral_orange: "#d65d0e",

  // Faded accent colors (for light backgrounds)
  /** Faded red */
  faded_red: "#9d0006",
  /** Faded green */
  faded_green: "#79740e",
  /** Faded yellow */
  faded_yellow: "#b57614",
  /** Faded blue */
  faded_blue: "#076678",
  /** Faded purple */
  faded_purple: "#8f3f71",
  /** Faded aqua/teal */
  faded_aqua: "#427b58",
  /** Faded orange */
  faded_orange: "#af3a03",
} as const;

/**
 * Accessibility-adjusted colors for WCAG AA compliance.
 *
 * These are minimal adjustments to original palette colors where
 * no in-palette combination achieves 4.5:1 contrast ratio.
 */
export const gruvboxA11y = {
  /** Faded green darkened 5% for light0 contrast (4.29 → 4.67) */
  faded_green_dark: "#736E0D", // Original: #79740e
} as const;

/**
 * Type-safe palette color names.
 * Use for referencing palette colors with TypeScript autocomplete.
 */
export type GruvboxColor = keyof typeof gruvboxPalette;
export type GruvboxA11yColor = keyof typeof gruvboxA11y;
