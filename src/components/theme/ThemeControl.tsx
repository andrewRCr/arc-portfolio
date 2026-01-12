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
import { useResetPreferences } from "@/hooks/useResetPreferences";
import { usePreferenceAnnouncements } from "@/hooks/usePreferenceAnnouncements";
import { useTheme } from "next-themes";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScreenReaderAnnounce } from "@/components/ui/screen-reader-announce";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useWallpaperContext } from "@/contexts/WallpaperContext";
import { useLayoutPreferences } from "@/contexts/LayoutPreferencesContext";
import { useThemeSwatch } from "@/hooks/useThemeSwatch";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { ThemeSwatch } from "./ThemeSwatch";
import { ThemeSelector } from "./ThemeSelector";
import { WallpaperPicker } from "./WallpaperPicker";
import { ThemeControlPlaceholder } from "./ThemeControlPlaceholder";

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
  const { hasCustomPreferences, resetToDefaults } = useResetPreferences();
  const { windowContainerMaxWidth } = DEFAULT_LAYOUT_TOKENS;
  const announcement = usePreferenceAnnouncements({
    activeTheme,
    activeWallpaper,
    mode: theme,
    layoutMode,
  });

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

  const toggleLayoutMode = () => {
    setLayoutMode(layoutMode === "wide" ? "boxed" : "wide");
  };

  // Before hydration: render placeholder to avoid layout shift and color mismatch
  if (!mounted) {
    return <ThemeControlPlaceholder />;
  }

  return (
    <>
      <ScreenReaderAnnounce message={announcement} />
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
    </>
  );
}
