"use client";

import { useEffect, useState } from "react";

/**
 * Debug Theme Page
 *
 * Shows actual CSS variable values in the DOM
 */
export default function DebugThemePage() {
  const [variables, setVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    const colorVars = [
      "--background",
      "--foreground",
      "--primary",
      "--primary-foreground",
      "--secondary",
      "--secondary-foreground",
      "--muted",
      "--muted-foreground",
      "--accent",
      "--accent-foreground",
      "--accent-blue",
      "--accent-blue-foreground",
      "--accent-purple",
      "--accent-purple-foreground",
      "--accent-orange",
      "--accent-orange-foreground",
      "--destructive",
      "--destructive-foreground",
      "--border",
      "--input",
      "--ring",
      "--card",
      "--card-foreground",
      "--popover",
      "--popover-foreground",
    ];

    const values: Record<string, string> = {};
    colorVars.forEach((varName) => {
      const value = computedStyle.getPropertyValue(varName).trim();
      values[varName] = value || "(not set)";
    });

    setVariables(values);
  }, []);

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Theme Debug Information</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">CSS Variables in DOM</h2>
        <div className="rounded-lg border border-border bg-muted p-4 font-mono text-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-left">Variable</th>
                <th className="pb-2 text-left">Value</th>
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
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Visual Tests</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div
            className="h-24 rounded-lg"
            style={{ backgroundColor: `rgb(var(--primary))`, color: `rgb(var(--primary-foreground))` }}
          >
            <div className="flex h-full items-center justify-center">Primary (inline style)</div>
          </div>
          <div className="flex h-24 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            Primary (Tailwind class)
          </div>
          <div className="flex h-24 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            Accent (Tailwind class)
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Console Info</h2>
        <p className="text-sm text-muted-foreground">Check browser console for ThemeProvider logs</p>
      </section>
    </div>
  );
}
