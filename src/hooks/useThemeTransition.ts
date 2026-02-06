/**
 * useThemeTransition Hook
 *
 * Provides theme toggling between light and dark modes with smooth CSS transitions.
 * Manages the data-theme-transition attribute lifecycle for scoped transitions.
 *
 * Implementation notes:
 * - Safari requires requestAnimationFrame delay before applying attribute
 * - Uses setTimeout (not transitionend) for cleanup - Safari transitionend unreliable
 * - Handles rapid toggles by clearing previous timeout
 *
 * @see globals.css - Theme transition CSS rules scoped to [data-theme-transition]
 */

import { useCallback, useRef, useEffect } from "react";
import { useTheme } from "next-themes";

/** Transition duration in ms - must match CSS */
const TRANSITION_DURATION = 300;

export interface UseThemeTransitionReturn {
  /** Current theme ("light" | "dark" | "system") */
  theme: string | undefined;
  /** Direct theme setter (with transition) */
  setTheme: (theme: string) => void;
  /** Toggle between light/dark mode */
  toggleTheme: () => void;
}

/**
 * Hook for toggling between light and dark mode with smooth transitions.
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
  const { theme, setTheme: nextThemesSetTheme } = useTheme();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount - ensure attribute is removed if component unmounts mid-transition
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.documentElement.removeAttribute("data-theme-transition");
    };
  }, []);

  const applyThemeWithTransition = useCallback(
    (newTheme: string) => {
      const html = document.documentElement;

      // Clear any pending timeout (handles rapid toggles)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Safari fix: ensure attribute applies after render frame
      // Safari requires elements to be rendered BEFORE transition-triggering
      // attribute is applied, otherwise transitions fail silently
      requestAnimationFrame(() => {
        html.setAttribute("data-theme-transition", "true");

        // Apply theme change (next-themes handles the .dark class toggle)
        nextThemesSetTheme(newTheme);

        // Remove attribute after transition completes
        // Use setTimeout, NOT transitionend - Safari doesn't reliably fire transitionend
        timeoutRef.current = setTimeout(() => {
          html.removeAttribute("data-theme-transition");
          timeoutRef.current = null;
        }, TRANSITION_DURATION);
      });
    },
    [nextThemesSetTheme]
  );

  const toggleTheme = useCallback(() => {
    // Intentionally uses raw theme value - "system"/undefined maps to dark
    // as the portfolio is primarily designed around dark mode aesthetics
    const newTheme = theme === "dark" ? "light" : "dark";
    applyThemeWithTransition(newTheme);
  }, [theme, applyThemeWithTransition]);

  return {
    theme,
    setTheme: applyThemeWithTransition,
    toggleTheme,
  };
}
