"use client";

import { useWallpaperContext, type WallpaperId } from "@/contexts/WallpaperContext";
import { WALLPAPER_OPTIONS } from "@/data/wallpapers";

/**
 * WallpaperSwitcher
 *
 * Development/testing component for switching between wallpaper options.
 * Allows quick comparison of gradient vs image backgrounds.
 */
export function WallpaperSwitcher() {
  const { activeWallpaper, setActiveWallpaper } = useWallpaperContext();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveWallpaper(event.target.value as WallpaperId);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="wallpaper-select" className="text-sm text-muted-foreground">
        BG:
      </label>
      <select
        id="wallpaper-select"
        value={activeWallpaper}
        onChange={handleChange}
        className="rounded border border-border bg-transparent px-2 py-1 text-sm text-foreground transition-colors hover:border-secondary/60 focus:bg-card focus-visible:border-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {WALLPAPER_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.id}
          </option>
        ))}
      </select>
    </div>
  );
}
