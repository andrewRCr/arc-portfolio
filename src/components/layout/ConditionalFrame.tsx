"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";

/**
 * ConditionalFrame Component
 *
 * Conditionally renders the inner TUI frame and Navigation based on route.
 * - For /dev/* routes: Renders children directly (no frame, no nav)
 * - For all other routes: Renders inner TUI frame with Navigation
 *
 * This allows dev pages to have the TWM chrome (TopBar, WindowContainer, FooterBar)
 * without the inner frame and navigation links.
 */
export function ConditionalFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDevRoute = pathname?.startsWith("/dev");

  if (isDevRoute) {
    // Dev pages: no inner frame, no navigation, but still need scroll container
    return <div className="flex flex-col flex-1 min-h-0 overflow-auto">{children}</div>;
  }

  // Regular pages: inner TUI frame with navigation
  // Outer padding provides space for Navigation to render above border
  return (
    <div className="flex flex-col flex-1 min-h-0 p-4 md:p-6">
      <div className="relative border-2 border-border rounded-lg flex flex-col flex-1 min-h-0">
        {/* Navigation positioned to intersect the border */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-px -translate-y-1/2 bg-background px-6 z-10">
          <Navigation />
        </div>

        {/* Content area - scrolls independently, TUI frame stays fixed */}
        <div className="flex flex-col flex-1 min-h-0 overflow-auto pt-8 px-4 pb-4 md:px-6 md:pb-6">{children}</div>
      </div>
    </div>
  );
}
