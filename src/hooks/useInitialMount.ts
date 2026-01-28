import { useState, useEffect } from "react";

/**
 * Tracks whether a component is on its initial mount vs a subsequent remount.
 *
 * Used to skip animations on initial SSR hydration (avoiding hydration mismatch)
 * while still playing animations on route-change remounts.
 *
 * Each componentKey maintains independent tracking - different component types
 * can have their own "has ever mounted" state.
 *
 * @param componentKey - Unique identifier for the component type (e.g., "Hero", "PageHeader")
 * @returns true if this is the first-ever mount for this component key
 *
 * @example
 * function Hero() {
 *   const isInitialMount = useInitialMount("Hero");
 *   // Skip animation on initial mount (SSR hydration), play on route change
 *   const skipAnimation = isInitialMount;
 * }
 */

/** Tracks which component keys have mounted (persists across remounts) */
const mountedComponents = new Map<string, boolean>();

export function useInitialMount(componentKey: string): boolean {
  // Capture mount state at render time - stable for this component instance
  const [isInitialMount] = useState(() => !mountedComponents.get(componentKey));

  // Mark as mounted after first render
  useEffect(() => {
    mountedComponents.set(componentKey, true);
  }, [componentKey]);

  return isInitialMount;
}
