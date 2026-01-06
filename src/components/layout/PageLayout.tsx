"use client";

import { useEffect, useState } from "react";
import { OverlayScrollbars } from "overlayscrollbars";
import "overlayscrollbars/styles/overlayscrollbars.css";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { useScrollShadow } from "@/hooks/useScrollShadow";
import { ScrollShadow } from "./ScrollShadow";

/**
 * PageLayout Component
 *
 * Provides consistent page structure with optional fixed header and scrollable content.
 * The header stays fixed while content scrolls independently - scrollbar only appears
 * in the content area, not spanning the full page height.
 *
 * Includes scroll shadow affordances: radial gradient shadows at top/bottom edges
 * indicating scrollable content in that direction.
 *
 * Content is centered with a max-width constraint by default (controlled by layout tokens).
 *
 * Usage:
 * - With header: <PageLayout header={<PageHeader title="..." />}>{content}</PageLayout>
 * - Without header: <PageLayout>{content}</PageLayout>
 * - Full width: <PageLayout fullWidth>{content}</PageLayout>
 */

export interface PageLayoutProps {
  /** Optional fixed header content (PageHeader, DevPageHeader, or custom) */
  header?: React.ReactNode;
  /** Scrollable page content */
  children: React.ReactNode;
  /** Disable content width constraint (default: false) */
  fullWidth?: boolean;
}

export function PageLayout({ header, children, fullWidth = false }: PageLayoutProps) {
  const { contentMaxWidth, contentPaddingY, contentPaddingX } = DEFAULT_LAYOUT_TOKENS;
  const { ref: scrollShadowRef, showTopShadow, showBottomShadow } = useScrollShadow();
  const [element, setElement] = useState<HTMLElement | null>(null);

  // Initialize OverlayScrollbars and connect its viewport to scroll shadow detection
  useEffect(() => {
    if (!element) return;

    const instance = OverlayScrollbars(element, {
      scrollbars: {
        theme: "os-theme-dark",
        autoHide: "leave",
        autoHideDelay: 1000,
      },
    });

    // OverlayScrollbars creates its own viewport - use that for scroll detection
    const { viewport } = instance.elements();
    scrollShadowRef(viewport);

    return () => {
      scrollShadowRef(null);
      instance.destroy();
    };
  }, [element, scrollShadowRef]);

  // Header only needs horizontal padding and max-width (no vertical padding)
  const headerStyle = {
    ...(fullWidth ? {} : { maxWidth: contentMaxWidth }),
    paddingLeft: contentPaddingX,
    paddingRight: contentPaddingX,
  };

  // Scrollable content gets full padding on all sides
  const contentStyle = {
    ...(fullWidth ? {} : { maxWidth: contentMaxWidth }),
    paddingTop: contentPaddingY,
    paddingBottom: contentPaddingY,
    paddingLeft: contentPaddingX,
    paddingRight: contentPaddingX,
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Fixed header area - doesn't scroll, centered with max-width */}
      {header && (
        <div className="shrink-0">
          <div className="mx-auto w-full" style={headerStyle}>
            {header}
          </div>
        </div>
      )}

      {/* Scrollable content area with scroll shadows */}
      <div className="relative flex-1 min-h-0">
        <main ref={setElement} className="h-full overflow-auto" data-overlayscrollbars-initialize>
          <div className="mx-auto w-full min-h-full" style={contentStyle}>
            {children}
          </div>
        </main>
        <ScrollShadow position="top" visible={showTopShadow} />
        <ScrollShadow position="bottom" visible={showBottomShadow} />
      </div>
    </div>
  );
}
