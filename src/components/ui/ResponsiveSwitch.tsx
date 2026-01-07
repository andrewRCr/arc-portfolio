import type { ReactNode } from "react";

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
}

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
 * <ResponsiveSwitch
 *   mobile={<MobileNavigation />}
 *   desktop={<DesktopNavigation />}
 * />
 * ```
 */
export function ResponsiveSwitch({ mobile, desktop, className }: ResponsiveSwitchProps) {
  return (
    <>
      {/* Mobile content - visible below md breakpoint */}
      <div className={`block md:hidden ${className ?? ""}`}>{mobile}</div>

      {/* Desktop content - visible at md breakpoint and above */}
      <div className={`hidden md:block ${className ?? ""}`}>{desktop}</div>
    </>
  );
}
