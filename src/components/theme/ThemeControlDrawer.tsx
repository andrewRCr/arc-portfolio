/**
 * ThemeControlDrawer Component
 *
 * Mobile bottom sheet variant of the theme/wallpaper control.
 * Uses MobileDrawer for window-aligned positioning and standard header.
 * Adapted for touch interaction with 44px minimum touch targets.
 */

"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Sun, Moon, RotateCcw, Maximize2, Square } from "lucide-react";
import { useThemeTransition } from "@/hooks/useThemeTransition";
import { MobileDrawer } from "@/components/common/MobileDrawer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScreenReaderAnnounce } from "@/components/common/ScreenReaderAnnounce";
import { useDelayedShow } from "@/hooks/useDelayedShow";
import { useResetPreferences } from "@/hooks/useResetPreferences";
import { usePreferenceAnnouncements } from "@/hooks/usePreferenceAnnouncements";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useWallpaperContext } from "@/contexts/WallpaperContext";
import { useLayoutPreferences } from "@/contexts/LayoutPreferencesContext";
import { useThemeSwatch } from "@/hooks/useThemeSwatch";
import { ThemeSwatch } from "./ThemeSwatch";
import { ThemeSelector } from "./ThemeSelector";
import { WallpaperPicker } from "./WallpaperPicker";

export function ThemeControlDrawer() {
  const [open, setOpen] = useState(false);
  const { activeTheme, setActiveTheme } = useThemeContext();
  const { activeWallpaper, setActiveWallpaper, isWallpaperEnabled, setWallpaperEnabled } = useWallpaperContext();
  const { layoutMode, setLayoutMode, setDrawerOpen } = useLayoutPreferences();
  const { theme, toggleTheme } = useThemeTransition();
  const swatchColors = useThemeSwatch();
  const { hasCustomPreferences, resetToDefaults } = useResetPreferences();
  const showSwatch = useDelayedShow(150);
  const announcement = usePreferenceAnnouncements({
    activeTheme,
    activeWallpaper,
    mode: theme,
    layoutMode,
  });

  // Sync local open state to context so LayoutWrapper can coordinate UI
  useEffect(() => {
    setDrawerOpen(open);
  }, [open, setDrawerOpen]);

  const toggleLayoutMode = () => {
    setLayoutMode(layoutMode === "full" ? "boxed" : "full");
  };

  const trigger = (
    <button
      type="button"
      aria-label="Open theme settings"
      className="group flex items-center justify-center gap-1 min-h-11 min-w-11 px-2 rounded-md outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all"
    >
      {showSwatch ? (
        <span className="animate-in fade-in duration-300 group-hover:opacity-70 transition-opacity">
          <ThemeSwatch colors={swatchColors} size={16} />
        </span>
      ) : (
        <span className="w-32 h-4" /> // Placeholder for layout stability
      )}
      <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-accent-mid transition-colors" />
    </button>
  );

  return (
    <>
      <ScreenReaderAnnounce message={announcement} />
      {/* aria-describedby={undefined} explicitly passed to suppress warning when no description needed */}
      <MobileDrawer open={open} onOpenChange={setOpen} trigger={trigger} title="Theme" aria-describedby={undefined}>
        {/* Theme Selector */}
        <div className="flex justify-center">
          <ThemeSelector selectedTheme={activeTheme} onSelect={setActiveTheme} className="w-fit" />
        </div>

        {/* Wallpaper Picker Section */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-terminal text-foreground uppercase tracking-wide ml-3">Wallpaper</h3>
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

        {/* Mode Toggle, Layout & Reset - touch-friendly sizes */}
        <div className="flex justify-center gap-3 mt-2">
          <Button
            variant="ghost"
            onClick={(e) => {
              toggleTheme();
              e.currentTarget.blur();
            }}
            aria-label={`Current mode: ${theme}. Click to switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="gap-1.5 min-h-11 min-w-[5.25rem] px-4 font-terminal text-xs border-2 border-border text-accent-high hover:bg-transparent hover:text-accent-high"
          >
            {theme === "dark" ? (
              <>
                <Moon className="h-4 w-4" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun className="h-4 w-4" />
                <span>Light</span>
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={(e) => {
              toggleLayoutMode();
              e.currentTarget.blur();
            }}
            aria-label={`Current layout: ${layoutMode}. Click to switch to ${layoutMode === "full" ? "boxed" : "full"} layout`}
            className="gap-1.5 min-h-11 min-w-[5.25rem] px-4 font-terminal text-xs border-2 border-border text-accent-high hover:bg-transparent hover:text-accent-high"
          >
            {layoutMode === "full" ? (
              <>
                <Maximize2 className="h-4 w-4" />
                <span>Full</span>
              </>
            ) : (
              <>
                <Square className="h-4 w-4" />
                <span>Boxed</span>
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={(e) => {
              resetToDefaults();
              e.currentTarget.blur();
            }}
            aria-label="Reset all preferences to defaults"
            disabled={!hasCustomPreferences}
            className="gap-1.5 min-h-11 min-w-11 px-4 font-terminal text-xs border-2 border-border text-accent-high hover:bg-transparent hover:text-accent-high"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>
      </MobileDrawer>
    </>
  );
}
