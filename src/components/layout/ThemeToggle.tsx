"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional hydration pattern
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Before hydration: render both icons, CSS shows correct one based on html.dark class
    // This prevents FOUC since blocking script already set the theme class
    return (
      <Button variant="outline" size="icon-xs" disabled aria-label="Toggle color mode">
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
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`Current mode: ${theme}. Click to switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
    </Button>
  );
}
