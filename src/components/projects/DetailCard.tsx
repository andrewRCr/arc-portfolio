/**
 * DetailCard Component
 *
 * Section card for project detail pages with transparent header and opaque body.
 * Similar to ProjectCard pattern: unified border around both sections, header
 * transparent (larger text readable), body opaque (bg-card for body text).
 */

interface DetailCardProps {
  /** Section title displayed in transparent header area */
  title: string;
  /** Content displayed in opaque card body */
  children: React.ReactNode;
  /** Optional className for spacing/layout (e.g., "mt-8") */
  className?: string;
}

export function DetailCard({ title, children, className }: DetailCardProps) {
  return (
    <div className={`overflow-hidden rounded-lg border border-border-strong ${className ?? ""}`.trim()}>
      {/* Header */}
      <div className="px-4 py-3 bg-card/80">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      {/* Body - higher contrast background for body text readability */}
      <div className="bg-background/80 px-4 py-4">{children}</div>
    </div>
  );
}
