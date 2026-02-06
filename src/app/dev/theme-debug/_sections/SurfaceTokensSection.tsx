import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Surface Tokens Section
 *
 * Demonstrates the computed surface token hierarchy used in production:
 * - surface-card: Headers, labels (darker in dark mode, lighter via swap in light)
 * - surface-background: Content bodies (lighter in dark mode, darker via swap in light)
 * - surface-muted: Metadata badges, de-emphasized areas
 * - surface-popover: Floating overlay backgrounds
 *
 * Light mode swaps card/background base tokens and applies darkening + reduced opacity
 * for proper visual grounding. See strategy-style-guide.md "Light Mode Surface Layering".
 */
export function SurfaceTokensSection() {
  return (
    <Card id="surface-tokens">
      <CardHeader>
        <CardTitle className="font-title text-2xl">Surface Tokens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="font-body text-sm text-muted-foreground">
          Computed surfaces using <code>color-mix()</code> with per-theme opacity and darkening. Light mode swaps
          card/background bases and applies darkening for visual grounding.
        </p>

        {/* Production hierarchy demo: card with header/body/metadata */}
        <div className="space-y-3">
          <h3 className="font-terminal text-lg font-semibold text-muted-foreground">
            Production Hierarchy (EducationCard Pattern)
          </h3>
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="bg-surface-card px-4 py-3">
              <h4 className="font-terminal text-sm font-semibold text-foreground">bg-surface-card — Header Zone</h4>
              <p className="text-xs text-muted-foreground">Labels, game tags, card headers</p>
            </div>
            <div className="bg-surface-background px-4 py-4 space-y-3">
              <h4 className="font-terminal text-sm font-semibold text-foreground">
                bg-surface-background — Content Body
              </h4>
              <p className="text-sm text-muted-foreground">Primary content area for cards and sections.</p>
              <div className="flex flex-wrap gap-2">
                <span className="border border-border bg-surface-muted px-2.5 py-0.5 font-terminal text-xs text-muted-foreground">
                  bg-surface-muted
                </span>
                <span className="border border-border bg-surface-muted px-2.5 py-0.5 font-terminal text-xs text-muted-foreground">
                  Metadata badges
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Individual surface swatches */}
        <div className="space-y-3">
          <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Individual Surfaces</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex h-24 items-center justify-center border border-border bg-surface-card">
              <span className="font-terminal text-sm font-medium text-foreground">surface-card</span>
            </div>
            <div className="flex h-24 items-center justify-center border border-border bg-surface-background">
              <span className="font-terminal text-sm font-medium text-foreground">surface-background</span>
            </div>
            <div className="flex h-24 items-center justify-center border border-border bg-surface-muted">
              <span className="font-terminal text-sm font-medium text-muted-foreground">surface-muted</span>
            </div>
            <div className="flex h-24 items-center justify-center border border-border bg-surface-popover">
              <span className="font-terminal text-sm font-medium text-foreground">surface-popover</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
