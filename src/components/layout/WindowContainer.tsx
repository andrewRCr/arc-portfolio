import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Props for the WindowContainer component.
 */
export interface WindowContainerProps {
  /** Content to render inside the window container */
  children: React.ReactNode;
  /** Additional CSS classes for customization */
  className?: string;
}

/**
 * WindowContainer Component
 *
 * A reusable window wrapper with TWM (Tiling Window Manager) styling.
 * Provides consistent window appearance: borders, semi-transparent background,
 * and square corners following the TWM aesthetic.
 *
 * **Styling:**
 * - Border width from layout tokens (`windowBorderWidth`)
 * - Semi-transparent background via CSS (controlled by `data-window-container` attribute)
 * - Theme-aware border color via `border-border`
 * - Square corners (no border-radius)
 * - Background color for base content layer
 * - Opacity can be toggled via `html[data-env-preview]` for dev tools
 *
 * @example
 * ```tsx
 * <WindowContainer className="p-4">
 *   <h1>Window Title</h1>
 *   <p>Window content...</p>
 * </WindowContainer>
 * ```
 */
export function WindowContainer({ children, className }: WindowContainerProps) {
  const { windowBorderWidth } = DEFAULT_LAYOUT_TOKENS;

  return (
    <div
      data-window-container
      className={cn("border-border backdrop-blur-md", className)}
      style={{
        borderWidth: `${windowBorderWidth}px`,
        borderStyle: "solid",
        backgroundColor: "rgb(var(--background) / 0.85)",
      }}
    >
      {children}
    </div>
  );
}
