"use client";

import { useState, useEffect, useCallback } from "react";

/** Threshold in pixels from top/bottom to consider "at edge" */
const SCROLL_THRESHOLD = 10;

/**
 * Return type for useScrollShadow hook.
 */
export interface UseScrollShadowResult {
  /** Callback ref to attach to the scrollable container */
  ref: (node: HTMLElement | null) => void;
  /** Whether to show the top scroll shadow */
  showTopShadow: boolean;
  /** Whether to show the bottom scroll shadow */
  showBottomShadow: boolean;
}

/**
 * Custom hook for detecting scroll overflow and position.
 *
 * Returns a callback ref to attach to a scrollable container and booleans
 * indicating whether scroll shadow indicators should be shown:
 * - Top shadow: shown when scrolled down (not at top)
 * - Bottom shadow: shown when more content below (not at bottom)
 *
 * Automatically updates on:
 * - Scroll events
 * - Container resize (via ResizeObserver)
 *
 * @returns Object with `ref` callback and shadow visibility booleans
 *
 * @example
 * ```tsx
 * function ScrollableContent() {
 *   const { ref, showTopShadow, showBottomShadow } = useScrollShadow();
 *
 *   return (
 *     <div className="relative">
 *       <div ref={ref} className="overflow-auto">
 *         {content}
 *       </div>
 *       <ScrollShadow position="top" visible={showTopShadow} />
 *       <ScrollShadow position="bottom" visible={showBottomShadow} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useScrollShadow(): UseScrollShadowResult {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);

  // Callback ref for attaching to DOM element
  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const evaluate = () => {
      const hasOverflow = element.scrollHeight > element.clientHeight;

      // Top shadow: show when scrolled down from top
      const atTop = element.scrollTop <= SCROLL_THRESHOLD;
      setShowTopShadow(hasOverflow && !atTop);

      // Bottom shadow: show when not scrolled to bottom
      const distanceFromBottom = element.scrollHeight - element.clientHeight - element.scrollTop;
      const atBottom = distanceFromBottom <= SCROLL_THRESHOLD;
      setShowBottomShadow(hasOverflow && !atBottom);
    };

    // Listen for scroll events
    element.addEventListener("scroll", evaluate);

    // Observe size changes
    const resizeObserver = new ResizeObserver(evaluate);
    resizeObserver.observe(element);

    // Initial evaluation
    evaluate();

    return () => {
      element.removeEventListener("scroll", evaluate);
      resizeObserver.disconnect();
    };
  }, [element]);

  // Reset to false when element is null
  return {
    ref,
    showTopShadow: element ? showTopShadow : false,
    showBottomShadow: element ? showBottomShadow : false,
  };
}
