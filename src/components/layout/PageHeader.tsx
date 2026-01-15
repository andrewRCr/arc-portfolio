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
  /** Hide the bottom divider (useful when children provide their own divider, e.g., tabs) */
  hideDivider?: boolean;
}

export function PageHeader({ title, subtitle, children, hideDivider = false }: PageHeaderProps) {
  return (
    <div>
      {/* Title/subtitle if provided */}
      {title && (
        <div className="space-y-1">
          <h1 className="font-mono text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      {/* Children: controls below title, or full custom content */}
      {children && <div className={title ? "mt-2" : ""}>{children}</div>}

      {/* Bottom separator - hidden when children provide their own (e.g., tabs with border) */}
      {!hideDivider && <div className="mt-3 mx-4 border-b border-border/50" />}
    </div>
  );
}
