/**
 * ThemeControl Component
 *
 * Combined theme/wallpaper control dropdown for the TopBar.
 * Shows a compact swatch trigger that expands to reveal:
 * - ThemeSelector (palette selection)
 * - WallpaperPicker (wallpaper carousel)
 * - Light/dark mode toggle with reset button
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Sun, Moon, RotateCcw, Maximize2, Square } from "lucide-react";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useTheme } from "next-themes";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useWallpaperContext } from "@/contexts/WallpaperContext";
import { useLayoutPreferences, type LayoutMode } from "@/contexts/LayoutPreferencesContext";
import { useThemeSwatch } from "@/hooks/useThemeSwatch";
import { defaultPalette } from "@/data/themes";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import {
  PALETTE_STORAGE_KEY,
  PALETTE_COOKIE_NAME,
  WALLPAPER_PREFS_STORAGE_KEY,
  WALLPAPER_COOKIE_NAME,
  LAYOUT_MODE_STORAGE_KEY,
  LAYOUT_MODE_COOKIE_NAME,
} from "@/config/storage";
import { ThemeSwatch } from "./ThemeSwatch";
import { ThemeSelector } from "./ThemeSelector";
import { WallpaperPicker } from "./WallpaperPicker";

/** Default layout mode when resetting */
const DEFAULT_LAYOUT_MODE: LayoutMode = "boxed";

export function ThemeControl() {
  const mounted = useHasMounted();
  const [open, setOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { activeTheme, setActiveTheme } = useThemeContext();
  const { activeWallpaper, setActiveWallpaper, isWallpaperEnabled, setWallpaperEnabled } = useWallpaperContext();
  const { layoutMode, setLayoutMode } = useLayoutPreferences();
  const { theme, setTheme } = useTheme();
  const swatchColors = useThemeSwatch();
  const { windowContainerMaxWidth } = DEFAULT_LAYOUT_TOKENS;

  // Track viewport width for layout mode button availability
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Sync with external browser state (window dimensions)
    setViewportWidth(window.innerWidth);

    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Layout mode toggle is only meaningful on wide viewports
  const isLayoutToggleEnabled = viewportWidth > windowContainerMaxWidth;

  // Reset is only meaningful if there are custom preferences
  const hasCustomPreferences =
    activeTheme !== defaultPalette ||
    layoutMode !== DEFAULT_LAYOUT_MODE ||
    theme !== "dark" ||
    (typeof window !== "undefined" && localStorage.getItem(WALLPAPER_PREFS_STORAGE_KEY) !== null);

  // Workaround for Radix bug #2782: after interacting inside a Popover,
  // the first outside click is swallowed. This listener ensures single-click close.
  // See: https://github.com/radix-ui/primitives/issues/2782
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Element;
      const popoverContent = document.querySelector('[data-slot="popover-content"]');
      const isInsideTrigger = triggerRef.current?.contains(target);
      const isInsideContent = popoverContent?.contains(target);

      if (!isInsideTrigger && !isInsideContent) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, { capture: true });
    return () => document.removeEventListener("pointerdown", handlePointerDown, { capture: true });
  }, [open]);

  const toggleMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  /**
   * Delete a cookie by name (client-side).
   * Sets expiry to the past to remove it.
   */
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };

  /**
   * Reset all theme/wallpaper/layout preferences to defaults.
   * Clears localStorage and cookies, resets state to defaults.
   * Note: Wallpaper resets automatically via WallpaperContext's theme-change effect
   * (reads empty prefs from localStorage and falls back to theme default).
   */
  const resetToDefaults = () => {
    // Clear localStorage
    localStorage.removeItem(PALETTE_STORAGE_KEY);
    localStorage.removeItem(WALLPAPER_PREFS_STORAGE_KEY);
    localStorage.removeItem(LAYOUT_MODE_STORAGE_KEY);

    // Clear cookies
    deleteCookie(PALETTE_COOKIE_NAME);
    deleteCookie(WALLPAPER_COOKIE_NAME);
    deleteCookie(LAYOUT_MODE_COOKIE_NAME);

    // Reset state to defaults
    // Wallpaper resets automatically when theme changes (context reads cleared prefs)
    setActiveTheme(defaultPalette);
    setLayoutMode(DEFAULT_LAYOUT_MODE);
    setTheme("dark");
  };

  const toggleLayoutMode = () => {
    setLayoutMode(layoutMode === "wide" ? "boxed" : "wide");
  };

  // Before hydration: render placeholder to avoid color mismatch
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Open theme settings"
        disabled
        className="flex items-center gap-1 px-1.5 h-7 rounded-md border border-border transition-all"
      >
        {/* Placeholder swatch - 8 blocks at 16px with no gap */}
        <div data-testid="theme-swatch" aria-hidden="true" className="flex">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} data-testid="swatch-square" className="bg-muted" style={{ width: "16px", height: "16px" }} />
          ))}
        </div>
        <ChevronDown data-testid="theme-control-chevron" className="w-3 h-3 text-muted-foreground" />
      </button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          aria-label="Open theme settings"
          className="group flex items-center gap-1 px-1.5 h-7 rounded-md border border-transparent hover:border-foreground/60 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all"
        >
          <ThemeSwatch colors={swatchColors} size={16} />
          <ChevronDown
            data-testid="theme-control-chevron"
            className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-auto p-3">
        <div className="flex flex-col gap-3">
          {/* Theme Selector Section */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Theme</h3>
            <ThemeSelector selectedTheme={activeTheme} onSelect={setActiveTheme} />
          </div>

          {/* Wallpaper Picker Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Wallpaper</h3>
              <Switch
                checked={isWallpaperEnabled}
                onCheckedChange={setWallpaperEnabled}
                aria-label="Enable wallpaper"
                data-testid="wallpaper-toggle"
              />
            </div>
            <WallpaperPicker
              selectedWallpaper={activeWallpaper}
              onSelect={setActiveWallpaper}
              isEnabled={isWallpaperEnabled}
            />
          </div>

          {/* Mode Toggle, Layout Toggle & Reset */}
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                toggleMode();
                e.currentTarget.blur();
              }}
              aria-label={`Current mode: ${theme}. Click to switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="gap-2"
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
              variant="outline"
              size="sm"
              onClick={(e) => {
                toggleLayoutMode();
                e.currentTarget.blur();
              }}
              disabled={!isLayoutToggleEnabled}
              aria-label={`Current layout: ${layoutMode}. Click to switch to ${layoutMode === "wide" ? "boxed" : "wide"} layout`}
              title={!isLayoutToggleEnabled ? "Viewport too narrow for layout toggle" : undefined}
              className="min-w-[5.25rem] gap-2"
            >
              {layoutMode === "wide" ? (
                <>
                  <Maximize2 className="h-4 w-4" />
                  <span>Wide</span>
                </>
              ) : (
                <>
                  <Square className="h-4 w-4" />
                  <span>Boxed</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                resetToDefaults();
                e.currentTarget.blur();
              }}
              aria-label="Reset all preferences to defaults"
              disabled={!hasCustomPreferences}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
