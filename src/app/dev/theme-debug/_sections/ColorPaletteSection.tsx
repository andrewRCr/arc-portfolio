import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorSwatch } from "./ColorSwatch";

/**
 * Color Palette Section
 *
 * Displays all theme colors organized by category:
 * - Base colors (background, foreground, card, etc.)
 * - Semantic colors (primary, secondary, accent, etc.)
 * - Decorative accents (color highlights for borders/text)
 */
export function ColorPaletteSection() {
  return (
    <Card id="color-palette">
      <CardHeader>
        <CardTitle className="text-2xl">Color Palette</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Base Colors */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-muted-foreground">Base Colors</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ColorSwatch label="Background" className="bg-background text-foreground" />
            <ColorSwatch label="Foreground" className="bg-foreground text-background" />
            <ColorSwatch label="Card" className="bg-card text-card-foreground" />
            <ColorSwatch label="Popover" className="bg-popover text-popover-foreground" />
            <ColorSwatch label="Border" className="border-4 border-border bg-background" />
            <ColorSwatch label="Input" className="border-4 border-input bg-background" />
          </div>
        </div>

        {/* Semantic Colors */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-muted-foreground">Semantic Colors</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ColorSwatch label="Primary" className="bg-primary text-primary-foreground" />
            <ColorSwatch label="Secondary" className="bg-secondary text-secondary-foreground" />
            <ColorSwatch label="Muted" className="bg-muted text-muted-foreground" />
            <ColorSwatch label="Accent" className="bg-accent text-accent-foreground" />
            <ColorSwatch label="Destructive" className="bg-destructive text-destructive-foreground" />
            <ColorSwatch label="Ring" className="border-4 border-ring bg-background" />
          </div>
        </div>

        {/* Decorative Accent Colors */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-muted-foreground">Decorative Accents</h3>
          <p className="text-sm text-muted-foreground">
            For borders, text color, indicators - not for backgrounds with text
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ColorSwatch label="accent-red" className="border-4 border-accent-red bg-background text-accent-red" />
            <ColorSwatch
              label="accent-orange"
              className="border-4 border-accent-orange bg-background text-accent-orange"
            />
            <ColorSwatch
              label="accent-green"
              className="border-4 border-accent-green bg-background text-accent-green"
            />
            <ColorSwatch label="accent-blue" className="border-4 border-accent-blue bg-background text-accent-blue" />
            <ColorSwatch
              label="accent-purple"
              className="border-4 border-accent-purple bg-background text-accent-purple"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
