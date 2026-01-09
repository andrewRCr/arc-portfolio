/**
 * WallpaperPicker Component
 *
 * Carousel-style wallpaper picker with prev/next navigation
 * and thumbnail preview. Only shows wallpapers compatible with current theme.
 * Includes an enable/disable toggle to show gradient instead of wallpaper.
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
  /** Whether wallpaper display is enabled (false dims controls) */
  isEnabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Attribution overrides for photographers whose names differ from
 * what we can derive from filenames (special characters, capitalization).
 * Key is the base name (without number suffix).
 */
const ATTRIBUTION_OVERRIDES: Record<string, string> = {
  "anne-nygard": "Anne Nygård",
  "buddy-an": "Buddy AN",
  "c-shi": "C. Shi",
  flyd: "FlyD",
  "hector-j-rivas": "Hector J. Rivas",
  "karolis-milisauskas": "Karolis Milišauskas",
};

/**
 * Format wallpaper ID into display name.
 * Checks overrides first, then derives from ID by removing number suffixes,
 * replacing hyphens with spaces, and capitalizing words.
 * e.g., "jr-korpa-1" -> "Jr Korpa", "buddy-an-2" -> "Buddy AN" (override)
 */
export function formatAttribution(id: string): string {
  if (id === "gradient") return "Gradient";
  // Remove trailing numbers (e.g., "jr-korpa-1" -> "jr-korpa")
  const baseName = id.replace(/-\d+$/, "");
  // Check for override first
  if (ATTRIBUTION_OVERRIDES[baseName]) {
    return ATTRIBUTION_OVERRIDES[baseName];
  }
  // Replace hyphens with spaces and capitalize each word
  return baseName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function WallpaperPicker({ selectedWallpaper, onSelect, isEnabled = true, className }: WallpaperPickerProps) {
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
        tabIndex={isEnabled ? 0 : -1}
        onKeyDown={isEnabled ? handleKeyDown : undefined}
        className={cn(
          "relative w-[200px] min-w-[200px] h-[150px] min-h-[150px]",
          "rounded-md overflow-hidden",
          "outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "bg-muted transition-opacity",
          !isEnabled && "opacity-40 pointer-events-none"
        )}
      >
        {currentWallpaper?.id === "gradient" || !currentWallpaper?.src ? (
          <div
            data-testid="gradient-preview"
            className="w-full h-full bg-gradient-to-br from-background via-muted to-background"
          />
        ) : (
          <Image
            src={currentWallpaper.thumbnailSrc ?? currentWallpaper.src}
            alt={`Wallpaper: ${currentWallpaper.id}`}
            fill
            className="object-cover"
            sizes="200px"
          />
        )}
      </div>

      {/* Navigation Controls */}
      <div className={cn("flex items-center gap-2 transition-opacity", !isEnabled && "opacity-40 pointer-events-none")}>
        <button
          type="button"
          onClick={(e) => {
            goToPrev();
            e.currentTarget.blur();
          }}
          disabled={!isEnabled}
          aria-label="Previous wallpaper"
          className={cn(
            "group p-1.5 rounded-md",
            "border border-transparent hover:border-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "transition-all disabled:cursor-not-allowed"
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
          disabled={!isEnabled}
          aria-label="Next wallpaper"
          className={cn(
            "group p-1.5 rounded-md",
            "border border-transparent hover:border-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "transition-all disabled:cursor-not-allowed"
          )}
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>

      {/* Attribution */}
      <span className={cn("text-xs text-muted-foreground italic -mt-1 transition-opacity", !isEnabled && "opacity-40")}>
        {formatAttribution(currentWallpaper?.id ?? "gradient")}
      </span>
    </div>
  );
}
