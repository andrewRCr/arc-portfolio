"use client";

/**
 * BackToTopButton Component
 *
 * Floating button that scrolls the viewport to top. Fades in when user scrolls
 * down, synchronized with the compact header crossfade effect.
 */

import { ChevronUp } from "lucide-react";
import { useHeaderCrossfade } from "@/hooks/useHeaderCrossfade";
import { useScrollViewport } from "@/components/layout/ScrollContext";

export function BackToTopButton() {
  const { opacity, isExpanded: isVisible } = useHeaderCrossfade("in");
  const { viewport } = useScrollViewport();

  const scrollToTop = () => {
    viewport?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{
        opacity,
        pointerEvents: isVisible ? "auto" : "none",
      }}
      className="fixed bottom-10 right-10 z-50 rounded-full bg-muted p-3 text-foreground shadow-lg transition-colors hover:bg-accent"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  );
}
