/**
 * PhotoCredits Component
 *
 * Subtle attribution line for Unsplash (or other) photo credits.
 * Renders photographer names in italics, separated by commas.
 * Used via ProjectDetail's footer prop for pages with stock imagery.
 */

import { cn } from "@/lib/utils";

interface PhotoCreditsProps {
  /** Array of photographer names to credit */
  credits: string[];
  /** Optional className for additional styling */
  className?: string;
}

export function PhotoCredits({ credits, className }: PhotoCreditsProps) {
  if (!credits || credits.length === 0) return null;

  return (
    <p className={cn("mt-3 sm:mt-6 px-2 text-sm italic text-muted-foreground", className)}>
      <span className="font-semibold">Photo Credits:</span> {credits.join(", ")}
    </p>
  );
}
