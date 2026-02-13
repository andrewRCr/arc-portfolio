"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CardContentInset } from "./CardContentInset";

/**
 * Form Controls Section
 *
 * Showcases form input components with production-accurate styling:
 * - Input/Textarea use secondary focus tokens (border-secondary + ring-secondary-mid)
 * - Error states via aria-invalid + destructive ring
 * - Checkboxes and switches for binary controls
 */
export function FormControlsSection() {
  const [checked, setChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);

  return (
    <Card id="form-controls">
      <CardHeader>
        <CardTitle className="font-title text-2xl">Form Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <CardContentInset className="space-y-6">
          {/* Text Inputs — production focus pattern */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Text Inputs</h3>
            <p className="font-body text-sm text-muted-foreground">
              Focus: <code>border-secondary</code> + <code>ring-secondary-mid</code> (production pattern)
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="default-input">Default Input</Label>
                <Input id="default-input" placeholder="Click to see focus state..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled-input">Disabled Input</Label>
                <Input id="disabled-input" placeholder="Disabled" disabled />
              </div>
            </div>
          </div>

          {/* Error States */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Error States</h3>
            <p className="font-body text-sm text-muted-foreground">
              <code>aria-invalid</code> triggers destructive ring + border
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="error-input">Invalid Input</Label>
                <Input id="error-input" aria-invalid="true" defaultValue="bad@" />
                <p className="text-sm text-destructive">Please enter a valid email</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="error-textarea">Invalid Textarea</Label>
                <Textarea id="error-textarea" aria-invalid="true" defaultValue="..." rows={2} />
                <p className="text-sm text-destructive">Message is required</p>
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Textarea</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="default-textarea">Default Textarea</Label>
                <Textarea id="default-textarea" placeholder="Enter longer text..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled-textarea">Disabled Textarea</Label>
                <Textarea id="disabled-textarea" placeholder="Disabled" disabled rows={3} />
              </div>
            </div>
          </div>

          {/* Card variant input */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">
              Card Variant (Tinted Background)
            </h3>
            <p className="font-body text-sm text-muted-foreground">
              ContactForm &quot;card&quot; variant uses <code>bg-surface-card</code> on inputs
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="card-input">Card Input</Label>
                <Input id="card-input" placeholder="Tinted background..." className="bg-surface-card" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-textarea">Card Textarea</Label>
                <Textarea id="card-textarea" placeholder="Tinted background..." className="bg-surface-card" rows={2} />
              </div>
            </div>
          </div>

          {/* Checkboxes & Switches */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Checkboxes &amp; Switches</h3>
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center space-x-2">
                {/* c === true converts "indeterminate" state to false */}
                <Checkbox id="checkbox-demo" checked={checked} onCheckedChange={(c) => setChecked(c === true)} />
                <Label htmlFor="checkbox-demo">Checkbox {checked ? "(checked)" : "(unchecked)"}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="checkbox-disabled" disabled />
                <Label htmlFor="checkbox-disabled" className="text-muted-foreground">
                  Disabled
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="switch-demo" checked={switchOn} onCheckedChange={setSwitchOn} />
                <Label htmlFor="switch-demo">Switch {switchOn ? "(on)" : "(off)"}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="switch-disabled" disabled />
                <Label htmlFor="switch-disabled" className="text-muted-foreground">
                  Disabled
                </Label>
              </div>
            </div>
          </div>
        </CardContentInset>
      </CardContent>
    </Card>
  );
}
