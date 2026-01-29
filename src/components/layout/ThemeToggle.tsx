"use client";

import { useThemeTransition } from "@/hooks/useThemeTransition";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/hooks/useHasMounted";

/**
 * ThemeToggle Component
 *
 * Icon button to toggle between light and dark color modes.
 * Shows the current mode (sun for light, moon for dark).
 * Uses next-themes for theme management with localStorage persistence.
 *
 * FOUC Prevention: Before hydration, renders both icons with CSS-based visibility
 * using the theme class that next-themes' blocking script sets on <html>.
 * This ensures the correct icon shows immediately without waiting for JS.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeTransition();
  const mounted = useHasMounted();

  if (!mounted) {
    // Before hydration: render both icons, CSS shows correct one based on html.dark class
    // This prevents FOUC since blocking script already set the theme class
    return (
      <Button
        variant="outline"
        size="icon-xs"
        disabled
        aria-label="Toggle color mode"
        className="border-transparent text-muted-foreground will-change-transform"
      >
        {/* Show Moon in dark mode, Sun in light mode - CSS controlled */}
        <Moon className="hidden dark:block h-3.5 w-3.5" />
        <Sun className="block dark:hidden h-3.5 w-3.5" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon-xs"
      onClick={toggleTheme}
      aria-label={`Current mode: ${theme}. Click to switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="border-transparent hover:border-transparent text-muted-foreground hover:text-foreground will-change-transform"
    >
      {theme === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
    </Button>
  );
}
