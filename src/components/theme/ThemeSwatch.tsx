/**
 * ThemeSwatch Component
 *
 * Neofetch-inspired color swatch grid for theme previews.
 * Displays 8 theme-representative colors in a horizontal row.
 * Purely decorative - hidden from assistive technology.
 */

import { cn } from "@/lib/utils";

export interface ThemeSwatchProps {
  /** Array of 8 hex color strings */
  colors: readonly string[];
  /** Size of each color square in pixels (default: 16) */
  size?: number;
  /** Additional CSS classes for the container */
  className?: string;
}

export function ThemeSwatch({ colors, size = 16, className }: ThemeSwatchProps) {
  return (
    <div data-testid="theme-swatch" aria-hidden="true" className={cn("flex", className)}>
      {colors.slice(0, 8).map((color, index) => (
        <div
          key={index}
          data-testid="swatch-square"
          style={{
            backgroundColor: color,
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      ))}
    </div>
  );
}
