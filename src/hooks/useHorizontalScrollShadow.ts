"use client";

import { useState, useEffect, useCallback } from "react";

/** Threshold in pixels from left/right to consider "at edge" */
const SCROLL_THRESHOLD = 10;

/**
 * Return type for useHorizontalScrollShadow hook.
 */
export interface UseHorizontalScrollShadowResult {
  /** Callback ref to attach to the scrollable container */
  ref: (node: HTMLElement | null) => void;
  /** Whether to show the left scroll shadow */
  showLeftShadow: boolean;
  /** Whether to show the right scroll shadow */
  showRightShadow: boolean;
}

/**
 * Custom hook for detecting horizontal scroll overflow and position.
 *
 * Returns a callback ref to attach to a horizontally scrollable container
 * and booleans indicating whether scroll shadow indicators should be shown:
 * - Left shadow: shown when scrolled right (not at left edge)
 * - Right shadow: shown when more content to the right (not at right edge)
 *
 * Automatically updates on:
 * - Scroll events
 * - Container resize (via ResizeObserver)
 *
 * @returns Object with `ref` callback and shadow visibility booleans
 *
 * @example
 * ```tsx
 * function HorizontalScroller() {
 *   const { ref, showLeftShadow, showRightShadow } = useHorizontalScrollShadow();
 *
 *   return (
 *     <div className="relative">
 *       <div ref={ref} className="overflow-x-auto">
 *         {content}
 *       </div>
 *       <ScrollShadow position="left" visible={showLeftShadow} />
 *       <ScrollShadow position="right" visible={showRightShadow} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useHorizontalScrollShadow(): UseHorizontalScrollShadowResult {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  // Callback ref for attaching to DOM element
  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const evaluate = () => {
      const hasOverflow = element.scrollWidth > element.clientWidth;

      // Left shadow: show when scrolled right from left edge
      const atLeft = element.scrollLeft <= SCROLL_THRESHOLD;
      setShowLeftShadow(hasOverflow && !atLeft);

      // Right shadow: show when not scrolled to right edge
      const distanceFromRight = element.scrollWidth - element.clientWidth - element.scrollLeft;
      const atRight = distanceFromRight <= SCROLL_THRESHOLD;
      setShowRightShadow(hasOverflow && !atRight);
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
    showLeftShadow: element ? showLeftShadow : false,
    showRightShadow: element ? showRightShadow : false,
  };
}
