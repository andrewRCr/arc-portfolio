/**
 * MobileDrawer Component
 *
 * A bottom sheet drawer aligned with the window container layout.
 * Extracts common patterns from ThemeControlDrawer for reuse:
 * - Window-aligned positioning (respects topBar, gaps, borders)
 * - Standard header with title and 44px touch-target close button
 * - Consistent styling with the TWM layout system
 */

"use client";

import { type ReactNode } from "react";
import { X } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { DEFAULT_LAYOUT_TOKENS } from "@/lib/theme";

interface MobileDrawerProps {
  /** Controlled open state */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Trigger element that opens the drawer */
  trigger: ReactNode;
  /** Title displayed in the drawer header */
  title: string;
  /** Drawer content */
  children: ReactNode;
  /** Optional aria-describedby override (set to undefined to suppress warning) */
  "aria-describedby"?: string | undefined;
}

/**
 * Window-aligned bottom drawer for mobile interfaces.
 *
 * Positioning is calculated from layout tokens to align with the main content area:
 * - maxHeight: viewport minus topBar and gaps (with border overlap)
 * - left/right: inset by windowGap to show wallpaper on sides
 */
export function MobileDrawer({
  open,
  onOpenChange,
  trigger,
  title,
  children,
  "aria-describedby": ariaDescribedBy,
}: MobileDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="bottom"
        hideCloseButton
        style={{
          // Align with top of main content area: viewport - topBar - gaps + border overlap
          maxHeight: `calc(100dvh - ${DEFAULT_LAYOUT_TOKENS.topBarHeight}px - ${DEFAULT_LAYOUT_TOKENS.windowGap * 2}px + ${DEFAULT_LAYOUT_TOKENS.windowBorderWidth}px)`,
          // Inset from edges to show wallpaper preview on sides (matches windowGap)
          left: DEFAULT_LAYOUT_TOKENS.windowGap,
          right: DEFAULT_LAYOUT_TOKENS.windowGap,
        }}
        aria-describedby={ariaDescribedBy}
      >
        <div className="flex flex-col gap-2 px-4 pb-6 pt-1">
          {/* Header with title and close button */}
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide ml-3">
              {title}
            </SheetTitle>
            <SheetClose asChild>
              <button
                type="button"
                className="min-h-11 min-w-11 flex items-center justify-center rounded-md [-webkit-tap-highlight-color:transparent] outline-none opacity-70 hover:opacity-100 transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </SheetClose>
          </div>

          {/* Drawer content */}
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
