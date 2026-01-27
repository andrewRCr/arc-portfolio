"use client";

import { usePathname } from "next/navigation";

/**
 * PageTransition Component
 *
 * Provides route-change remounting for page content. Uses pathname as key
 * to ensure content remounts on navigation, triggering entry animations
 * in child components (PageLayout handles the actual animations).
 *
 * Frame elements (TopBar, FooterBar, Navigation, TUI frame) remain static -
 * only the content passed as children remounts.
 *
 * Note: Exit animations with AnimatePresence don't work reliably in Next.js
 * App Router due to internal context handling. Entry-only animations in
 * PageLayout provide a similar feel without dependency on internal APIs.
 */

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} data-testid="page-transition" className="flex flex-col flex-1 min-h-0">
      {children}
    </div>
  );
}
