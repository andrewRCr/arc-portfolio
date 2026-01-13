import { useState, useEffect } from "react";

/**
 * Hook to detect when the component has mounted on the client.
 *
 * Used to prevent SSR hydration mismatches for components that render
 * differently on server vs client (e.g., theme-dependent UI, browser APIs).
 *
 * @returns `true` after the component has mounted, `false` during SSR and initial render
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const hasMounted = useHasMounted();
 *
 *   // Render placeholder during SSR to avoid hydration mismatch
 *   if (!hasMounted) {
 *     return <div className="w-9 h-9" />;
 *   }
 *
 *   return <Button onClick={toggleTheme}>...</Button>;
 * }
 * ```
 */
export function useHasMounted(): boolean {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: standard hydration pattern to detect client mount
    setHasMounted(true);
  }, []);

  return hasMounted;
}
