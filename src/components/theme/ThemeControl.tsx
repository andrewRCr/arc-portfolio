/**
 * ThemeControl Component
 *
 * Combined theme/wallpaper control dropdown for the TopBar.
 * Shows a compact swatch trigger that expands to reveal:
 * - ThemeSelector (palette selection)
 * - Light/dark mode toggle
 * - WallpaperPicker (wallpaper carousel)
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useWallpaperContext } from "@/contexts/WallpaperContext";
import { useThemeSwatch } from "@/hooks/useThemeSwatch";
import { ThemeSwatch } from "./ThemeSwatch";
import { ThemeSelector } from "./ThemeSelector";
import { WallpaperPicker } from "./WallpaperPicker";

export function ThemeControl() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { activeTheme, setActiveTheme } = useThemeContext();
  const { activeWallpaper, setActiveWallpaper } = useWallpaperContext();
  const { theme, setTheme } = useTheme();
  const swatchColors = useThemeSwatch();

  // Avoid hydration mismatch - theme colors differ between server and client
  // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional hydration pattern
  useEffect(() => setMounted(true), []);

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
          <ChevronDown data-testid="theme-control-chevron" className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-auto p-3">
        <div className="flex flex-col gap-4">
          {/* Theme Selector Section */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Theme</h3>
            <ThemeSelector selectedTheme={activeTheme} onSelect={setActiveTheme} />
          </div>

          {/* Light/Dark Mode Toggle */}
          <div className="border-t border-border pt-3">
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Mode</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                toggleMode();
                e.currentTarget.blur();
              }}
              aria-label={`Current mode: ${theme}. Click to switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="w-full justify-start gap-2"
            >
              {theme === "dark" ? (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Dark mode</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" />
                  <span>Light mode</span>
                </>
              )}
            </Button>
          </div>

          {/* Wallpaper Picker Section */}
          <div className="border-t border-border pt-3">
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Wallpaper</h3>
            <WallpaperPicker selectedWallpaper={activeWallpaper} onSelect={setActiveWallpaper} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
