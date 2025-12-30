/**
 * Type declarations for color-contrast-checker
 *
 * Library version: 2.1.0
 * Last verified: 2025-12-27
 *
 * These declarations cover our usage patterns only.
 * Update when upgrading the library.
 */

declare module "color-contrast-checker" {
  interface RGB {
    r: number;
    g: number;
    b: number;
  }

  interface CheckPairInput {
    colorA: string;
    colorB: string;
    fontSize: number;
  }

  interface CheckPairResult {
    WCAG_AA: boolean;
    WCAG_AAA: boolean;
  }

  class ColorContrastChecker {
    fontSize: number;

    /** Check if hex color code is valid (6-digit) */
    isValidSixDigitColorCode(hex: string): boolean;

    /** Check if hex color code is valid (3-digit shorthand) */
    isValidThreeDigitColorCode(hex: string): boolean;

    /** Check if hex color code is valid (3 or 6 digit) */
    isValidColorCode(hex: string): boolean;

    /** Convert 3-digit shorthand to 6-digit hex */
    convertColorToSixDigit(hex: string): string;

    /** Get luminance value from hex color */
    hexToLuminance(color: string): number;

    /** Get RGB values from hex color */
    getRGBFromHex(color: string): RGB;

    /** Calculate contrast ratio between two luminance values */
    getContrastRatio(lumA: number, lumB: number): number;

    /** Check if colors meet WCAG AA standard */
    isLevelAA(colorA: string, colorB: string, fontSize?: number): boolean;

    /** Check if colors meet WCAG AAA standard */
    isLevelAAA(colorA: string, colorB: string, fontSize?: number): boolean;

    /** Check if colors meet a custom contrast ratio */
    isLevelCustom(colorA: string, colorB: string, ratio: number): boolean;

    /** Check multiple color pairs at once */
    checkPairs(pairs: CheckPairInput[], customRatio?: number): CheckPairResult[];
  }

  export = ColorContrastChecker;
}
