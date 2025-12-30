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
        <CardTitle className="text-2xl">Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <CardContentInset className="space-y-6">
          {/* Alerts */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-muted-foreground">Alerts</h3>
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
              {/* Custom styled alerts using theme colors */}
              <Alert className="border-accent-green bg-accent-green/10">
                <CheckCircle2 className="h-4 w-4 text-accent-green" />
                <AlertTitle className="text-accent-green">Success</AlertTitle>
                <AlertDescription>Your changes have been saved successfully.</AlertDescription>
              </Alert>
              <Alert className="border-accent-orange bg-accent-orange/10">
                <AlertTriangle className="h-4 w-4 text-accent-orange" />
                <AlertTitle className="text-accent-orange">Warning</AlertTitle>
                <AlertDescription>This action cannot be undone.</AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-muted-foreground">Badges</h3>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Accent-colored outline badges using theme accent colors */}
              <Badge variant="outline" className="border-accent-green text-accent-green">
                Success
              </Badge>
              <Badge variant="outline" className="border-accent-orange text-accent-orange">
                Warning
              </Badge>
              <Badge variant="outline" className="border-accent-blue text-accent-blue">
                Info
              </Badge>
              <Badge variant="outline" className="border-accent-purple text-accent-purple">
                New
              </Badge>
            </div>
          </div>
        </CardContentInset>
      </CardContent>
    </Card>
  );
}
