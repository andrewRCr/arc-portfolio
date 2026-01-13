/**
 * ThemeControlPlaceholder Component
 *
 * Pre-hydration placeholder for theme controls.
 * Renders a disabled button with muted swatch squares to prevent:
 * - Hydration mismatch (server doesn't know user's theme from localStorage)
 * - Layout shift (placeholder matches real button dimensions)
 *
 * Used by both ThemeControl (desktop) and ThemeControlDrawer (mobile).
 */

import { ChevronDown } from "lucide-react";

interface ThemeControlPlaceholderProps {
  /** Use mobile touch-target sizing (44px min) vs desktop compact sizing (28px) */
  isMobile?: boolean;
}

export function ThemeControlPlaceholder({ isMobile = false }: ThemeControlPlaceholderProps) {
  const className = isMobile
    ? "flex items-center justify-center gap-1 min-h-11 min-w-11 px-2 rounded-md border border-border transition-all"
    : "flex items-center gap-1 px-1.5 h-7 rounded-md border border-border transition-all";

  return (
    <button type="button" aria-label="Open theme settings" disabled className={className}>
      <div data-testid="theme-swatch" aria-hidden="true" className="flex">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} data-testid="swatch-square" className="w-4 h-4 bg-muted" />
        ))}
      </div>
      <ChevronDown data-testid="theme-control-chevron" className="w-3 h-3 text-muted-foreground" />
    </button>
  );
}
