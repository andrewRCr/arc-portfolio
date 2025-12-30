"use client";

import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface CSSVariablesSectionProps {
  variables: Record<string, string>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * CSS Variables Section
 *
 * Collapsible table showing computed CSS variable values from DOM.
 */
export function CSSVariablesSection({ variables, open, onOpenChange }: CSSVariablesSectionProps) {
  return (
    <Card id="css-variables">
      <Collapsible open={open} onOpenChange={onOpenChange}>
        <CardHeader className="pb-0">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
              <CardTitle className="text-2xl">CSS Variables</CardTitle>
              <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <p className="text-sm text-muted-foreground">Actual values from DOM (computed styles)</p>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 pr-4 text-left">Variable</th>
                    <th className="pb-2 text-left">Value (RGB)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(variables).map(([key, value]) => (
                    <tr key={key} className="border-b border-border/50">
                      <td className="py-2 pr-4 text-accent">{key}</td>
                      <td className="py-2 text-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
