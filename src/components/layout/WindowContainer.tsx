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
 * - Semi-transparent background via `windowOpacity` token (injected as CSS variable)
 * - Theme-aware border color via `border-strong`, primary on hover
 * - Square corners (no border-radius)
 * - Backdrop blur for depth effect
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
  const { windowBorderWidth, windowOpacity } = DEFAULT_LAYOUT_TOKENS;

  return (
    <div
      data-window-container
      className={cn("border-border-strong hover:border-primary backdrop-blur-lg transition-colors", className)}
      style={
        {
          borderWidth: `${windowBorderWidth}px`,
          borderStyle: "solid",
          "--window-bg-opacity": windowOpacity,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
