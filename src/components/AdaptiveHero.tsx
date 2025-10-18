"use client";

import { usePathname } from "next/navigation";

/**
 * AdaptiveHero Component
 *
 * Adapts between two states based on current route:
 * - EXPANDED: Full hero section on home page
 * - COMPACT: Minimal branding header on all other pages
 */

export function AdaptiveHero() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const variant = isHome ? "expanded" : "compact";

  if (variant === "compact") {
    return (
      <div className="px-14 py-2">
        <div className="flex items-center gap-3 border-l-2 border-primary pl-6">
          <h1 className="text-2xl font-bold font-mono">Andrew Creekmore</h1>
          <span className="text-primary font-mono">&gt;_</span>
        </div>
      </div>
    );
  }

  // Expanded version (current hero from page.tsx)
  return (
    <div className="px-14 pt-2 pb-4">
      <div className="space-y-4 border-l-2 border-primary pl-6 mb-12">
        <div className="space-y-2">
          <p className="text-xs font-mono text-muted-foreground">&gt; portfolio.init()</p>
          <h1 className="text-4xl font-bold font-mono">Andrew Creekmore</h1>
          <p className="text-lg text-muted-foreground">Full-stack developer &amp; creative technologist</p>
        </div>
      </div>
    </div>
  );
}
