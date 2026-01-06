/**
 * ScrollShadow Component
 *
 * A visual affordance indicating scrollable content in a direction.
 * Uses radial gradients that are intense at center and fade at edges,
 * creating a subtle shadow effect that works well with bordered containers.
 *
 * Positioned absolutely at the top or bottom of a relative container that
 * wraps the scrollable area (must be placed outside the scroll container).
 *
 * Uses CSS variables for theme-aware opacity to avoid hydration mismatches.
 * The gradient opacity is defined in globals.css via --scroll-shadow-opacity.
 *
 * Use with `useScrollShadow` hook which provides visibility booleans:
 *
 * @example
 * ```tsx
 * const { ref, showTopShadow, showBottomShadow } = useScrollShadow();
 *
 * <div className="relative">
 *   <div ref={ref} className="overflow-auto">{content}</div>
 *   <ScrollShadow position="top" visible={showTopShadow} />
 *   <ScrollShadow position="bottom" visible={showBottomShadow} />
 * </div>
 * ```
 */

export interface ScrollShadowProps {
  /** Position of the shadow */
  position: "top" | "bottom";
  /** Whether the shadow is visible */
  visible: boolean;
}

export function ScrollShadow({ position, visible }: ScrollShadowProps) {
  const isTop = position === "top";

  return (
    <div
      data-testid={`scroll-shadow-${position}`}
      data-scroll-shadow={position}
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 right-0 h-5 transition-opacity duration-300 ${
        isTop ? "top-0" : "bottom-0"
      } ${visible ? "opacity-100" : "opacity-0"}`}
    />
  );
}
