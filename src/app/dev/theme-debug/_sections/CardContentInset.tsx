import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * CardContentInset Component
 *
 * Wrapper that provides a bg-background inset inside Cards.
 * Ensures components render on the expected background layer,
 * preventing blend-in issues with borders/inputs on card backgrounds.
 */
export function CardContentInset({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-lg border border-border bg-background p-4", className)}>{children}</div>;
}
