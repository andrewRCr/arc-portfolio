"use client";

/**
 * BackToTopButton Component
 *
 * Floating button that scrolls the viewport to top. Fades in when user scrolls
 * down, with threshold based on header type.
 */

import { ChevronUp } from "lucide-react";
import { useHeaderCrossfade, type HeaderType } from "@/hooks/useHeaderCrossfade";
import { useScrollViewport } from "@/components/layout/ScrollContext";

interface BackToTopButtonProps {
  /** Header type to determine fade threshold (default: "page") */
  headerType?: HeaderType;
}

export function BackToTopButton({ headerType = "page" }: BackToTopButtonProps) {
  const { opacity, isExpanded: isVisible } = useHeaderCrossfade("in", headerType);
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
      className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50 min-h-10 min-w-10 sm:min-h-11 sm:min-w-11 flex items-center justify-center rounded-full bg-surface-muted/80 backdrop-blur-sm border border-border shadow-lg [-webkit-tap-highlight-color:transparent] outline-none transition-colors hover:bg-popover/80 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  );
}
