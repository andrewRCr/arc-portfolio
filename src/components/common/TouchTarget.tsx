import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TouchTargetProps {
  children: ReactNode;
  className?: string;
  /**
   * Content alignment within the touch target.
   * Use 'start' or 'end' for edge-positioned elements to avoid
   * visual offset from the centered 44px touch area.
   * @default 'center'
   */
  align?: "center" | "start" | "end";
}

/**
 * TouchTarget wrapper component
 *
 * Provides a 44×44px minimum touch target area (WCAG 2.5.5 AAA)
 * while allowing the visual element inside to remain smaller.
 *
 * Use this to wrap interactive elements that need accessible touch targets
 * without changing their visual appearance.
 */
export function TouchTarget({ children, className, align = "center" }: TouchTargetProps) {
  const alignmentClass = {
    center: "justify-center",
    start: "justify-start",
    end: "justify-end",
  }[align];

  return (
    <div className={cn("flex items-center", alignmentClass, className, "min-h-11 min-w-11")} data-touch-target>
      {children}
    </div>
  );
}
