/**
 * NexusMods utility functions
 *
 * Helpers for parsing NexusMods URLs and formatting statistics.
 */

/**
 * Parsed NexusMods URL components
 */
export interface ParsedNexusModsUrl {
  /** Game domain from URL (e.g., "liesofp") */
  game: string;
  /** Numeric mod ID */
  modId: number;
}

/**
 * Parse a NexusMods mod URL into game domain and mod ID
 *
 * @param url - Full NexusMods URL (e.g., "https://www.nexusmods.com/liesofp/mods/304")
 * @returns Parsed components or null if URL is invalid
 *
 * @example
 * parseNexusModsUrl("https://www.nexusmods.com/liesofp/mods/304")
 * // => { game: "liesofp", modId: 304 }
 */
export function parseNexusModsUrl(url: string): ParsedNexusModsUrl | null {
  try {
    const parsed = new URL(url);

    // Must be nexusmods.com domain
    if (!parsed.hostname.endsWith("nexusmods.com")) {
      return null;
    }

    // Path format: /{game}/mods/{modId}
    const pathMatch = parsed.pathname.match(/^\/([^/]+)\/mods\/(\d+)/);
    if (!pathMatch) {
      return null;
    }

    const game = pathMatch[1];
    // Safe to parse directly - regex (\d+) guarantees digits only
    const modId = parseInt(pathMatch[2], 10);

    return { game, modId };
  } catch {
    return null;
  }
}

/**
 * Format a number for display with K/M suffixes
 *
 * @param value - Number to format
 * @param decimals - Decimal places for K/M values (default: 1)
 * @returns Formatted string (e.g., "1.2K", "15.3K", "1.5M")
 *
 * @example
 * formatStatNumber(1234)     // => "1.2K"
 * formatStatNumber(15300)    // => "15.3K"
 * formatStatNumber(1500000)  // => "1.5M"
 * formatStatNumber(999)      // => "999"
 */
export function formatStatNumber(value: number, decimals: number = 1): string {
  if (value < 1000) {
    return value.toString();
  }

  // Remove unnecessary trailing zeros and decimal point
  const cleanNumber = (num: string): string => {
    return num.replace(/\.?0+$/, "");
  };

  if (value < 1_000_000) {
    const formatted = (value / 1000).toFixed(decimals);
    return `${cleanNumber(formatted)}K`;
  }

  const formatted = (value / 1_000_000).toFixed(decimals);
  return `${cleanNumber(formatted)}M`;
}

/**
 * Build a NexusMods mod URL from game domain and mod ID
 *
 * @param game - Game domain (e.g., "liesofp")
 * @param modId - Numeric mod ID
 * @returns Full NexusMods URL
 *
 * @example
 * buildNexusModsUrl("liesofp", 304)
 * // => "https://www.nexusmods.com/liesofp/mods/304"
 */
export function buildNexusModsUrl(game: string, modId: number): string {
  return `https://www.nexusmods.com/${game}/mods/${modId}`;
}
