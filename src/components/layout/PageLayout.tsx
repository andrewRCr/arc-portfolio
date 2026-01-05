"use client";

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
  const { contentMaxWidth } = DEFAULT_LAYOUT_TOKENS;
  const { ref, showTopShadow, showBottomShadow } = useScrollShadow();

  const contentStyle = fullWidth ? undefined : { maxWidth: contentMaxWidth };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Fixed header area - doesn't scroll, centered with max-width */}
      {header && (
        <div className="shrink-0">
          <div className="mx-auto w-full" style={contentStyle}>
            {header}
          </div>
        </div>
      )}

      {/* Scrollable content area with scroll shadows */}
      <div className="relative flex-1 min-h-0">
        <main ref={ref} className="h-full overflow-auto">
          <div className="mx-auto w-full min-h-full pt-3 pb-4 px-2" style={contentStyle}>
            {children}
          </div>
        </main>
        <ScrollShadow position="top" visible={showTopShadow} />
        <ScrollShadow position="bottom" visible={showBottomShadow} />
      </div>
    </div>
  );
}
