"use client";

import { SITE } from "@/config/site";
import { useIsPhone } from "@/hooks/useMediaQuery";

/**
 * Hero Component
 *
 * Home page hero with terminal-inspired styling. Rendered in PageLayout's
 * header slot (fixed above scroll area). Includes "Featured Projects" heading
 * to anchor the scroll shadow at the header boundary.
 *
 * Responsive behavior:
 * - Phone (< 640px): Condensed single-line tagline
 * - Tablet: Two-line tagline
 * - Desktop: Single line with pipe separator
 */
export function Hero() {
  const isPhone = useIsPhone();

  const renderTagline = () => {
    const parts = SITE.tagline.split(" | ");
    if (parts.length !== 2) {
      return SITE.tagline;
    }

    // Phone: primary tagline only (saves vertical space)
    if (isPhone) {
      return parts[0];
    }

    // Tablet/Desktop: full tagline with responsive formatting
    return (
      <>
        {parts[0]}
        <br className="md:hidden" />
        <span className="hidden md:inline">&nbsp; | &nbsp;</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="pt-4 px-2 md:pt-8 md:px-8">
      <div className="pl-0 md:pl-2 pb-2">
        <div className="border-l-2 border-primary pl-6">
          <div className="space-y-4 md:mb-8">
            <div className="space-y-2">
              <p className="text-xs font-mono text-muted-foreground">&gt; portfolio.init()</p>
              <h1 className="text-4xl font-bold font-mono">{SITE.name}</h1>
              <p className="text-lg text-muted-foreground">{renderTagline()}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mt-4 md:mt-2 mb-1 text-sm font-mono text-muted-foreground">Featured Projects</h2>
    </div>
  );
}
