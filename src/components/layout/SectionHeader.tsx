/**
 * SectionHeader Component
 *
 * Header for sub-sections within a page. Styled to match PageHeader
 * but uses h2 instead of h1, and no subtitle support.
 *
 * Use for secondary sections that need visual separation (e.g., Education
 * section on the About page).
 */

export interface SectionHeaderProps {
  /** Section title */
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="pb-3">
      <h2 className="font-title text-2xl font-bold text-foreground">{title}</h2>
      <div className="mt-3 border-b border-border/50" />
    </div>
  );
}
