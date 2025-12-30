"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { useTheme } from "next-themes";
import { ChevronDown } from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { themes, type ThemeName } from "@/data/themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

// Gate to development mode only
if (process.env.NODE_ENV !== "development") {
  notFound();
}

/**
 * Theme Debug Page
 *
 * Development-only page for visual testing of the theme system.
 * Consolidates CSS variable inspection and visual swatches.
 *
 * Route: /dev/theme-debug (only accessible in development)
 */
export default function ThemeDebugPage() {
  const { theme: colorMode, setTheme: setColorMode } = useTheme();
  const { activeTheme, setActiveTheme } = useThemeContext();
  const [mounted, setMounted] = useState(false);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [cssOpen, setCssOpen] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional hydration pattern
    setMounted(true);
  }, []);

  // Read CSS variables from DOM
  useEffect(() => {
    if (!mounted) return;

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
      "--accent-red",
      "--accent-orange",
      "--accent-green",
      "--accent-blue",
      "--accent-purple",
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

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Debug page reads DOM on mount
    setVariables(values);
  }, [mounted, activeTheme, colorMode]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const themeNames = Object.keys(themes) as ThemeName[];

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading theme debug...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 mt-6 border-b border-border px-6 py-3 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl space-y-3">
          {/* Top row: Title and controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-xl font-bold">Theme Debug</h1>

            {/* Current state */}
            <span className="text-sm text-muted-foreground">
              {themes[activeTheme].label} · {colorMode}
            </span>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Theme selector */}
              <select
                value={activeTheme}
                onChange={(e) => setActiveTheme(e.target.value as ThemeName)}
                className="rounded border border-border bg-background px-2 py-1 text-sm transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {themeNames.map((themeName) => (
                  <option key={themeName} value={themeName}>
                    {themes[themeName].label}
                  </option>
                ))}
              </select>

              {/* Mode toggle - now using Button component */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")}
                aria-label="Toggle color mode"
              >
                {colorMode === "dark" ? "Light" : "Dark"}
              </Button>
            </div>
          </div>

          {/* Jump links - now using Button component */}
          <div className="flex flex-wrap justify-center gap-2 border-t border-border/50 pt-2">
            {[
              { id: "css-variables", label: "Variables" },
              { id: "color-palette", label: "Colors" },
              { id: "typography", label: "Typography" },
              { id: "links-buttons", label: "Links" },
              { id: "cards", label: "Cards" },
              { id: "interactive", label: "Interactive" },
            ].map(({ id, label }) => (
              <Button key={id} variant="link" size="sm" onClick={() => scrollToSection(id)}>
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl space-y-8 p-8">
        {/* CSS Variables Section - Collapsible */}
        <Card id="css-variables">
          <Collapsible open={cssOpen} onOpenChange={setCssOpen}>
            <CardHeader className="pb-0">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
                  <CardTitle className="text-2xl">CSS Variables</CardTitle>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${cssOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <p className="text-sm text-muted-foreground">
                Actual values from DOM (computed styles)
              </p>
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

        {/* Color Palette Section */}
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

        {/* Typography Section */}
        <Card id="typography">
          <CardHeader>
            <CardTitle className="text-2xl">Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h1 className="text-4xl font-bold">Heading 1 - The quick brown fox</h1>
            <h2 className="text-3xl font-bold">Heading 2 - The quick brown fox</h2>
            <h3 className="text-2xl font-semibold">Heading 3 - The quick brown fox</h3>
            <h4 className="text-xl font-semibold">Heading 4 - The quick brown fox</h4>
            <h5 className="text-lg font-medium">Heading 5 - The quick brown fox</h5>
            <h6 className="text-base font-medium">Heading 6 - The quick brown fox</h6>

            <Separator />

            <p className="text-foreground">
              Regular paragraph text in foreground color. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vivamus lacinia odio vitae vestibulum vestibulum.
            </p>

            <p className="text-muted-foreground">
              Muted paragraph text for less emphasis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum vestibulum.
            </p>

            <p className="text-sm text-muted-foreground">
              Small muted text for captions and metadata. Often used for timestamps, labels, and secondary info.
            </p>
          </CardContent>
        </Card>

        {/* Links & Buttons Section */}
        <Card id="links-buttons">
          <CardHeader>
            <CardTitle className="text-2xl">Links &amp; Hover States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-muted-foreground">Text Links</h3>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="text-primary underline hover:text-primary/80">
                  Primary link
                </a>
                <a href="#" className="text-secondary underline hover:text-secondary/80">
                  Secondary link
                </a>
                <a href="#" className="text-accent underline hover:text-accent/80">
                  Accent link
                </a>
                <a href="#" className="text-accent-blue underline hover:text-accent-blue/80">
                  Blue accent link
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-muted-foreground">Button Variants (shadcn)</h3>
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
              <h3 className="text-lg font-semibold text-muted-foreground">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg">Large</Button>
                <Button size="default">Default</Button>
                <Button size="sm">Small</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards & Containers */}
        <Card id="cards">
          <CardHeader>
            <CardTitle className="text-2xl">Cards &amp; Containers</CardTitle>
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

        {/* Interactive Elements */}
        <Card id="interactive">
          <CardHeader>
            <CardTitle className="text-2xl">Interactive Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>

        {/* Developer Info */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-2xl">Developer Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Purpose:</strong> Visual testing of all theme colors and interactive
              states.
            </p>
            <p>
              <strong className="text-foreground">Test Matrix:</strong> 3 themes (Gruvbox, Rose Pine, Remedy) × 2 modes
              (light, dark) = 6 combinations
            </p>
            <p>
              <strong className="text-foreground">Hover States:</strong> Test all hover effects work correctly across
              themes.
            </p>
            <p>
              <strong className="text-foreground">Accessibility:</strong> Verify contrast ratios and readability in all
              combinations.
            </p>
            <p>
              <strong className="text-foreground">Route:</strong> <code>/dev/theme-debug</code> (development only)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * ColorSwatch Component
 *
 * Displays a color sample with label
 */
function ColorSwatch({ label, className }: { label: string; className: string }) {
  return (
    <div className={`flex h-24 items-center justify-center rounded-lg ${className}`}>
      <span className="font-medium">{label}</span>
    </div>
  );
}
