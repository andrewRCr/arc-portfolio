"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { useTheme } from "next-themes";
import { useThemeContext } from "@/contexts/ThemeContext";
import { themes, type ThemeName } from "@/data/themes";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  CSSVariablesSection,
  ColorPaletteSection,
  ButtonsSection,
  FormControlsSection,
  FeedbackSection,
  OverlaysSection,
  CardsLayoutSection,
  InteractiveStatesSection,
} from "./_sections";

/** CSS color variables to display in debug view */
const COLOR_VARS = [
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
] as const;

/**
 * Theme Debug Page
 *
 * Development-only page for visual testing of the theme system.
 * Consolidates CSS variable inspection, color swatches, and component demos.
 *
 * Route: /dev/theme-debug (only accessible in development)
 */
export default function ThemeDebugPage() {
  // Gate to development mode only - wrapper ensures hooks in content are unconditional
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  return <ThemeDebugContent />;
}

/** Inner component with hooks - always called unconditionally */
function ThemeDebugContent() {
  const { theme: colorMode } = useTheme();
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

    const values: Record<string, string> = {};
    COLOR_VARS.forEach((varName) => {
      const value = computedStyle.getPropertyValue(varName).trim();
      values[varName] = value || "(not set)";
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Debug page reads DOM on mount
    setVariables(values);
  }, [mounted, activeTheme, colorMode]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Get sticky header height dynamically, fallback to 120px
      const stickyHeader = document.querySelector(".sticky.top-0");
      const headerOffset = stickyHeader ? stickyHeader.getBoundingClientRect().height + 16 : 120;
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
      <div className="sticky top-0 z-10 mt-3 border-b border-border px-6 py-3 backdrop-blur-sm">
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

              {/* Mode toggle */}
              <ThemeToggle />
            </div>
          </div>

          {/* Jump links */}
          <div className="flex flex-wrap justify-center gap-2 border-t border-border/50 pt-2">
            {[
              { id: "css-variables", label: "Variables" },
              { id: "color-palette", label: "Colors" },
              { id: "buttons", label: "Buttons" },
              { id: "form-controls", label: "Forms" },
              { id: "feedback", label: "Feedback" },
              { id: "overlays", label: "Overlays" },
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
        <CSSVariablesSection variables={variables} open={cssOpen} onOpenChange={setCssOpen} />
        <ColorPaletteSection />
        <ButtonsSection />
        <FormControlsSection />
        <FeedbackSection />
        <OverlaysSection />
        <CardsLayoutSection />
        <InteractiveStatesSection />
      </div>
    </div>
  );
}
