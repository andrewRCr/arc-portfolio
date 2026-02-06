import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Buttons Section
 *
 * Showcases all button variants and sizes from shadcn/ui.
 */
export function ButtonsSection() {
  return (
    <Card id="buttons">
      <CardHeader>
        <CardTitle className="font-title text-2xl">Buttons</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Button Variants (shadcn)</h3>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Button Sizes</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg">Large</Button>
            <Button size="default">Default</Button>
            <Button size="sm">Small</Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Disabled State</h3>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Default</Button>
            <Button variant="secondary" disabled>
              Secondary
            </Button>
            <Button variant="outline" disabled>
              Outline
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
