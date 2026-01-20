/**
 * State-driven crossfade for toggling between two content states.
 *
 * Renders both content elements simultaneously and toggles opacity based on
 * the `active` prop. The visible content stays in normal document flow while
 * the hidden content is positioned absolutely to prevent layout shift.
 *
 * Respects prefers-reduced-motion by disabling transitions.
 *
 * @see useDelayedShow - Timer-driven, one-time fade-in for hydration
 * @see useHeaderCrossfade - Scroll-position driven, continuous opacity
 */

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CrossfadeProps {
  /** Whether to show activeContent (true) or inactiveContent (false) */
  active: boolean;
  /** Content shown when active is true */
  activeContent: ReactNode;
  /** Content shown when active is false */
  inactiveContent: ReactNode;
  /** Additional classes for the container */
  className?: string;
}

export default function Crossfade({
  active,
  activeContent,
  inactiveContent,
  className,
}: CrossfadeProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Active content - in flow when visible, absolute when hidden */}
      <div
        className={cn(
          "transition-opacity duration-200 motion-reduce:transition-none",
          active ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
        )}
        aria-hidden={!active}
      >
        {activeContent}
      </div>

      {/* Inactive content - in flow when visible, absolute when hidden */}
      <div
        className={cn(
          "transition-opacity duration-200 motion-reduce:transition-none",
          active ? "pointer-events-none absolute inset-0 opacity-0" : "opacity-100"
        )}
        aria-hidden={active}
      >
        {inactiveContent}
      </div>
    </div>
  );
}
