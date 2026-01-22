import { useState, useEffect } from "react";

/**
 * useDelayedShow - Delays showing content to avoid hydration flash
 *
 * Returns a boolean that starts false and becomes true after the specified delay.
 * Useful for fading in content that depends on client-side state (theme, randomization, etc.)
 * to mask hydration mismatches with a smooth transition.
 *
 * @param delay - Milliseconds to wait before showing (default: 150ms)
 * @returns boolean - Whether content should be shown/visible
 *
 * @example
 * const show = useDelayedShow(150);
 * return <div className={`transition-opacity ${show ? 'opacity-100' : 'opacity-0'}`}>...</div>
 */
export function useDelayedShow(delay: number = 150): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return show;
}
