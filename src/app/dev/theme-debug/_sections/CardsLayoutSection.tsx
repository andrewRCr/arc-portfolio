import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Cards & Layout Section
 *
 * Showcases card variants and container patterns.
 */
export function CardsLayoutSection() {
  return (
    <Card id="cards">
      <CardHeader>
        <CardTitle className="text-2xl">Cards &amp; Layout</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Inset with bg-background for contrast against parent Card */}
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border p-6">
              <h3 className="mb-2 font-semibold">Default Card</h3>
              <p className="text-sm text-muted-foreground">Border only, transparent bg.</p>
            </div>

            <div className="rounded-lg bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="mb-2 font-semibold">Card Background</h3>
              <p className="text-sm text-muted-foreground">bg-card + shadow for elevation.</p>
            </div>

            <div className="rounded-lg bg-muted p-6">
              <h3 className="mb-2 font-semibold text-foreground">Muted Card</h3>
              <p className="text-sm text-muted-foreground">De-emphasized content areas.</p>
            </div>

            <div className="rounded-lg bg-primary p-6 text-primary-foreground">
              <h3 className="mb-2 font-semibold">Primary Card</h3>
              <p className="text-sm">Brand color for CTAs.</p>
            </div>

            <div className="rounded-lg bg-accent p-6 text-accent-foreground">
              <h3 className="mb-2 font-semibold">Accent Card</h3>
              <p className="text-sm">Callouts and highlights.</p>
            </div>

            <div className="rounded-lg bg-secondary p-6 text-secondary-foreground">
              <h3 className="mb-2 font-semibold">Secondary Card</h3>
              <p className="text-sm">Secondary hierarchy.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
