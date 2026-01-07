/**
 * Wallpaper Registry
 *
 * Central registry for all available wallpaper options.
 * Each wallpaper includes theme compatibility metadata for the control system.
 *
 * Compatibility values: "universal" (works with all themes) or array of theme names.
 * Determined via visual testing against all theme/mode combinations.
 */

import type { WallpaperOption, WallpaperCompatibility, WallpaperId } from "./types";

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
    id: "venti-views",
    src: "/wallpaper/optimized/venti-views-dI3Ho4afHK4.webp",
    compatibleThemes: "universal",
  },
  {
    id: "gabriela-fechet",
    src: "/wallpaper/optimized/gabriela-fechet-2PCqWxuucg0.webp",
    compatibleThemes: "universal",
  },
  {
    id: "hamed-sadighi",
    src: "/wallpaper/optimized/hamed-sadighi-hvsj2ErGMog.webp",
    compatibleThemes: "universal",
  },
  {
    id: "karolis-milisauskas",
    src: "/wallpaper/optimized/karolis-milisauskas-gg11yRbK4hk.webp",
    compatibleThemes: "universal",
  },
  {
    id: "maxim-tolchinskiy",
    src: "/wallpaper/optimized/maxim-tolchinskiy-zwMhwQzYGhc.webp",
    compatibleThemes: "universal",
  },
  {
    id: "olga-safronova",
    src: "/wallpaper/optimized/olga-safronova-duqq9Hm14s8.webp",
    compatibleThemes: "universal",
  },
  {
    id: "ryan-searle",
    src: "/wallpaper/optimized/ryan-searle-6b7OGXmF2xY.webp",
    compatibleThemes: "universal",
  },
  {
    id: "sander-traa",
    src: "/wallpaper/optimized/sander-traa-DEGn08l15vQ.webp",
    compatibleThemes: "universal",
  },

  // Remedy-compatible wallpapers
  {
    id: "anne-nygard",
    src: "/wallpaper/optimized/anne-nygard-K6FlqZs4Dec.webp",
    compatibleThemes: ["remedy"],
  },
  {
    id: "gareth-david",
    src: "/wallpaper/optimized/gareth-david-v3i1bZ-C13E.webp",
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

  // Multi-theme compatible (Remedy + Rose Pine)
  {
    id: "sixteen-miles-out",
    src: "/wallpaper/optimized/sixteen-miles-out-NCuUExTUN4o.webp",
    compatibleThemes: ["remedy", "rose-pine"],
  },

  // Rose Pine-compatible wallpapers
  {
    id: "dzo",
    src: "/wallpaper/optimized/dzo-rXCSu_BKfRE.webp",
    compatibleThemes: ["rose-pine"],
  },
  {
    id: "simone-hutsch",
    src: "/wallpaper/optimized/simone-hutsch-qp49aKqexrI.webp",
    compatibleThemes: ["rose-pine"],
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
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "jose-ignacio-pompe",
    src: "/wallpaper/optimized/jose-ignacio-pompe-H1rnAtovsnA.webp",
    compatibleThemes: ["gruvbox"],
  },
  {
    id: "josh-withers",
    src: "/wallpaper/optimized/josh-withers-yEjlrUymkN4.webp",
    compatibleThemes: ["gruvbox"],
  },
] as const;

// Re-export types for external use
export type { WallpaperOption, WallpaperCompatibility, WallpaperId };
