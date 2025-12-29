/**
 * Remedy Color Palette
 *
 * Source: https://github.com/robertrossmann/vscode-remedy
 * Author: Robert Rossmann
 * License: BSD-3-Clause
 *
 * Remedy is a warm, comfortable color scheme with orange as its signature
 * accent color. Features "bright" (light) and "dark" variants optimized
 * for extended coding sessions.
 *
 * Color values extracted from:
 * - src/themes/bright/colours.ts
 * - src/themes/dark/colours.ts
 * - src/themes/{bright,dark}/ui.ts (for derived semantic colors)
 */

/**
 * Remedy bright (light) variant palette.
 *
 * Base is a warm cream; foreground derived from darkened yellow.
 */
export const remedyBright = {
  // Base colors
  /** Primary background - warm cream */
  base: "#FCEED1",
  /** Slightly darker base for code areas */
  baseCode: "#F7E8C8",
  /** Primary text - darkened yellow */
  foreground: "#5C4D2E",
  /** Secondary text - dimmed foreground */
  foregroundDimmed: "#8A7D64",

  // Borders and shadows
  /** Border color - darkened base */
  border: "#E5D9BC",
  /** Shadow color */
  shadow: "#C9BEAA",
} as const;

/**
 * Remedy dark variant palette.
 *
 * Base is a warm brown; foreground derived from lightened yellow.
 */
export const remedyDark = {
  // Base colors
  /** Primary background - warm brown */
  base: "#352B2A",
  /** Slightly lighter base for code areas */
  baseCode: "#3D3231",
  /** Primary text - lightened yellow */
  foreground: "#F5D899",
  /** Secondary text - dimmed foreground */
  foregroundDimmed: "#A89878",

  // Borders and shadows
  /** Border color - lightened base */
  border: "#4A3F3D",
  /** Shadow color */
  shadow: "#1A1514",
} as const;

/**
 * Shared accent colors used by both variants.
 *
 * "Normal" colors are slightly muted, suitable for light backgrounds.
 * "Bright" colors are more vibrant, suitable for dark backgrounds.
 */
export const remedyAccents = {
  // Normal accent colors (for light/bright variant)
  normal: {
    black: "#282A2E",
    blue: "#5F819D",
    cyan: "#5E8D87",
    green: "#8C9440",
    magenta: "#85678F",
    red: "#A54242",
    white: "#707880",
    yellow: "#DE935F",
    orange: "#EB684B",
  },

  // Bright accent colors (for dark variant)
  bright: {
    black: "#373B41",
    blue: "#81A2BE",
    cyan: "#8ABEB7",
    green: "#B5BD68",
    magenta: "#B294BB",
    red: "#CC6666",
    white: "#C5C8C6",
    yellow: "#F0C674",
    orange: "#EB684B", // Same as normal (no bright variant defined)
  },
} as const;

/**
 * Type-safe palette color access.
 */
export type RemedyBrightColor = keyof typeof remedyBright;
export type RemedyDarkColor = keyof typeof remedyDark;
export type RemedyAccentColor = keyof typeof remedyAccents.normal;
