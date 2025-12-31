"use client";

/**
 * PageLayout Component
 *
 * Provides consistent page structure with optional fixed header and scrollable content.
 * The header stays fixed while content scrolls independently - scrollbar only appears
 * in the content area, not spanning the full page height.
 *
 * Usage:
 * - With header: <PageLayout header={<PageHeader title="..." />}>{content}</PageLayout>
 * - Without header: <PageLayout>{content}</PageLayout>
 */

export interface PageLayoutProps {
  /** Optional fixed header content (PageHeader, DevPageHeader, or custom) */
  header?: React.ReactNode;
  /** Scrollable page content */
  children: React.ReactNode;
}

export function PageLayout({ header, children }: PageLayoutProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Fixed header area - doesn't scroll */}
      {header && <div className="shrink-0">{header}</div>}

      {/* Scrollable content area - scrollbar only here */}
      <div className="flex-1 min-h-0 overflow-auto">{children}</div>
    </div>
  );
}
