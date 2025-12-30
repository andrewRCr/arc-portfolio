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
 * Showcases form input components: text inputs, textareas, checkboxes, switches.
 */
export function FormControlsSection() {
  const [checked, setChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);

  return (
    <Card id="form-controls">
      <CardHeader>
        <CardTitle className="text-2xl">Form Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <CardContentInset className="space-y-6">
          {/* Text Inputs */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-muted-foreground">Text Inputs</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="default-input">Default Input</Label>
                <Input id="default-input" placeholder="Enter text..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled-input">Disabled Input</Label>
                <Input id="disabled-input" placeholder="Disabled" disabled />
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-muted-foreground">Textarea</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="default-textarea">Default Textarea</Label>
                <Textarea id="default-textarea" placeholder="Enter longer text..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled-textarea">Disabled Textarea</Label>
                <Textarea id="disabled-textarea" placeholder="Disabled" disabled />
              </div>
            </div>
          </div>

          {/* Checkboxes & Switches */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-muted-foreground">Checkboxes &amp; Switches</h3>
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center space-x-2">
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
