"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { useTheme } from "next-themes";
import { useThemeContext } from "@/contexts/ThemeContext";
import { themes, type ThemeName } from "@/data/themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Separator } from "@/components/ui/separator";

/**
 * Typography Debug Page
 *
 * Development-only page for testing typography across themes.
 * Separated from theme-debug for focused typography inspection.
 *
 * Route: /dev/typography (only accessible in development)
 */
export default function TypographyPage() {
  // Gate to development mode only
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { theme: colorMode } = useTheme();
  const { activeTheme, setActiveTheme } = useThemeContext();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional hydration pattern
    setMounted(true);
  }, []);

  const themeNames = Object.keys(themes) as ThemeName[];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading typography...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 mt-3 border-b border-border px-6 py-3 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl space-y-3">
          {/* Top row: Title and controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-xl font-bold">Typography</h1>

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

              {/* Mode toggle */}
              <ThemeToggle />
            </div>
          </div>

          {/* Jump links */}
          <div className="flex flex-wrap justify-center gap-2 border-t border-border/50 pt-2">
            {[
              { id: "headings", label: "Headings" },
              { id: "body-text", label: "Body" },
              { id: "font-sizes", label: "Sizes" },
              { id: "font-weights", label: "Weights" },
              { id: "line-heights", label: "Line Heights" },
              { id: "text-colors", label: "Colors" },
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
        {/* Headings */}
        <Card id="headings">
          <CardHeader>
            <CardTitle className="text-2xl">Headings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h1 className="text-4xl font-bold">Heading 1 - The quick brown fox</h1>
            <h2 className="text-3xl font-bold">Heading 2 - The quick brown fox</h2>
            <h3 className="text-2xl font-semibold">Heading 3 - The quick brown fox</h3>
            <h4 className="text-xl font-semibold">Heading 4 - The quick brown fox</h4>
            <h5 className="text-lg font-medium">Heading 5 - The quick brown fox</h5>
            <h6 className="text-base font-medium">Heading 6 - The quick brown fox</h6>
          </CardContent>
        </Card>

        {/* Body Text */}
        <Card id="body-text">
          <CardHeader>
            <CardTitle className="text-2xl">Body Text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">
              Regular paragraph text in foreground color. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus justo, ut fringilla velit fermentum
              a.
            </p>

            <p className="text-muted-foreground">
              Muted paragraph text for less emphasis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum vestibulum. Cras porttitor metus justo.
            </p>

            <p className="text-sm text-muted-foreground">
              Small muted text for captions and metadata. Often used for timestamps, labels, and secondary information
              that doesn&apos;t need primary visual weight.
            </p>
          </CardContent>
        </Card>

        {/* Font Sizes */}
        <Card id="font-sizes">
          <CardHeader>
            <CardTitle className="text-2xl">Font Sizes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs">text-xs (12px) - Extra small text</p>
            <p className="text-sm">text-sm (14px) - Small text</p>
            <p className="text-base">text-base (16px) - Base text size</p>
            <p className="text-lg">text-lg (18px) - Large text</p>
            <p className="text-xl">text-xl (20px) - Extra large</p>
            <p className="text-2xl">text-2xl (24px) - 2x large</p>
            <p className="text-3xl">text-3xl (30px) - 3x large</p>
            <p className="text-4xl">text-4xl (36px) - 4x large</p>
          </CardContent>
        </Card>

        {/* Font Weights */}
        <Card id="font-weights">
          <CardHeader>
            <CardTitle className="text-2xl">Font Weights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-light">font-light (300) - Light weight text</p>
            <p className="font-normal">font-normal (400) - Normal weight text</p>
            <p className="font-medium">font-medium (500) - Medium weight text</p>
            <p className="font-semibold">font-semibold (600) - Semibold weight text</p>
            <p className="font-bold">font-bold (700) - Bold weight text</p>
          </CardContent>
        </Card>

        {/* Line Heights */}
        <Card id="line-heights">
          <CardHeader>
            <CardTitle className="text-2xl">Line Heights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">leading-tight (1.25)</p>
              <p className="leading-tight">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum
                vestibulum. Cras porttitor metus justo.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">leading-normal (1.5)</p>
              <p className="leading-normal">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum
                vestibulum. Cras porttitor metus justo.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">leading-relaxed (1.625)</p>
              <p className="leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum
                vestibulum. Cras porttitor metus justo.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">leading-loose (2)</p>
              <p className="leading-loose">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum
                vestibulum. Cras porttitor metus justo.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Text Colors */}
        <Card id="text-colors">
          <CardHeader>
            <CardTitle className="text-2xl">Text Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-foreground">text-foreground - Primary text color</p>
            <p className="text-muted-foreground">text-muted-foreground - Muted/secondary text</p>
            <p className="text-primary">text-primary - Primary brand color</p>
            <p className="text-secondary-foreground">text-secondary-foreground - Secondary foreground</p>
            <p className="text-accent-foreground">text-accent-foreground - Accent foreground</p>
            <p className="text-destructive">text-destructive - Destructive/error color</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <span className="text-accent-red">accent-red</span>
              <span className="text-accent-orange">accent-orange</span>
              <span className="text-accent-green">accent-green</span>
              <span className="text-accent-blue">accent-blue</span>
              <span className="text-accent-purple">accent-purple</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
