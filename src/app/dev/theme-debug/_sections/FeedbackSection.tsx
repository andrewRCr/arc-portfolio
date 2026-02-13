import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CardContentInset } from "./CardContentInset";

/**
 * Feedback Section
 *
 * Showcases feedback components: alerts and badges.
 */
export function FeedbackSection() {
  return (
    <Card id="feedback">
      <CardHeader>
        <CardTitle className="font-title text-2xl">Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <CardContentInset className="space-y-6">
          {/* Alerts */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Alerts</h3>
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>This is a default alert for general information.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Destructive Alert</AlertTitle>
                <AlertDescription>Something went wrong. Please try again.</AlertDescription>
              </Alert>
              {/* Custom styled alerts using decorative accent colors (demonstration only) */}
              <Alert className="border-accent-green bg-accent-green/10">
                <CheckCircle2 className="h-4 w-4 text-accent-green" />
                <AlertTitle className="text-accent-green">Accent Green</AlertTitle>
                <AlertDescription>Custom alert using accent-green token.</AlertDescription>
              </Alert>
              <Alert className="border-accent-orange bg-accent-orange/10">
                <AlertTriangle className="h-4 w-4 text-accent-orange" />
                <AlertTitle className="text-accent-orange">Accent Orange</AlertTitle>
                <AlertDescription>Custom alert using accent-orange token.</AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Badges</h3>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Accent-colored outline badges using theme accent colors */}
              <Badge variant="outline" className="border-accent-green text-accent-green">
                Green
              </Badge>
              <Badge variant="outline" className="border-accent-orange text-accent-orange">
                Orange
              </Badge>
              <Badge variant="outline" className="border-accent-blue text-accent-blue">
                Blue
              </Badge>
              <Badge variant="outline" className="border-accent-purple text-accent-purple">
                Purple
              </Badge>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="font-body text-xs text-muted-foreground">
            Accent-colored components are decorative only. Use semantic tokens (destructive) for status meaning.
          </p>
        </CardContentInset>
      </CardContent>
    </Card>
  );
}
