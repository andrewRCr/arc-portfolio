import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Opacity Variants Section
 *
 * Demonstrates the theme-aware opacity token system:
 * - accent-high/mid/low: Per-theme opacity levels for accent color
 * - secondary-high/mid/low: Per-theme opacity levels for secondary color
 *
 * These tokens use CSS color-mix() with per-theme, per-mode opacity values
 * defined in theme definitions. They replace hardcoded opacity modifiers
 * (e.g., bg-accent/80) with semantic, theme-aware alternatives.
 */
export function OpacityVariantsSection() {
  return (
    <Card id="opacity-variants">
      <CardHeader>
        <CardTitle className="font-title text-2xl">Opacity Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="font-body text-sm text-muted-foreground">
          Theme-aware opacity tokens with per-theme, per-mode values. Use these instead of hardcoded opacity modifiers
          (e.g., <code>bg-accent/80</code>).
        </p>

        {/* Accent variants */}
        <div className="space-y-3">
          <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Accent Variants</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex h-20 flex-col items-center justify-center bg-accent-high">
              <span className="font-terminal text-sm font-semibold text-accent-high-foreground">accent-high</span>
              <span className="font-terminal text-xs text-accent-high-foreground/80">Bold emphasis</span>
            </div>
            <div className="flex h-20 flex-col items-center justify-center bg-accent-mid">
              <span className="font-terminal text-sm font-semibold text-accent-mid-foreground">accent-mid</span>
              <span className="font-terminal text-xs text-accent-mid-foreground/80">Interactive elements</span>
            </div>
            <div className="flex h-20 flex-col items-center justify-center bg-accent-low">
              <span className="font-terminal text-sm font-semibold text-accent-low-foreground">accent-low</span>
              <span className="font-terminal text-xs text-accent-low-foreground/80">Subtle emphasis</span>
            </div>
          </div>
        </div>

        {/* Secondary variants */}
        <div className="space-y-3">
          <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Secondary Variants</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex h-20 flex-col items-center justify-center bg-secondary-high">
              <span className="font-terminal text-sm font-semibold text-secondary-foreground">secondary-high</span>
              <span className="font-terminal text-xs text-secondary-foreground/80">Nav active, detail titles</span>
            </div>
            <div className="flex h-20 flex-col items-center justify-center bg-secondary-mid">
              <span className="font-terminal text-sm font-semibold text-secondary-foreground">secondary-mid</span>
              <span className="font-terminal text-xs text-secondary-foreground/80">Nav active state</span>
            </div>
            <div className="flex h-20 flex-col items-center justify-center bg-secondary-low">
              <span className="font-terminal text-sm font-semibold text-foreground">secondary-low</span>
              <span className="font-terminal text-xs text-muted-foreground">Nav hover, subtle bg</span>
            </div>
          </div>
        </div>

        {/* Usage context */}
        <div className="space-y-3">
          <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Production Usage</h3>
          <div className="rounded-lg border border-border bg-background p-4 text-sm space-y-1">
            <p>
              <code className="font-terminal text-accent">accent-high</code> — Button outline hover, active tab
              backgrounds
            </p>
            <p>
              <code className="font-terminal text-accent">accent-mid</code> — Focal button default, hover transitions
            </p>
            <p>
              <code className="font-terminal text-accent">accent-low</code> — ProjectCard titles, category badges
              (subtle emphasis)
            </p>
            <p>
              <code className="font-terminal text-accent">secondary-high</code> — Card hover borders, nav active, detail
              page titles
            </p>
            <p>
              <code className="font-terminal text-accent">secondary-mid</code> — Nav active background, form focus rings
            </p>
            <p>
              <code className="font-terminal text-accent">secondary-low</code> — Nav hover background
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
