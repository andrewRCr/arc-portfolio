"use client";

import { useSyncExternalStore, useCallback } from "react";

/**
 * Custom hook for responsive behavior based on CSS media queries.
 *
 * SSR-safe: Returns `false` during server-side rendering and hydrates
 * correctly on the client. Uses `matchMedia` API for efficient updates.
 *
 * Uses `useSyncExternalStore` for proper React 18+ external store integration.
 *
 * @param query - CSS media query string (e.g., "(max-width: 767px)")
 * @returns `true` if the media query matches, `false` otherwise
 *
 * @example
 * ```tsx
 * // Detect phone viewport (below md breakpoint)
 * const isPhone = useMediaQuery("(max-width: 767px)");
 *
 * // Detect touch device
 * const isTouchDevice = useMediaQuery("(hover: none) and (pointer: coarse)");
 *
 * // Conditional rendering
 * return isPhone ? <MobileNav /> : <DesktopNav />;
 * ```
 */
export function useMediaQuery(query: string): boolean {
  // Subscribe to media query changes
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) {
        return () => {};
      }

      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", callback);

      return () => {
        mediaQuery.removeEventListener("change", callback);
      };
    },
    [query]
  );

  // Get current snapshot of media query state
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return false;
    }
    return window.matchMedia(query).matches;
  }, [query]);

  // Server snapshot always returns false (SSR-safe)
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Preset media query for phone viewport (below Tailwind md breakpoint).
 * Use this for mobile-specific behavior like collapsed navigation.
 */
export const PHONE_QUERY = "(max-width: 767px)";

/**
 * Preset media query for touch devices.
 * Use this for touch-specific behavior like tap targets.
 */
export const TOUCH_DEVICE_QUERY = "(hover: none) and (pointer: coarse)";
