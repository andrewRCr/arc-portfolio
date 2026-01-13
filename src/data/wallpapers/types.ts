/**
 * Wallpaper System Type Definitions
 *
 * Defines type-safe interfaces for wallpaper options and theme compatibility.
 * Note: WallpaperId is derived from WALLPAPER_OPTIONS in index.ts to avoid circular imports.
 */

import type { ThemeName } from "@/data/themes";

/**
 * Theme compatibility specification for a wallpaper.
 * - `"universal"`: Works well with all themes
 * - `ThemeName[]`: Works well only with specified themes
 */
export type WallpaperCompatibility = "universal" | ThemeName[];

/**
 * Wallpaper option definition with theme compatibility metadata.
 */
export interface WallpaperOption {
  /** Unique wallpaper identifier (kebab-case, typically photographer name) */
  readonly id: string;
  /** Path to wallpaper image (1080p), or undefined for gradient option */
  readonly src: string | undefined;
  /** Path to high-res wallpaper image (1440p), for large viewports */
  readonly srcHiRes?: string;
  /** Path to thumbnail image (200×150), for picker preview */
  readonly thumbnailSrc?: string;
  /** Which themes this wallpaper works well with */
  readonly compatibleThemes: WallpaperCompatibility;
}
