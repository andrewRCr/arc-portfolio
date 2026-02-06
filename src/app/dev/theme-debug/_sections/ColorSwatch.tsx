import { cn } from "@/lib/utils";

/**
 * ColorSwatch Component
 *
 * Displays a color sample with label for theme debugging.
 */
export function ColorSwatch({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("flex h-16 items-center justify-center rounded-lg", className)}>
      <span className="font-body font-medium">{label}</span>
    </div>
  );
}
