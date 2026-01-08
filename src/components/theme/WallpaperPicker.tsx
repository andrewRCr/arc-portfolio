/**
 * WallpaperPicker Component
 *
 * Carousel-style wallpaper picker with prev/next navigation
 * and thumbnail preview. Only shows wallpapers compatible with current theme.
 */

import { useCallback, KeyboardEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCompatibleWallpapers } from "@/hooks/useCompatibleWallpapers";
import { cn } from "@/lib/utils";

export interface WallpaperPickerProps {
  /** Currently selected wallpaper ID */
  selectedWallpaper: string;
  /** Callback when a wallpaper is selected */
  onSelect: (wallpaperId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

export function WallpaperPicker({ selectedWallpaper, onSelect, className }: WallpaperPickerProps) {
  const wallpapers = useCompatibleWallpapers();

  // Find current index
  const currentIndex = wallpapers.findIndex((w) => w.id === selectedWallpaper);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentWallpaper = wallpapers[safeIndex];

  const goToNext = useCallback(() => {
    const nextIndex = (safeIndex + 1) % wallpapers.length;
    onSelect(wallpapers[nextIndex].id);
  }, [safeIndex, wallpapers, onSelect]);

  const goToPrev = useCallback(() => {
    const prevIndex = (safeIndex - 1 + wallpapers.length) % wallpapers.length;
    onSelect(wallpapers[prevIndex].id);
  }, [safeIndex, wallpapers, onSelect]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          goToPrev();
          break;
        case "ArrowRight":
          event.preventDefault();
          goToNext();
          break;
      }
    },
    [goToPrev, goToNext]
  );

  return (
    <div className={cn("flex flex-col items-center gap-2 pt-1", className)}>
      {/* Thumbnail Preview */}
      <div
        data-testid="wallpaper-preview"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative w-[200px] min-w-[200px] h-[150px] min-h-[150px]",
          "rounded-md overflow-hidden",
          "outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "bg-muted"
        )}
      >
        {currentWallpaper?.id === "gradient" || !currentWallpaper?.src ? (
          <div
            data-testid="gradient-preview"
            className="w-full h-full bg-gradient-to-br from-background via-muted to-background"
          />
        ) : (
          <Image
            src={currentWallpaper.src}
            alt={`Wallpaper: ${currentWallpaper.id}`}
            fill
            className="object-cover"
            sizes="200px"
          />
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={(e) => {
            goToPrev();
            e.currentTarget.blur();
          }}
          aria-label="Previous wallpaper"
          className={cn(
            "group p-1.5 rounded-md",
            "border border-transparent hover:border-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "transition-all"
          )}
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        {/* Position Indicator */}
        <span className="text-sm text-muted-foreground tabular-nums">
          {safeIndex + 1} / {wallpapers.length}
        </span>

        <button
          type="button"
          onClick={(e) => {
            goToNext();
            e.currentTarget.blur();
          }}
          aria-label="Next wallpaper"
          className={cn(
            "group p-1.5 rounded-md",
            "border border-transparent hover:border-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "transition-all"
          )}
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>
    </div>
  );
}
