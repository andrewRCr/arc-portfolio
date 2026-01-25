/**
 * useThemeTransition Hook
 *
 * Provides theme toggling between light and dark modes.
 * Smooth transitions are handled via CSS (see globals.css).
 */

import { useCallback } from "react";
import { useTheme } from "next-themes";

export interface UseThemeTransitionReturn {
  /** Current theme ("light" | "dark" | "system") */
  theme: string | undefined;
  /** Direct theme setter */
  setTheme: (theme: string) => void;
  /** Toggle between light/dark mode */
  toggleTheme: () => void;
}

/**
 * Hook for toggling between light and dark mode.
 *
 * @example
 * ```tsx
 * function ThemeButton() {
 *   const { theme, toggleTheme } = useThemeTransition();
 *   return <button onClick={toggleTheme}>{theme}</button>;
 * }
 * ```
 */
export function useThemeTransition(): UseThemeTransitionReturn {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
