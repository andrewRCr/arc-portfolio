"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { useMediaQuery, PHONE_QUERY } from "@/hooks/useMediaQuery";
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
 * The TUI frame border gap adjusts for viewport:
 * - Phone: Narrower gap for collapsed dropdown navigation
 * - Tablet+: Full gap for horizontal navigation links
 */
export function ConditionalFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPhone = useMediaQuery(PHONE_QUERY);
  const isDevRoute = pathname?.startsWith("/dev");
  const { navGapHalf, navGapHalfMobile, navGapDepth, windowBorderWidth, contentMaxWidth } = DEFAULT_LAYOUT_TOKENS;

  // Use narrower gap for mobile collapsed navigation
  const currentNavGapHalf = isPhone ? navGapHalfMobile : navGapHalf;

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
  return (
    <div className="flex flex-col flex-1 min-h-0 pt-6 px-4 pb-4 md:p-6">
      <div
        data-testid="content-wrapper"
        className="relative rounded-lg flex flex-col flex-1 min-h-0 mx-auto w-full"
        style={{ maxWidth: contentMaxWidth }}
      >
        {/* TUI frame border - clip-path creates gap for Navigation */}
        <div
          className="absolute inset-0 border-solid border-border-strong rounded-lg pointer-events-none"
          style={{
            borderWidth: windowBorderWidth,
            clipPath: `polygon(
              0 0,
              calc(50% - ${currentNavGapHalf}px) 0,
              calc(50% - ${currentNavGapHalf}px) ${navGapDepth}px,
              calc(50% + ${currentNavGapHalf}px) ${navGapDepth}px,
              calc(50% + ${currentNavGapHalf}px) 0,
              100% 0,
              100% 100%,
              0 100%
            )`,
          }}
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
