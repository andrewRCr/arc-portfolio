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
  /** If true, drawer fills to exact window container height (stable, scrollable content) */
  fillHeight?: boolean;
}

/**
 * Window-aligned bottom drawer for mobile interfaces.
 *
 * Positioning is calculated from layout tokens to align with the main content area:
 * - Top: aligns with window container top (topBar + gap)
 * - Bottom: extends to safe area bottom (accounts for iOS home indicator)
 * - left/right: inset by windowGap to show wallpaper on sides
 */
export function MobileDrawer({
  open,
  onOpenChange,
  trigger,
  title,
  children,
  "aria-describedby": ariaDescribedBy,
  fillHeight = false,
}: MobileDrawerProps) {
  // Calculate height: from window container top (with border overlap) to safe area bottom
  // - topBarHeight + windowGap*2 - windowBorderWidth positions top to align with window container
  // - env(safe-area-inset-bottom) reserves space for iOS home indicator (0 on other devices)
  const containerHeight = `calc(100dvh - ${DEFAULT_LAYOUT_TOKENS.topBarHeight}px - ${DEFAULT_LAYOUT_TOKENS.windowGap * 2}px + ${DEFAULT_LAYOUT_TOKENS.windowBorderWidth}px - env(safe-area-inset-bottom, 0px))`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="bottom"
        hideCloseButton
        style={{
          // fillHeight: exact height, otherwise maxHeight allows content-based sizing
          ...(fillHeight ? { height: containerHeight } : { maxHeight: containerHeight }),
          // Inset from edges to show wallpaper preview on sides (matches windowGap)
          left: DEFAULT_LAYOUT_TOKENS.windowGap,
          right: DEFAULT_LAYOUT_TOKENS.windowGap,
        }}
        aria-describedby={ariaDescribedBy}
      >
        <div className={`flex flex-col gap-2 px-4 pb-6 pt-1 ${fillHeight ? "h-full" : ""}`}>
          {/* Header with title and close button */}
          <div className="flex items-center justify-between shrink-0">
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

          {/* Drawer content - fills remaining space when fillHeight is true */}
          {fillHeight ? <div className="flex-1 min-h-0 flex flex-col">{children}</div> : children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
