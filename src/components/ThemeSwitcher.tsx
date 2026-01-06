"use client";

import { useThemeContext } from "@/contexts/ThemeContext";
import { themes, type ThemeName } from "@/data/themes";

/**
 * ThemeSwitcher
 *
 * Simple theme selection component.
 * Allows switching between available themes (Gruvbox, Rose Pine).
 *
 * This is a functional prototype for the more sophisticated theme picker
 * planned for the TWM Layout System (top bar theme controls).
 */
export function ThemeSwitcher() {
  const { activeTheme, setActiveTheme } = useThemeContext();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveTheme(event.target.value as ThemeName);
  };

  const themeNames = Object.keys(themes) as ThemeName[];

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme-select" className="pl-2 text-sm text-muted-foreground">
        Theme:
      </label>
      <select
        id="theme-select"
        value={activeTheme}
        onChange={handleThemeChange}
        className="rounded border border-border px-2 py-1 text-sm text-foreground transition-colors focus:bg-card hover:border-secondary/60 focus-visible:border-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {themeNames.map((themeName) => (
          <option key={themeName} value={themeName}>
            {themes[themeName].label}
          </option>
        ))}
      </select>
    </div>
  );
}
