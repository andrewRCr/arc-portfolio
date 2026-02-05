/**
 * Wallpaper Registry
 *
 * Central registry for all available wallpaper options.
 * Each wallpaper includes theme compatibility metadata for the control system.
 *
 * Compatibility values: "universal" (works with all themes) or array of theme names.
 * Determined via visual testing against all theme/mode combinations.
 */

import type { ThemeName } from "@/data/themes";
import type { WallpaperOption, WallpaperCompatibility } from "./types";

/**
 * All available wallpaper options.
 *
 * Order determines display order in wallpaper picker.
 * Gradient option is always first (fallback/default).
 */
export const WALLPAPER_OPTIONS: readonly WallpaperOption[] = [
  // Gradient (always available, theme-aware CSS gradient)
  { id: "gradient", src: undefined, compatibleThemes: "universal" },

  // =====================
  // Remedy-compatible
  // =====================
  {
    id: "karolis-milisauskas",
    src: "/wallpaper/optimized-1080/karolis-milisauskas-gg11yRbK4hk.webp",
    thumbnailSrc: "/wallpaper/thumbnails/karolis-milisauskas-gg11yRbK4hk.webp",
    srcHiRes: "/wallpaper/optimized-1440/karolis-milisauskas-gg11yRbK4hk.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "sander-traa",
    src: "/wallpaper/optimized-1080/sander-traa-DEGn08l15vQ.webp",
    thumbnailSrc: "/wallpaper/thumbnails/sander-traa-DEGn08l15vQ.webp",
    srcHiRes: "/wallpaper/optimized-1440/sander-traa-DEGn08l15vQ.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "jr-korpa-4",
    src: "/wallpaper/optimized-1080/jr-korpa-4.webp",
    thumbnailSrc: "/wallpaper/thumbnails/jr-korpa-4.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-4.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "olga-safronova",
    src: "/wallpaper/optimized-1080/olga-safronova-duqq9Hm14s8.webp",
    thumbnailSrc: "/wallpaper/thumbnails/olga-safronova-duqq9Hm14s8.webp",
    srcHiRes: "/wallpaper/optimized-1440/olga-safronova-duqq9Hm14s8.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "kristaps-ungurs",
    src: "/wallpaper/optimized-1080/kristaps-ungurs-VByRsW7uU5M.webp",
    thumbnailSrc: "/wallpaper/thumbnails/kristaps-ungurs-VByRsW7uU5M.webp",
    srcHiRes: "/wallpaper/optimized-1440/kristaps-ungurs-VByRsW7uU5M.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "anne-nygard",
    src: "/wallpaper/optimized-1080/anne-nygard-K6FlqZs4Dec.webp",
    thumbnailSrc: "/wallpaper/thumbnails/anne-nygard-K6FlqZs4Dec.webp",
    srcHiRes: "/wallpaper/optimized-1440/anne-nygard-K6FlqZs4Dec.webp",
    compatibleThemes: ["remedy"],
  },

  // =====================
  // Rose Pine-compatible
  // =====================

  {
    id: "jr-korpa-2",
    src: "/wallpaper/optimized-1080/jr-korpa-2.webp",
    thumbnailSrc: "/wallpaper/thumbnails/jr-korpa-2.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-2.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "pawel-czerwinski-2",
    src: "/wallpaper/optimized-1080/pawel-czerwinski-2.webp",
    thumbnailSrc: "/wallpaper/thumbnails/pawel-czerwinski-2.webp",
    srcHiRes: "/wallpaper/optimized-1440/pawel-czerwinski-2.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "colin-watts",
    src: "/wallpaper/optimized-1080/colin-watts.webp",
    thumbnailSrc: "/wallpaper/thumbnails/colin-watts.webp",
    srcHiRes: "/wallpaper/optimized-1440/colin-watts.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "ernest-brillo",
    src: "/wallpaper/optimized-1080/ernest-brillo.webp",
    thumbnailSrc: "/wallpaper/thumbnails/ernest-brillo.webp",
    srcHiRes: "/wallpaper/optimized-1440/ernest-brillo.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "jr-korpa-8",
    src: "/wallpaper/optimized-1080/jr-korpa-8.webp",
    thumbnailSrc: "/wallpaper/thumbnails/jr-korpa-8.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-8.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "wolfgang-hasselmann-6",
    src: "/wallpaper/optimized-1080/wolfgang-hasselmann-6.webp",
    thumbnailSrc: "/wallpaper/thumbnails/wolfgang-hasselmann-6.webp",
    srcHiRes: "/wallpaper/optimized-1440/wolfgang-hasselmann-6.webp",
    compatibleThemes: ["rose-pine"],
  },

  // =====================
  // Gruvbox-compatible
  // =====================

  {
    id: "c-shi",
    src: "/wallpaper/optimized-1080/c-shi.webp",
    thumbnailSrc: "/wallpaper/thumbnails/c-shi.webp",
    srcHiRes: "/wallpaper/optimized-1440/c-shi.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "jr-korpa-1",
    src: "/wallpaper/optimized-1080/jr-korpa-1.webp",
    thumbnailSrc: "/wallpaper/thumbnails/jr-korpa-1.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-1.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "buddy-an-2",
    src: "/wallpaper/optimized-1080/buddy-an-2.webp",
    thumbnailSrc: "/wallpaper/thumbnails/buddy-an-2.webp",
    srcHiRes: "/wallpaper/optimized-1440/buddy-an-2.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "tuaans",
    src: "/wallpaper/optimized-1080/tuaans.webp",
    thumbnailSrc: "/wallpaper/thumbnails/tuaans.webp",
    srcHiRes: "/wallpaper/optimized-1440/tuaans.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "bernd-dittrich",
    src: "/wallpaper/optimized-1080/bernd-dittrich-JjJ8HdGCLvw.webp",
    thumbnailSrc: "/wallpaper/thumbnails/bernd-dittrich-JjJ8HdGCLvw.webp",
    srcHiRes: "/wallpaper/optimized-1440/bernd-dittrich-JjJ8HdGCLvw.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "buddy-an-3",
    src: "/wallpaper/optimized-1080/buddy-an-3.webp",
    thumbnailSrc: "/wallpaper/thumbnails/buddy-an-3.webp",
    srcHiRes: "/wallpaper/optimized-1440/buddy-an-3.webp",
    compatibleThemes: ["gruvbox"],
  },

  // =====================
  // Rouge-compatible
  // =====================
  {
    id: "wolfgang-hasselmann-3",
    src: "/wallpaper/optimized-1080/wolfgang-hasselmann-3.webp",
    thumbnailSrc: "/wallpaper/thumbnails/wolfgang-hasselmann-3.webp",
    srcHiRes: "/wallpaper/optimized-1440/wolfgang-hasselmann-3.webp",
    compatibleThemes: ["rouge"],
  },
  {
    id: "pawel-czerwinski",
    src: "/wallpaper/optimized-1080/pawel-czerwinski.webp",
    thumbnailSrc: "/wallpaper/thumbnails/pawel-czerwinski.webp",
    srcHiRes: "/wallpaper/optimized-1440/pawel-czerwinski.webp",
    compatibleThemes: ["rouge"],
  },
  {
    id: "seele-an-2",
    src: "/wallpaper/optimized-1080/seele-an-2.webp",
    thumbnailSrc: "/wallpaper/thumbnails/seele-an-2.webp",
    srcHiRes: "/wallpaper/optimized-1440/seele-an-2.webp",
    compatibleThemes: ["rouge"],
  },
  {
    id: "wolfgang-hasselmann-4",
    src: "/wallpaper/optimized-1080/wolfgang-hasselmann-4.webp",
    thumbnailSrc: "/wallpaper/thumbnails/wolfgang-hasselmann-4.webp",
    srcHiRes: "/wallpaper/optimized-1440/wolfgang-hasselmann-4.webp",
    compatibleThemes: ["rouge"],
  },
  {
    id: "linus-belanger",
    src: "/wallpaper/optimized-1080/linus-belanger.webp",
    thumbnailSrc: "/wallpaper/thumbnails/linus-belanger.webp",
    srcHiRes: "/wallpaper/optimized-1440/linus-belanger.webp",
    compatibleThemes: ["rouge"],
  },
  {
    id: "jr-korpa-9",
    src: "/wallpaper/optimized-1080/jr-korpa-9.webp",
    thumbnailSrc: "/wallpaper/thumbnails/jr-korpa-9.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-9.webp",
    compatibleThemes: ["rouge"],
  },

  // =====================
  // Ayu-compatible
  // =====================
  {
    id: "liana-s",
    src: "/wallpaper/optimized-1080/liana-s.webp",
    thumbnailSrc: "/wallpaper/thumbnails/liana-s.webp",
    srcHiRes: "/wallpaper/optimized-1440/liana-s.webp",
    compatibleThemes: ["ayu"],
  },
  {
    id: "buddy-an",
    src: "/wallpaper/optimized-1080/buddy-an.webp",
    thumbnailSrc: "/wallpaper/thumbnails/buddy-an.webp",
    srcHiRes: "/wallpaper/optimized-1440/buddy-an.webp",
    compatibleThemes: ["ayu"],
  },
  {
    id: "digby-cheung",
    src: "/wallpaper/optimized-1080/digby-cheung.webp",
    thumbnailSrc: "/wallpaper/thumbnails/digby-cheung.webp",
    srcHiRes: "/wallpaper/optimized-1440/digby-cheung.webp",
    compatibleThemes: ["ayu"],
  },
  {
    id: "dan-meyers",
    src: "/wallpaper/optimized-1080/dan-meyers.webp",
    thumbnailSrc: "/wallpaper/thumbnails/dan-meyers.webp",
    srcHiRes: "/wallpaper/optimized-1440/dan-meyers.webp",
    compatibleThemes: ["ayu"],
  },
  {
    id: "pawel-czerwinski-3",
    src: "/wallpaper/optimized-1080/pawel-czerwinski-3.webp",
    thumbnailSrc: "/wallpaper/thumbnails/pawel-czerwinski-3.webp",
    srcHiRes: "/wallpaper/optimized-1440/pawel-czerwinski-3.webp",
    compatibleThemes: ["ayu"],
  },
  {
    id: "eugene-golovesov",
    src: "/wallpaper/optimized-1080/eugene-golovesov.webp",
    thumbnailSrc: "/wallpaper/thumbnails/eugene-golovesov.webp",
    srcHiRes: "/wallpaper/optimized-1440/eugene-golovesov.webp",
    compatibleThemes: ["ayu"],
  },

  // =====================
  // Mariana-compatible
  // =====================
  {
    id: "diana-prundeanu",
    src: "/wallpaper/optimized-1080/diana-prundeanu.webp",
    thumbnailSrc: "/wallpaper/thumbnails/diana-prundeanu.webp",
    srcHiRes: "/wallpaper/optimized-1440/diana-prundeanu.webp",
    compatibleThemes: ["mariana"],
  },
  {
    id: "hector-j-rivas",
    src: "/wallpaper/optimized-1080/hector-j-rivas.webp",
    thumbnailSrc: "/wallpaper/thumbnails/hector-j-rivas.webp",
    srcHiRes: "/wallpaper/optimized-1440/hector-j-rivas.webp",
    compatibleThemes: ["mariana"],
  },
  {
    id: "anastasia-zolotukhina",
    src: "/wallpaper/optimized-1080/anastasia-zolotukhina.webp",
    thumbnailSrc: "/wallpaper/thumbnails/anastasia-zolotukhina.webp",
    srcHiRes: "/wallpaper/optimized-1440/anastasia-zolotukhina.webp",
    compatibleThemes: ["mariana"],
  },
  {
    id: "wolfgang-hasselmann-5",
    src: "/wallpaper/optimized-1080/wolfgang-hasselmann-5.webp",
    thumbnailSrc: "/wallpaper/thumbnails/wolfgang-hasselmann-5.webp",
    srcHiRes: "/wallpaper/optimized-1440/wolfgang-hasselmann-5.webp",
    compatibleThemes: ["mariana"],
  },
  {
    id: "pawel-czerwinski-4",
    src: "/wallpaper/optimized-1080/pawel-czerwinski-4.webp",
    thumbnailSrc: "/wallpaper/thumbnails/pawel-czerwinski-4.webp",
    srcHiRes: "/wallpaper/optimized-1440/pawel-czerwinski-4.webp",
    compatibleThemes: ["mariana"],
  },
  {
    id: "patrick-hendry",
    src: "/wallpaper/optimized-1080/patrick-hendry.webp",
    thumbnailSrc: "/wallpaper/thumbnails/patrick-hendry.webp",
    srcHiRes: "/wallpaper/optimized-1440/patrick-hendry.webp",
    compatibleThemes: ["mariana"],
  },
] as const;

/**
 * Type-safe wallpaper ID derived from registry.
 */
export type WallpaperId = (typeof WALLPAPER_OPTIONS)[number]["id"];

/**
 * Check if a wallpaper is compatible with a given theme.
 *
 * @param wallpaper - The wallpaper option to check
 * @param themeName - The theme to check compatibility against
 * @returns true if the wallpaper works with the theme
 */
export function isWallpaperCompatible(wallpaper: WallpaperOption, themeName: ThemeName): boolean {
  if (wallpaper.compatibleThemes === "universal") return true;
  return wallpaper.compatibleThemes.includes(themeName);
}

/**
 * Get all wallpapers compatible with a given theme (excludes gradient).
 *
 * @param themeName - The theme to filter by
 * @returns Array of compatible wallpaper options (excludes gradient)
 */
export function getCompatibleWallpapers(themeName: ThemeName): WallpaperOption[] {
  return WALLPAPER_OPTIONS.filter(
    (wallpaper) => wallpaper.id !== "gradient" && isWallpaperCompatible(wallpaper, themeName)
  );
}

// Re-export types for external use
export type { WallpaperOption, WallpaperCompatibility };
