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
    src: "/wallpaper/optimized/karolis-milisauskas-gg11yRbK4hk.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "sander-traa",
    src: "/wallpaper/optimized/sander-traa-DEGn08l15vQ.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "hamed-sadighi",
    src: "/wallpaper/optimized/hamed-sadighi-hvsj2ErGMog.webp",
    srcHiRes: "/wallpaper/optimized-1440/hamed-sadighi-hvsj2ErGMog.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "jr-korpa-4",
    src: "/wallpaper/optimized/jr-korpa-4.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-4.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "olga-safronova",
    src: "/wallpaper/optimized/olga-safronova-duqq9Hm14s8.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "anne-nygard",
    src: "/wallpaper/optimized/anne-nygard-K6FlqZs4Dec.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "kristaps-ungurs",
    src: "/wallpaper/optimized/kristaps-ungurs-VByRsW7uU5M.webp",
    compatibleThemes: ["remedy"],
  },

  // =====================
  // Rose Pine-compatible
  // =====================
  {
    id: "jr-korpa-2",
    src: "/wallpaper/optimized/jr-korpa-2.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-2.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "jr-korpa-8",
    src: "/wallpaper/optimized/jr-korpa-8.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-8.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "jr-korpa-7",
    src: "/wallpaper/optimized/jr-korpa-7.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-7.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "pawel-czerwinski-2",
    src: "/wallpaper/optimized/pawel-czerwinski-2.webp",
    srcHiRes: "/wallpaper/optimized-1440/pawel-czerwinski-2.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "colin-watts",
    src: "/wallpaper/optimized/colin-watts.webp",
    srcHiRes: "/wallpaper/optimized-1440/colin-watts.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "ernest-brillo",
    src: "/wallpaper/optimized/ernest-brillo.webp",
    srcHiRes: "/wallpaper/optimized-1440/ernest-brillo.webp",
    compatibleThemes: ["rose-pine"],
  },

  // =====================
  // Gruvbox-compatible
  // =====================
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
    id: "andrii-butko",
    src: "/wallpaper/optimized/andrii-butko-7hRB34KdiIs.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "tuaans",
    src: "/wallpaper/optimized/tuaans.webp",
    srcHiRes: "/wallpaper/optimized-1440/tuaans.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "bernd-dittrich",
    src: "/wallpaper/optimized/bernd-dittrich-JjJ8HdGCLvw.webp",
    srcHiRes: "/wallpaper/optimized-1440/bernd-dittrich-JjJ8HdGCLvw.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "buddy-an-2",
    src: "/wallpaper/optimized/buddy-an-2.webp",
    srcHiRes: "/wallpaper/optimized-1440/buddy-an-2.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "buddy-an-3",
    src: "/wallpaper/optimized/buddy-an-3.webp",
    srcHiRes: "/wallpaper/optimized-1440/buddy-an-3.webp",
    compatibleThemes: ["gruvbox"],
  },

  // =====================
  // Rouge-compatible
  // =====================
  {
    id: "wolfgang-hasselmann-3",
    src: "/wallpaper/optimized/wolfgang-hasselmann-3.webp",
    srcHiRes: "/wallpaper/optimized-1440/wolfgang-hasselmann-3.webp",
    compatibleThemes: ["rouge"],
  },
  {
    id: "jr-korpa-9",
    src: "/wallpaper/optimized/jr-korpa-9.webp",
    srcHiRes: "/wallpaper/optimized-1440/jr-korpa-9.webp",
    compatibleThemes: ["rouge"],
  },
  {
    id: "seele-an-2",
    src: "/wallpaper/optimized/seele-an-2.webp",
    srcHiRes: "/wallpaper/optimized-1440/seele-an-2.webp",
    compatibleThemes: ["rouge"],
  },
  {
    id: "wolfgang-hasselmann-4",
    src: "/wallpaper/optimized/wolfgang-hasselmann-4.webp",
    srcHiRes: "/wallpaper/optimized-1440/wolfgang-hasselmann-4.webp",
    compatibleThemes: ["rouge"],
  },
  {
    id: "linus-belanger",
    src: "/wallpaper/optimized/linus-belanger.webp",
    srcHiRes: "/wallpaper/optimized-1440/linus-belanger.webp",
    compatibleThemes: ["rouge"],
  },
  {
    id: "pawel-czerwinski",
    src: "/wallpaper/optimized/pawel-czerwinski.webp",
    srcHiRes: "/wallpaper/optimized-1440/pawel-czerwinski.webp",
    compatibleThemes: ["rouge"],
  },

  // =====================
  // Ayu-compatible
  // =====================
  {
    id: "liana-s",
    src: "/wallpaper/optimized/liana-s.webp",
    srcHiRes: "/wallpaper/optimized-1440/liana-s.webp",
    compatibleThemes: ["ayu"],
  },
  {
    id: "eugene-golovesov",
    src: "/wallpaper/optimized/eugene-golovesov.webp",
    srcHiRes: "/wallpaper/optimized-1440/eugene-golovesov.webp",
    compatibleThemes: ["ayu"],
  },
  {
    id: "buddy-an",
    src: "/wallpaper/optimized/buddy-an.webp",
    srcHiRes: "/wallpaper/optimized-1440/buddy-an.webp",
    compatibleThemes: ["ayu"],
  },
  {
    id: "dan-meyers",
    src: "/wallpaper/optimized/dan-meyers.webp",
    srcHiRes: "/wallpaper/optimized-1440/dan-meyers.webp",
    compatibleThemes: ["ayu"],
  },
  {
    id: "digby-cheung",
    src: "/wallpaper/optimized/digby-cheung.webp",
    srcHiRes: "/wallpaper/optimized-1440/digby-cheung.webp",
    compatibleThemes: ["ayu"],
  },
  {
    id: "flyd",
    src: "/wallpaper/optimized/flyd.webp",
    srcHiRes: "/wallpaper/optimized-1440/flyd.webp",
    compatibleThemes: ["ayu"],
  },
  {
    id: "pawel-czerwinski-3",
    src: "/wallpaper/optimized/pawel-czerwinski-3.webp",
    srcHiRes: "/wallpaper/optimized-1440/pawel-czerwinski-3.webp",
    compatibleThemes: ["ayu"],
  },

  // =====================
  // Mariana-compatible
  // =====================
  {
    id: "diana-prundeanu",
    src: "/wallpaper/optimized/diana-prundeanu.webp",
    srcHiRes: "/wallpaper/optimized-1440/diana-prundeanu.webp",
    compatibleThemes: ["mariana"],
  },
  {
    id: "hector-j-rivas",
    src: "/wallpaper/optimized/hector-j-rivas.webp",
    srcHiRes: "/wallpaper/optimized-1440/hector-j-rivas.webp",
    compatibleThemes: ["mariana"],
  },
  {
    id: "anastasia-zolotukhina",
    src: "/wallpaper/optimized/anastasia-zolotukhina.webp",
    srcHiRes: "/wallpaper/optimized-1440/anastasia-zolotukhina.webp",
    compatibleThemes: ["mariana"],
  },
  {
    id: "pawel-czerwinski-4",
    src: "/wallpaper/optimized/pawel-czerwinski-4.webp",
    srcHiRes: "/wallpaper/optimized-1440/pawel-czerwinski-4.webp",
    compatibleThemes: ["mariana"],
  },
  {
    id: "patrick-hendry",
    src: "/wallpaper/optimized/patrick-hendry.webp",
    srcHiRes: "/wallpaper/optimized-1440/patrick-hendry.webp",
    compatibleThemes: ["mariana"],
  },
  {
    id: "susan-wilkinson",
    src: "/wallpaper/optimized/susan-wilkinson.webp",
    srcHiRes: "/wallpaper/optimized-1440/susan-wilkinson.webp",
    compatibleThemes: ["mariana"],
  },
  {
    id: "wolfgang-hasselmann-5",
    src: "/wallpaper/optimized/wolfgang-hasselmann-5.webp",
    srcHiRes: "/wallpaper/optimized-1440/wolfgang-hasselmann-5.webp",
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
