import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardContentInset } from "./CardContentInset";

/**
 * Shadow Elevation Section
 *
 * Demonstrates the three-tier shadow system used for depth perception.
 * Shadows are theme-aware tokens defined per light/dark mode:
 * - shadow-sm: Subtle lift (cards at rest)
 * - shadow-md: Clear separation (hover states, dropdowns)
 * - shadow-lg: Prominent elevation (modals, critical overlays)
 *
 * Dark mode uses higher opacity for visibility against dark backgrounds.
 */
export function ShadowElevationSection() {
  return (
    <Card id="shadow-elevation">
      <CardHeader>
        <CardTitle className="font-title text-2xl">Shadow Elevation</CardTitle>
      </CardHeader>
      <CardContent>
        <CardContentInset className="space-y-6">
          <p className="font-body text-sm text-muted-foreground">
            Theme-aware shadow tokens. Dark mode uses higher opacity for visibility. Shadows provide depth — not
            background color changes.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="border border-border bg-background p-6 shadow-sm">
              <h4 className="mb-1 font-terminal text-sm font-semibold">shadow-sm</h4>
              <p className="text-sm text-muted-foreground">Cards at rest, standard containers</p>
            </div>
            <div className="border border-border bg-background p-6 shadow-md">
              <h4 className="mb-1 font-terminal text-sm font-semibold">shadow-md</h4>
              <p className="text-sm text-muted-foreground">Hover states, dropdowns, floating panels</p>
            </div>
            <div className="border border-border bg-background p-6 shadow-lg">
              <h4 className="mb-1 font-terminal text-sm font-semibold">shadow-lg</h4>
              <p className="text-sm text-muted-foreground">Modals, dialogs, critical overlays</p>
            </div>
          </div>

          {/* Border-strong comparison */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Border Tokens</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex h-20 items-center justify-center border-2 border-border bg-background">
                <span className="font-terminal text-sm">border — Subtle dividers</span>
              </div>
              <div className="flex h-20 items-center justify-center border-2 border-border-strong bg-background">
                <span className="font-terminal text-sm">border-strong — Window frames</span>
              </div>
            </div>
          </div>
        </CardContentInset>
      </CardContent>
    </Card>
  );
}
