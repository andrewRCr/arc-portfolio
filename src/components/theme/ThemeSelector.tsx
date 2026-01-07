/**
 * ThemeSelector Component
 *
 * Theme selection panel displaying all available themes with swatch previews.
 * Uses listbox/option ARIA pattern for accessibility.
 */

import { useRef, useCallback, KeyboardEvent } from "react";
import { themes, type ThemeName } from "@/data/themes";
import { ThemeSwatch } from "./ThemeSwatch";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export interface ThemeSelectorProps {
  /** Currently selected theme */
  selectedTheme: ThemeName;
  /** Callback when a theme is selected */
  onSelect: (theme: ThemeName) => void;
  /** Additional CSS classes */
  className?: string;
}

// Get ordered theme entries for consistent rendering
const themeEntries = Object.entries(themes) as [ThemeName, (typeof themes)[ThemeName]][];

export function ThemeSelector({ selectedTheme, onSelect, className }: ThemeSelectorProps) {
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === "dark" ? "dark" : "light";

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>, index: number) => {
      const themeCount = themeEntries.length;

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          const nextIndex = (index + 1) % themeCount;
          optionRefs.current[nextIndex]?.focus();
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          const prevIndex = (index - 1 + themeCount) % themeCount;
          optionRefs.current[prevIndex]?.focus();
          break;
        }
        case "Enter":
        case " ": {
          event.preventDefault();
          const [themeName] = themeEntries[index];
          onSelect(themeName);
          break;
        }
      }
    },
    [onSelect]
  );

  const handleListboxKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    // When listbox itself receives ArrowDown, focus first option
    if (event.key === "ArrowDown") {
      event.preventDefault();
      optionRefs.current[0]?.focus();
    }
  }, []);

  return (
    <div
      role="listbox"
      aria-label="Select theme"
      tabIndex={0}
      onKeyDown={handleListboxKeyDown}
      className={cn("flex flex-col gap-1", className)}
    >
      {themeEntries.map(([themeName, theme], index) => {
        const isSelected = themeName === selectedTheme;
        const swatchColors = [...theme.swatchColors[mode]];

        return (
          <div
            key={themeName}
            ref={(el) => {
              optionRefs.current[index] = el;
            }}
            role="option"
            aria-selected={isSelected}
            tabIndex={-1}
            onClick={() => onSelect(themeName)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer",
              "transition-colors duration-150",
              "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring",
              isSelected && "bg-muted/80 ring-1 ring-border"
            )}
          >
            <ThemeSwatch colors={swatchColors} size={20} />
            <span className="text-sm font-medium">{theme.label}</span>
          </div>
        );
      })}
    </div>
  );
}
