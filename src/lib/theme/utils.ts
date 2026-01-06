/**
 * Theme Utilities
 *
 * Contrast ratio calculation for WCAG validation.
 * Used by theme tests to verify accessibility compliance.
 */

import ColorContrastChecker from "color-contrast-checker";

const ccc = new ColorContrastChecker();

/**
 * Convert RGB space-separated string to hex color.
 * Example: "251 241 199" → "#fbf1c7"
 * @throws Error if input is not valid "R G B" format with 0-255 values
 */
export function rgbToHex(rgb: string): string {
  const values = parseRgb(rgb);
  return (
    "#" +
    values
      .map((n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/**
 * Calculate contrast ratio between two RGB space-separated colors.
 * Returns ratio as number (e.g., 7.5 for 7.5:1).
 */
export function getContrastRatio(rgb1: string, rgb2: string): number {
  const hex1 = rgbToHex(rgb1);
  const hex2 = rgbToHex(rgb2);

  const lum1 = ccc.hexToLuminance(hex1);
  const lum2 = ccc.hexToLuminance(hex2);

  return ccc.getContrastRatio(lum1, lum2);
}

/**
 * Check if contrast ratio meets WCAG AA for normal text (4.5:1).
 */
export function meetsAANormalText(rgb1: string, rgb2: string): boolean {
  const hex1 = rgbToHex(rgb1);
  const hex2 = rgbToHex(rgb2);
  // fontSize 14 triggers normal text requirement (4.5:1)
  return ccc.isLevelAA(hex1, hex2, 14);
}

/**
 * Parse RGB space-separated string to array of numbers.
 * Example: "251 241 199" → [251, 241, 199]
 * @throws Error if input is not valid "R G B" format with 0-255 integer values
 */
export function parseRgb(rgb: string): [number, number, number] {
  if (!rgb || typeof rgb !== "string") {
    throw new Error(`Invalid RGB format: expected "R G B" string, got ${typeof rgb}`);
  }

  const parts = rgb.trim().split(/\s+/);
  if (parts.length !== 3) {
    throw new Error(`Invalid RGB format: expected 3 values, got ${parts.length} in "${rgb}"`);
  }

  const values = parts.map((p) => {
    const n = Number(p);
    if (!Number.isFinite(n) || n < 0 || n > 255 || !Number.isInteger(n)) {
      throw new Error(`Invalid RGB value: "${p}" is not an integer 0-255 in "${rgb}"`);
    }
    return n;
  });

  return values as [number, number, number];
}

/**
 * Alpha-composite two RGB colors.
 * Simulates overlaying a semi-transparent foreground over a background.
 *
 * @param fgRgb - Foreground color (RGB string, e.g., "251 241 199")
 * @param fgAlpha - Foreground opacity (0-1)
 * @param bgRgb - Background color (RGB string)
 * @returns Composited color as RGB string
 * @throws TypeError if fgAlpha is not a finite number
 * @throws RangeError if fgAlpha is not between 0 and 1
 * @throws Error if fgRgb or bgRgb are invalid (via parseRgb)
 */
export function alphaComposite(fgRgb: string, fgAlpha: number, bgRgb: string): string {
  if (typeof fgAlpha !== "number" || !Number.isFinite(fgAlpha)) {
    throw new TypeError(`Invalid alpha value: expected finite number, got ${fgAlpha}`);
  }
  if (fgAlpha < 0 || fgAlpha > 1) {
    throw new RangeError(`Invalid alpha value: expected 0-1, got ${fgAlpha}`);
  }

  const fg = parseRgb(fgRgb);
  const bg = parseRgb(bgRgb);

  const result = fg.map((fgChannel, i) => {
    const composite = fgAlpha * fgChannel + (1 - fgAlpha) * bg[i];
    return Math.round(Math.min(255, Math.max(0, composite)));
  });

  return result.join(" ");
}
