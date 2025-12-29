/**
 * Official Rosé Pine Color Palette
 *
 * Source: https://github.com/rose-pine/rose-pine-theme
 * Website: https://rosepinetheme.com/
 * License: MIT
 *
 * "All natural pine, faux fur and a bit of soho vibes for the classy minimalist."
 *
 * Rosé Pine is a minimalist color theme emphasizing visual calm and elegant
 * aesthetics. Features three variants (main, moon, dawn) with semantic color
 * roles (base, surface, overlay) and six primary accent colors representing
 * natural elements.
 *
 * Verified 2025-10-25: All hex values match official palette specification.
 */

/**
 * Rosé Pine Main variant (default dark theme).
 *
 * Balanced dark theme with measured contrast for comfortable viewing.
 * Primary variant for dark mode implementation.
 */
export const rosePineMain = {
  /** Canvas background (darkest) */
  _nc: "#16141f",
  /** Primary background */
  base: "#191724",
  /** Secondary background (cards, panels) */
  surface: "#1f1d2e",
  /** Tertiary background (popovers, temporary elements) */
  overlay: "#26233a",
  /** Muted/disabled text */
  muted: "#6e6a86",
  /** Secondary/subtle text */
  subtle: "#908caa",
  /** Primary foreground text */
  text: "#e0def4",

  // Accent colors
  /** Red accent (errors, critical states) */
  love: "#eb6f92",
  /** Yellow/orange accent (warnings) */
  gold: "#f6c177",
  /** Mauve/pink accent */
  rose: "#ebbcba",
  /** Teal/cyan accent (primary information) */
  pine: "#31748f",
  /** Light cyan accent */
  foam: "#9ccfd8",
  /** Purple/violet accent */
  iris: "#c4a7e7",
  /** Green accent */
  leaf: "#95b1ac",

  // Highlight levels
  /** Low emphasis highlight */
  highlight_low: "#21202e",
  /** Medium emphasis highlight */
  highlight_med: "#403d52",
  /** High emphasis highlight */
  highlight_high: "#524f67",
} as const;

/**
 * Rosé Pine Moon variant (high contrast dark theme).
 *
 * Highest contrast variant for low-light environments.
 * Optional alternative to Main for users preferring stronger contrast.
 */
export const rosePineMoon = {
  /** Canvas background (darkest) */
  _nc: "#1f1d30",
  /** Primary background */
  base: "#232136",
  /** Secondary background (cards, panels) */
  surface: "#2a273f",
  /** Tertiary background (popovers, temporary elements) */
  overlay: "#393552",
  /** Muted/disabled text */
  muted: "#6e6a86",
  /** Secondary/subtle text */
  subtle: "#908caa",
  /** Primary foreground text */
  text: "#e0def4",

  // Accent colors (adjusted for moon contrast)
  /** Red accent (errors, critical states) */
  love: "#eb6f92",
  /** Yellow/orange accent (warnings) */
  gold: "#f6c177",
  /** Mauve/pink accent */
  rose: "#ea9a97",
  /** Teal/cyan accent (primary information) */
  pine: "#3e8fb0",
  /** Light cyan accent */
  foam: "#9ccfd8",
  /** Purple/violet accent */
  iris: "#c4a7e7",
  /** Green accent */
  leaf: "#95b1ac",

  // Highlight levels
  /** Low emphasis highlight */
  highlight_low: "#2a283e",
  /** Medium emphasis highlight */
  highlight_med: "#44415a",
  /** High emphasis highlight */
  highlight_high: "#56526e",
} as const;

/**
 * Rosé Pine Dawn variant (light theme).
 *
 * Light theme optimized for bright environments with slightly desaturated
 * text colors to reduce eye strain. Primary variant for light mode.
 */
export const rosePineDawn = {
  /** Canvas background (lightest) */
  _nc: "#f8f0e7",
  /** Primary background */
  base: "#faf4ed",
  /** Secondary background (cards, panels) */
  surface: "#fffaf3",
  /** Tertiary background (popovers, temporary elements) */
  overlay: "#f2e9e1",
  /** Muted/disabled text */
  muted: "#9893a5",
  /** Secondary/subtle text */
  subtle: "#797593",
  /** Primary foreground text (dark gray, desaturated) */
  text: "#575279",

  // Accent colors (darkened for light mode contrast)
  /** Red accent (errors, critical states) */
  love: "#b4637a",
  /** Yellow/orange accent (warnings) */
  gold: "#ea9d34",
  /** Mauve/pink accent */
  rose: "#d7827e",
  /** Teal/cyan accent (primary information) */
  pine: "#286983",
  /** Light cyan accent */
  foam: "#56949f",
  /** Purple/violet accent */
  iris: "#907aa9",
  /** Green accent */
  leaf: "#6d8f89",

  // Highlight levels
  /** Low emphasis highlight */
  highlight_low: "#f4ede8",
  /** Medium emphasis highlight */
  highlight_med: "#dfdad9",
  /** High emphasis highlight */
  highlight_high: "#cecacd",
} as const;

/**
 * Accessibility-adjusted colors for WCAG AA compliance.
 *
 * Rose Pine's palette is optimized for aesthetics over contrast.
 * These adjustments maintain the visual character while meeting 4.5:1.
 *
 * NOTE: Rose Pine's "muted" and "subtle" are TEXT colors, not backgrounds.
 * For shadcn's muted background token, use highlight_med instead.
 */
export const rosePineA11y = {
  // Dawn (light mode) adjustments
  /** Foam darkened 20% for base contrast (3.14 → 4.63) */
  foam_dark: "#45767F", // Original: #56949f
  /** Love darkened 10% for base contrast (3.84 → 4.59) */
  love_dark: "#A2596E", // Original: #b4637a
  /** Rose darkened 30% for base contrast (2.60 → 4.86) */
  rose_dark: "#975B58", // Original: #d7827e
  /** Subtle darkened 30% for highlight_med contrast (→ 5.44) */
  subtle_dark: "#555267", // Original: #797593

  // Main (dark mode) adjustments
  /** Pine lightened 15% for base contrast (3.38 → 4.56) */
  pine_light: "#5089A0", // Original: #31748f
  /** Subtle lightened 25% for highlight_med contrast (→ 4.57) */
  subtle_light: "#ACA9BF", // Original: #908caa
} as const;

/**
 * Type-safe palette color names for each variant.
 */
export type RosePineMainColor = keyof typeof rosePineMain;
export type RosePineMoonColor = keyof typeof rosePineMoon;
export type RosePineDawnColor = keyof typeof rosePineDawn;
export type RosePineA11yColor = keyof typeof rosePineA11y;
