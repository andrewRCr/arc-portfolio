import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardContentInset } from "./CardContentInset";

/**
 * Interactive States Section
 *
 * Showcases hover effects, focus states, and interactive patterns.
 * Includes text links (moved from typography for better grouping).
 */
export function InteractiveStatesSection() {
  return (
    <Card id="interactive">
      <CardHeader>
        <CardTitle className="text-2xl">Interactive States</CardTitle>
      </CardHeader>
      <CardContent>
        <CardContentInset className="space-y-6">
          {/* Button Link Variant (shadcn) */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-muted-foreground">Button Link Variant</h3>
            <p className="text-sm text-muted-foreground">
              shadcn Button with variant=&quot;link&quot; - used in navigation and jump links
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="link">Default Link</Button>
              <Button variant="link" size="sm">
                Small Link
              </Button>
              <Button variant="link" disabled>
                Disabled Link
              </Button>
            </div>
          </div>

          {/* Raw Anchor Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-muted-foreground">Raw Anchor Links</h3>
            <p className="text-sm text-muted-foreground">
              Styled anchors using theme tokens - primary and decorative accents
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#interactive" className="text-primary underline hover:text-primary/80">
                Primary
              </a>
              <a href="#interactive" className="text-accent-blue underline hover:text-accent-blue/80">
                Blue
              </a>
              <a href="#interactive" className="text-accent-green underline hover:text-accent-green/80">
                Green
              </a>
              <a href="#interactive" className="text-accent-purple underline hover:text-accent-purple/80">
                Purple
              </a>
            </div>
          </div>

          {/* Hover Cards */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-muted-foreground">Hover Cards</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="cursor-pointer rounded-lg border border-border p-4 transition-colors hover:border-primary hover:bg-accent/10">
                <h4 className="font-semibold">Border + Background</h4>
                <p className="text-sm text-muted-foreground">Hover to see effect</p>
              </div>
              <div className="cursor-pointer rounded-lg border border-border p-4 transition-all hover:scale-105 hover:border-accent">
                <h4 className="font-semibold">Scale + Border</h4>
                <p className="text-sm text-muted-foreground">Hover to see effect</p>
              </div>
              <div className="cursor-pointer rounded-lg bg-muted p-4 transition-colors hover:bg-accent hover:text-accent-foreground">
                <h4 className="font-semibold">Full Background</h4>
                <p className="text-sm text-muted-foreground">Hover to see effect</p>
              </div>
            </div>
          </div>

          {/* Social Link Style */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-muted-foreground">Social Link Style</h3>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary hover:bg-accent/10"
              >
                <span className="font-medium text-foreground">GitHub</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary hover:bg-accent/10"
              >
                <span className="font-medium text-foreground">LinkedIn</span>
              </a>
            </div>
          </div>
        </CardContentInset>
      </CardContent>
    </Card>
  );
}
