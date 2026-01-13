"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { Navigation } from "./Navigation";

/**
 * ConditionalFrame Component
 *
 * Conditionally renders the inner TUI frame and Navigation based on route.
 * - For /dev/* routes: Renders children directly (no frame, no nav)
 * - For all other routes: Renders inner TUI frame with Navigation
 *
 * This component provides the frame structure but NOT scrolling.
 * Pages use PageLayout to handle header/content scroll separation.
 *
 * **FOUC Prevention:**
 * The TUI frame border gap uses CSS custom property `--nav-gap-half` which
 * is set via media query in globals.css. This ensures the correct gap width
 * renders on first paint without waiting for JavaScript hydration.
 */
export function ConditionalFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDevRoute = pathname?.startsWith("/dev");
  const { navGapDepth, windowBorderWidth, contentMaxWidth, tuiFrameMaxWidth } = DEFAULT_LAYOUT_TOKENS;

  if (isDevRoute) {
    // Dev pages: no inner frame, no navigation
    // Pages handle their own scroll structure via PageLayout
    return (
      <div className="flex flex-col flex-1 min-h-0 p-4 md:p-6">
        <div
          data-testid="content-wrapper"
          className="flex flex-col flex-1 min-h-0 mx-auto w-full"
          style={{ maxWidth: contentMaxWidth }}
        >
          {children}
        </div>
      </div>
    );
  }

  // Regular pages: inner TUI frame with navigation
  // Outer padding provides space for Navigation to render above border
  // Mobile: extra top padding for nav clearance, tighter sides/bottom
  // Note: --nav-gap-half is defined in globals.css with responsive media query
  const borderClipPath = `polygon(
    0 0,
    calc(50% - var(--nav-gap-half)) 0,
    calc(50% - var(--nav-gap-half)) ${navGapDepth}px,
    calc(50% + var(--nav-gap-half)) ${navGapDepth}px,
    calc(50% + var(--nav-gap-half)) 0,
    100% 0,
    100% 100%,
    0 100%
  )`;

  return (
    <div className="flex flex-col flex-1 min-h-0 pt-6 px-4 pb-4 md:py-6 md:px-6">
      <div
        data-testid="content-wrapper"
        className="relative rounded-lg flex flex-col flex-1 min-h-0 mx-auto w-full"
        style={{ maxWidth: tuiFrameMaxWidth }}
      >
        {/* TUI frame border - clip-path creates gap for Navigation */}
        <div
          className="absolute inset-0 border-solid border-border-strong rounded-lg pointer-events-none"
          style={
            {
              borderWidth: windowBorderWidth,
              WebkitClipPath: borderClipPath,
              clipPath: borderClipPath,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />

        {/* Navigation positioned in the border gap */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-px -translate-y-1/2 px-6 z-10">
          <Navigation />
        </div>

        {/* Content area - pages handle scroll via PageLayout */}
        <div className="flex flex-col flex-1 min-h-0 pt-6 px-4 pb-0.5 md:pt-8 md:px-6">{children}</div>
      </div>
    </div>
  );
}
