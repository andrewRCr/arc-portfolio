/**
 * Official Ayu Color Palette
 *
 * Source: https://github.com/ayu-theme/ayu-colors
 * Package: @ayu-theme/ayu-colors (npm)
 * License: MIT
 *
 * Ayu is a simple theme with bright colors designed for comfortable
 * all-day coding. Features three variants: Light, Dark, and Mirage.
 * We use Mirage for dark mode (warmer than Dark) and Light for light mode.
 *
 * Yellow (#FFCC66 / #FFD173) is the signature accent color.
 *
 * Verified 2026-01-08: Values from official ayu-colors package.
 */

/**
 * Ayu Mirage variant (dark theme).
 *
 * Warmer dark theme with a navy-gray background.
 * Primary variant for dark mode implementation.
 */
export const ayuMirage = {
  // Background colors
  /** Primary background */
  bg: "#1F2430",
  /** Darker background (panels) */
  bgDark: "#171B24",
  /** Line/border background */
  line: "#1A1F29",
  /** Panel background */
  panelBg: "#282E3B",

  // Foreground colors
  /** Primary text */
  fg: "#CCCAC2",
  /** Muted/UI text */
  fgMuted: "#707A8C",

  // Syntax/accent colors
  /** Yellow - signature accent */
  accent: "#FFCC66",
  /** Function calls */
  func: "#FFD173",
  /** Orange/keyword */
  keyword: "#FFAD66",
  /** Light orange */
  special: "#FFDFB3",
  /** Operator/peach */
  operator: "#F29E74",
  /** Tag/cyan */
  tag: "#5CCFE6",
  /** Entity/blue */
  entity: "#73D0FF",
  /** String/green */
  string: "#D5FF80",
  /** Regexp/teal */
  regexp: "#95E6CB",
  /** Markup/red */
  markup: "#F28779",
  /** Constant/purple */
  constant: "#DFBFFF",
  /** Comment (muted blue) */
  comment: "#B8CFE6",

  // Semantic colors
  /** Error state */
  error: "#FF6666",
  /** Warning state */
  warning: "#FFCC66",
  /** Added (VCS) */
  added: "#87D96C",
  /** Modified (VCS) */
  modified: "#80BFFF",
  /** Removed (VCS) */
  removed: "#F27983",

  // Selection
  /** Active selection */
  selectionActive: "#409FFF",
} as const;

/**
 * Ayu Light variant.
 *
 * Clean light theme optimized for bright environments.
 * Primary variant for light mode implementation.
 */
export const ayuLight = {
  // Background colors
  /** Primary background */
  bg: "#FCFCFC",
  /** Secondary background (panels) */
  bgSecondary: "#F8F9FA",
  /** Panel background */
  panelBg: "#FAFAFA",

  // Foreground colors
  /** Primary text */
  fg: "#5C6166",
  /** Muted/UI text */
  fgMuted: "#828E9F",

  // Syntax/accent colors
  /** Orange - signature accent (darker for light mode) */
  accent: "#F29718",
  /** Function calls */
  func: "#F2A300",
  /** Orange/keyword */
  keyword: "#FF7E33",
  /** Light orange */
  special: "#D9B077",
  /** Operator/peach */
  operator: "#ED9366",
  /** Tag/cyan */
  tag: "#55B4D4",
  /** Entity/blue */
  entity: "#399EE6",
  /** String/green */
  string: "#86B300",
  /** Regexp/teal */
  regexp: "#4CBF99",
  /** Markup/red */
  markup: "#F07171",
  /** Constant/purple */
  constant: "#A37ACC",
  /** Comment (gray) */
  comment: "#787B80",

  // Semantic colors
  /** Error state */
  error: "#E65050",
  /** Warning state */
  warning: "#F29718",
  /** Added (VCS) */
  added: "#6CBF43",
  /** Modified (VCS) */
  modified: "#478ACC",
  /** Removed (VCS) */
  removed: "#FF7383",

  // Selection
  /** Active selection */
  selectionActive: "#035BD6",
} as const;

/**
 * Accessibility-adjusted colors for WCAG AA compliance.
 *
 * Ayu's bright accent colors need dark foregrounds in light mode, and
 * muted colors need adjustment for proper contrast ratios.
 */
export const ayuA11y = {
  // Light mode fixes
  /** Error darkened 15% for white text contrast (3.73 → 4.93) */
  errorDarkened15: "#c44444",
  /** FgMuted darkened 14% — balances composited surface contrast (3.14+) + visible gap from foreground (1.44:1) */
  fgMutedDarkened14: "#707A89",

  // Dark mode fixes
  /** FgMuted lightened 20% for panelBg contrast (3.14 → 4.51) */
  fgMutedLightened20: "#8d95a3",
  /** Tag (cyan) softened ~15% for UI backgrounds - less electric/neon */
  tagSoftened: "#52AFC6",
} as const;

/**
 * Type-safe palette color names.
 */
export type AyuMirageColor = keyof typeof ayuMirage;
export type AyuLightColor = keyof typeof ayuLight;
