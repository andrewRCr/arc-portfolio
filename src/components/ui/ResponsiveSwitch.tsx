import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Supported display types for wrapper elements */
type DisplayType = "block" | "flex" | "inline-flex";

/** Supported breakpoints for the switch */
type Breakpoint = "sm" | "md";

/**
 * Props for the ResponsiveSwitch component.
 */
export interface ResponsiveSwitchProps {
  /** Content to show on smaller viewports */
  mobile: ReactNode;
  /** Content to show on larger viewports */
  desktop: ReactNode;
  /** Optional class name for the wrapper divs */
  className?: string;
  /** Display type for wrappers when visible. Defaults to "block". Use "flex" for flex layouts. */
  display?: DisplayType;
  /**
   * Breakpoint at which to switch from mobile to desktop.
   * - "sm" (640px): phone-only mobile, tablet gets desktop
   * - "md" (768px): phone+tablet mobile, desktop only above (default)
   */
  breakpoint?: Breakpoint;
}

/** Maps display type and breakpoint to Tailwind classes */
const getDisplayClasses = (display: DisplayType, breakpoint: Breakpoint) => {
  const bp = breakpoint; // "sm" or "md"
  return {
    mobile: display,
    mobileHidden: `${bp}:hidden`,
    desktop: `hidden ${bp}:${display}`,
  };
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
 * **Breakpoints:**
 * - "md" (default): 768px - standard mobile/desktop split
 * - "sm": 640px - phone-only mobile, tablets get desktop
 *
 * @example
 * ```tsx
 * // Default md breakpoint
 * <ResponsiveSwitch
 *   mobile={<MobileNavigation />}
 *   desktop={<DesktopNavigation />}
 * />
 *
 * // Phone-only mobile (sm breakpoint)
 * <ResponsiveSwitch
 *   breakpoint="sm"
 *   mobile={<PhoneDrawer />}
 *   desktop={<TabletPopover />}
 * />
 * ```
 */
export function ResponsiveSwitch({
  mobile,
  desktop,
  className,
  display = "block",
  breakpoint = "md",
}: ResponsiveSwitchProps) {
  const classes = getDisplayClasses(display, breakpoint);

  return (
    <>
      {/* Mobile content - visible below breakpoint */}
      <div className={cn(classes.mobile, classes.mobileHidden, className)}>{mobile}</div>

      {/* Desktop content - visible at breakpoint and above */}
      <div className={cn(classes.desktop, className)}>{desktop}</div>
    </>
  );
}
