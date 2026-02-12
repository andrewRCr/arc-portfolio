import { cn } from "@/lib/utils";

interface InDevelopmentBadgeProps {
  /** Use shorter "In Dev" label with smaller text */
  compact?: boolean;
  /** Additional CSS classes (e.g., positioning) */
  className?: string;
}

export function InDevelopmentBadge({ compact = false, className = "" }: InDevelopmentBadgeProps) {
  const baseClasses =
    "border border-border font-terminal font-semibold uppercase tracking-wider bg-surface-background text-muted-foreground";
  const sizeClasses = compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs";

  return (
    <span data-testid="in-development-badge" className={cn(baseClasses, sizeClasses, className)}>
      {compact ? "In Dev" : "In Development"}
    </span>
  );
}
