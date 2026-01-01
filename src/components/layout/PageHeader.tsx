/**
 * PageHeader Component
 *
 * Fixed header for page content. Used with PageLayout to create consistent
 * page structure where header stays fixed and content scrolls below.
 *
 * Features:
 * - Title and optional subtitle
 * - Optional children for additional controls (tabs, filters, etc.)
 * - Bottom border separator
 *
 * Width constraint is handled by PageLayout - this component fills available width.
 */

export interface PageHeaderProps {
  /** Page title (optional if using children for full custom content) */
  title?: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Content below title (tabs, filters, etc.) OR full custom content if no title */
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="pb-3">
      {/* Title/subtitle if provided */}
      {title && (
        <div className="space-y-1">
          <h1 className="font-mono text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      {/* Children: controls below title, or full custom content */}
      {children && <div className={title ? "mt-3" : ""}>{children}</div>}

      {/* Bottom separator */}
      <div className="mt-3 border-b border-border/50" />
    </div>
  );
}
