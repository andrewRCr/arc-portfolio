/**
 * ThemeControlDrawer Component
 *
 * Mobile bottom sheet variant of the theme/wallpaper control.
 * Mirrors desktop ThemeControl layout but adapted for touch interaction:
 * - Bottom sheet instead of popover
 * - 44px minimum touch targets
 * - Fullscreen mode toggle (mobile-only feature)
 */

"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Sun, Moon, RotateCcw, X, Maximize2, Square } from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useWallpaperContext } from "@/contexts/WallpaperContext";
import { useLayoutPreferences } from "@/contexts/LayoutPreferencesContext";
import { useThemeSwatch } from "@/hooks/useThemeSwatch";
import { defaultPalette } from "@/data/themes";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import {
  PALETTE_STORAGE_KEY,
  PALETTE_COOKIE_NAME,
  WALLPAPER_PREFS_STORAGE_KEY,
  WALLPAPER_COOKIE_NAME,
} from "@/config/storage";
import { ThemeSwatch } from "./ThemeSwatch";
import { ThemeSelector } from "./ThemeSelector";
import { WallpaperPicker } from "./WallpaperPicker";

export function ThemeControlDrawer() {
  const mounted = useHasMounted();
  const [open, setOpen] = useState(false);
  const { activeTheme, setActiveTheme } = useThemeContext();
  const { activeWallpaper, setActiveWallpaper, isWallpaperEnabled, setWallpaperEnabled } = useWallpaperContext();
  const { layoutMode, setLayoutMode, setDrawerOpen } = useLayoutPreferences();
  const { theme, setTheme } = useTheme();
  const swatchColors = useThemeSwatch();

  // Sync local open state to context so LayoutWrapper can coordinate UI
  useEffect(() => {
    setDrawerOpen(open);
  }, [open, setDrawerOpen]);

  // Reset is only meaningful if there are custom preferences
  const hasCustomPreferences =
    activeTheme !== defaultPalette ||
    (typeof window !== "undefined" && localStorage.getItem(WALLPAPER_PREFS_STORAGE_KEY) !== null);

  const toggleMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLayoutMode = () => {
    setLayoutMode(layoutMode === "full" ? "boxed" : "full");
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };

  const resetToDefaults = () => {
    localStorage.removeItem(PALETTE_STORAGE_KEY);
    localStorage.removeItem(WALLPAPER_PREFS_STORAGE_KEY);
    deleteCookie(PALETTE_COOKIE_NAME);
    deleteCookie(WALLPAPER_COOKIE_NAME);
    setActiveTheme(defaultPalette);
  };

  // Before hydration: render placeholder
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Open theme settings"
        disabled
        className="flex items-center justify-center gap-1 min-h-11 min-w-11 px-2 rounded-md border border-border transition-all"
      >
        <div data-testid="theme-swatch" aria-hidden="true" className="flex">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} data-testid="swatch-square" className="bg-muted" style={{ width: "16px", height: "16px" }} />
          ))}
        </div>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open theme settings"
          className="group flex items-center justify-center gap-1 min-h-11 min-w-11 px-2 rounded-md border border-transparent hover:border-foreground/60 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all"
        >
          <ThemeSwatch colors={swatchColors} size={16} />
          <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        hideCloseButton
        style={{
          // Align with top of main content area: viewport - topBar - gaps + border overlap
          maxHeight: `calc(100dvh - ${DEFAULT_LAYOUT_TOKENS.topBarHeight}px - ${DEFAULT_LAYOUT_TOKENS.windowGap * 2}px + ${DEFAULT_LAYOUT_TOKENS.windowBorderWidth}px)`,
          // Inset from edges to show wallpaper preview on sides (matches windowGap)
          left: DEFAULT_LAYOUT_TOKENS.windowGap,
          right: DEFAULT_LAYOUT_TOKENS.windowGap,
        }}
        aria-describedby={undefined}
      >
        <div className="flex flex-col gap-2 px-4 pb-6 pt-1">
          {/* Theme Section */}
          <div>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide ml-3">
                Theme
              </SheetTitle>
              <SheetClose asChild>
                <button
                  type="button"
                  className="min-h-11 min-w-11 flex items-center justify-center rounded-md [-webkit-tap-highlight-color:transparent] outline-none opacity-70 hover:opacity-100 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </SheetClose>
            </div>
            <div className="flex justify-center">
              <ThemeSelector selectedTheme={activeTheme} onSelect={setActiveTheme} className="w-fit" />
            </div>
          </div>

          {/* Wallpaper Picker Section */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide ml-3">Wallpaper</h3>
              <label
                className="min-h-11 min-w-11 flex items-center justify-center cursor-pointer"
                data-testid="wallpaper-toggle-touch-target"
              >
                <Switch
                  checked={isWallpaperEnabled}
                  onCheckedChange={setWallpaperEnabled}
                  aria-label="Enable wallpaper"
                  data-testid="wallpaper-toggle"
                />
              </label>
            </div>
            <WallpaperPicker
              selectedWallpaper={activeWallpaper}
              onSelect={setActiveWallpaper}
              isEnabled={isWallpaperEnabled}
            />
          </div>

          {/* Mode Toggle, Fullscreen & Reset - touch-friendly sizes */}
          <div className="flex justify-center gap-3 mt-2">
            <Button
              variant="outline"
              onClick={(e) => {
                toggleMode();
                e.currentTarget.blur();
              }}
              aria-label={`Current mode: ${theme}. Click to switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="gap-2 min-h-11 min-w-11 px-4"
            >
              {theme === "dark" ? (
                <>
                  <Moon className="h-5 w-5" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="h-5 w-5" />
                  <span>Light</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={(e) => {
                toggleLayoutMode();
                e.currentTarget.blur();
              }}
              aria-label={`Current layout: ${layoutMode}. Click to switch to ${layoutMode === "full" ? "boxed" : "full"} layout`}
              className="gap-2 min-h-11 min-w-11 px-4"
            >
              {layoutMode === "full" ? (
                <>
                  <Maximize2 className="h-5 w-5" />
                  <span>Full</span>
                </>
              ) : (
                <>
                  <Square className="h-5 w-5" />
                  <span>Boxed</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={(e) => {
                resetToDefaults();
                e.currentTarget.blur();
              }}
              aria-label="Reset all preferences to defaults"
              disabled={!hasCustomPreferences}
              className="gap-2 min-h-11 min-w-11 px-4"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Reset</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
