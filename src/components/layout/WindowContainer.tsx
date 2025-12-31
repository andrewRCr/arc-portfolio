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
 * - Semi-transparent background via `windowOpacity`
 * - Theme-aware border color via `border-border`
 * - Square corners (no border-radius)
 * - Card background for content area
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
  const { windowBorderWidth, windowOpacity } = DEFAULT_LAYOUT_TOKENS;

  return (
    <div
      className={cn("border-border bg-card", className)}
      style={{
        borderWidth: `${windowBorderWidth}px`,
        borderStyle: "solid",
        opacity: windowOpacity,
      }}
    >
      {children}
    </div>
  );
}
