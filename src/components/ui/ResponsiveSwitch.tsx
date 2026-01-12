import type { ReactNode } from "react";

/** Supported display types for wrapper elements */
type DisplayType = "block" | "flex" | "inline-flex";

/**
 * Props for the ResponsiveSwitch component.
 */
export interface ResponsiveSwitchProps {
  /** Content to show on phone viewports (< 768px) */
  mobile: ReactNode;
  /** Content to show on tablet and above (>= 768px) */
  desktop: ReactNode;
  /** Optional class name for the wrapper divs */
  className?: string;
  /** Display type for wrappers when visible. Defaults to "block". Use "flex" for flex layouts. */
  display?: DisplayType;
}

/** Maps display type to Tailwind classes for mobile (visible) and desktop (hidden→visible) */
const displayClasses: Record<DisplayType, { mobile: string; desktop: string }> = {
  block: { mobile: "block", desktop: "md:block" },
  flex: { mobile: "flex", desktop: "md:flex" },
  "inline-flex": { mobile: "inline-flex", desktop: "md:inline-flex" },
};

/**
 * ResponsiveSwitch Component
 *
 * Renders both mobile and desktop content, using CSS media queries to control
 * visibility. This prevents hydration flash that occurs with JS-based viewport
 * detection (useMediaQuery).
 *
 * **Why this pattern?**
 * - JS-based detection (useMediaQuery) returns false on server, causing flash
 * - CSS media queries apply instantly, before any JavaScript runs
 * - Both elements render in DOM, but only one is visible via display:none
 * - CSS display:none removes elements from accessibility tree
 *
 * **Breakpoint:**
 * Uses Tailwind's `md` breakpoint (768px) to match standard responsive design.
 *
 * @example
 * ```tsx
 * // Default block display
 * <ResponsiveSwitch
 *   mobile={<MobileNavigation />}
 *   desktop={<DesktopNavigation />}
 * />
 *
 * // Flex display for flex layouts
 * <ResponsiveSwitch
 *   display="flex"
 *   className="items-center gap-2"
 *   mobile={<MobileControls />}
 *   desktop={<DesktopControls />}
 * />
 * ```
 */
export function ResponsiveSwitch({ mobile, desktop, className, display = "block" }: ResponsiveSwitchProps) {
  const classes = displayClasses[display];

  return (
    <>
      {/* Mobile content - visible below md breakpoint */}
      <div className={`${classes.mobile} md:hidden ${className ?? ""}`}>{mobile}</div>

      {/* Desktop content - visible at md breakpoint and above */}
      <div className={`hidden ${classes.desktop} ${className ?? ""}`}>{desktop}</div>
    </>
  );
}
