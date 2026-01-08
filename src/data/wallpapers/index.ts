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

  // Universal wallpapers (work with all themes)
  {
    id: "jr-korpa-4",
    src: "/wallpaper/optimized/jr-korpa-4.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-4.webp",
    compatibleThemes: "universal",
  },
  {
    id: "jr-korpa-5",
    src: "/wallpaper/optimized/jr-korpa-5.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-5.webp",
    compatibleThemes: "universal",
  },

  // Remedy-compatible wallpapers
  {
    id: "anne-nygard",
    src: "/wallpaper/optimized/anne-nygard-K6FlqZs4Dec.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "karolis-milisauskas",
    src: "/wallpaper/optimized/karolis-milisauskas-gg11yRbK4hk.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "hamed-sadighi",
    src: "/wallpaper/optimized/hamed-sadighi-hvsj2ErGMog.webp",
    srcHiRes: "/wallpaper/optimized-1440/hamed-sadighi-hvsj2ErGMog.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "jason-leung",
    src: "/wallpaper/optimized/jason-leung-IGLNYCWJUGI.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "kristaps-ungurs",
    src: "/wallpaper/optimized/kristaps-ungurs-VByRsW7uU5M.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "sander-traa",
    src: "/wallpaper/optimized/sander-traa-DEGn08l15vQ.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "venti-views",
    src: "/wallpaper/optimized/venti-views-dI3Ho4afHK4.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "jr-korpa-6",
    src: "/wallpaper/optimized/jr-korpa-6.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-6.webp",
    compatibleThemes: ["remedy"],
  },

  // Multi-theme compatible (Remedy + Gruvbox)
  {
    id: "olga-safronova",
    src: "/wallpaper/optimized/olga-safronova-duqq9Hm14s8.webp",
    compatibleThemes: ["remedy", "gruvbox"],
  },

  // Rose Pine-compatible wallpapers
  {
    id: "jr-korpa-2",
    src: "/wallpaper/optimized/jr-korpa-2.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-2.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "jr-korpa-3",
    src: "/wallpaper/optimized/jr-korpa-3.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-3.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "kevin-grieve",
    src: "/wallpaper/optimized/kevin-grieve.webp",
    srcHiRes: "/wallpaper/optimized-1440/kevin-grieve.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "linus-belanger",
    src: "/wallpaper/optimized/linus-belanger.webp",
    srcHiRes: "/wallpaper/optimized-1440/linus-belanger.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "wolfgang-hasselmann",
    src: "/wallpaper/optimized/wolfgang-hasselmann.webp",
    srcHiRes: "/wallpaper/optimized-1440/wolfgang-hasselmann.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "wolfgang-hasselmann-2",
    src: "/wallpaper/optimized/wolfgang-hasselmann-2.webp",
    srcHiRes: "/wallpaper/optimized-1440/wolfgang-hasselmann-2.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "jr-korpa-7",
    src: "/wallpaper/optimized/jr-korpa-7.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-7.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "jr-korpa-8",
    src: "/wallpaper/optimized/jr-korpa-8.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-8.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "robert-clark",
    src: "/wallpaper/optimized/robert-clark.webp",
    srcHiRes: "/wallpaper/optimized-1440/robert-clark.webp",
    compatibleThemes: ["rose-pine"],
  },

  // Multi-theme compatible (Rose Pine + Gruvbox)
  {
    id: "seele-an",
    src: "/wallpaper/optimized/seele-an.webp",
    srcHiRes: "/wallpaper/optimized-1440/seele-an.webp",
    compatibleThemes: ["rose-pine", "gruvbox"],
  },

  // Gruvbox-compatible wallpapers
  {
    id: "andrii-butko",
    src: "/wallpaper/optimized/andrii-butko-7hRB34KdiIs.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "bernd-dittrich",
    src: "/wallpaper/optimized/bernd-dittrich-JjJ8HdGCLvw.webp",
    srcHiRes: "/wallpaper/optimized-1440/bernd-dittrich-JjJ8HdGCLvw.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "brandon-cormier",
    src: "/wallpaper/optimized/brandon-cormier.webp",
    srcHiRes: "/wallpaper/optimized-1440/brandon-cormier.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "c-shi",
    src: "/wallpaper/optimized/c-shi.webp",
    srcHiRes: "/wallpaper/optimized-1440/c-shi.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "jr-korpa-1",
    src: "/wallpaper/optimized/jr-korpa-1.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-1.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "tuaans",
    src: "/wallpaper/optimized/tuaans.webp",
    srcHiRes: "/wallpaper/optimized-1440/tuaans.webp",
    compatibleThemes: ["gruvbox"],
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
 * Get all wallpapers compatible with a given theme.
 *
 * @param themeName - The theme to filter by
 * @returns Array of compatible wallpaper options (gradient always first due to registry order)
 */
export function getCompatibleWallpapers(themeName: ThemeName): WallpaperOption[] {
  return WALLPAPER_OPTIONS.filter((wallpaper) => isWallpaperCompatible(wallpaper, themeName));
}

// Re-export types for external use
export type { WallpaperOption, WallpaperCompatibility };
