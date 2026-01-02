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
  /** Whether this window is currently active (for touch devices) */
  isActive?: boolean;
  /** Callback when window is activated (clicked/tapped) */
  onActivate?: () => void;
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
 * - Theme-aware border color via `border-strong`, primary on hover (desktop) or active (touch)
 * - Square corners (no border-radius)
 * - Backdrop blur for depth effect
 * - Opacity can be toggled via `html[data-env-preview]` for dev tools
 * - Touch devices: `isActive` prop controls border highlight instead of hover
 *
 * @example
 * ```tsx
 * <WindowContainer className="p-4">
 *   <h1>Window Title</h1>
 *   <p>Window content...</p>
 * </WindowContainer>
 * ```
 */
export function WindowContainer({ children, className, isActive, onActivate }: WindowContainerProps) {
  const { windowBorderWidth, windowOpacity } = DEFAULT_LAYOUT_TOKENS;

  return (
    <div
      data-window-container
      data-active={isActive || undefined}
      onClick={onActivate}
      className={cn("border-border-strong backdrop-blur-lg transition-colors", className)}
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
