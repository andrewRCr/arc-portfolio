"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useThemeContext } from "@/contexts/ThemeContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { DevPageHeader } from "@/components/dev/DevPageHeader";
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

/** Jump links for in-page navigation */
const JUMP_LINKS = [
  { id: "css-variables", label: "Variables" },
  { id: "color-palette", label: "Colors" },
  { id: "buttons", label: "Buttons" },
  { id: "form-controls", label: "Forms" },
  { id: "feedback", label: "Feedback" },
  { id: "overlays", label: "Overlays" },
  { id: "cards", label: "Cards" },
  { id: "interactive", label: "Interactive" },
];

/**
 * Theme Debug Page
 *
 * Development-only page for visual testing of the theme system.
 * Consolidates CSS variable inspection, color swatches, and component demos.
 *
 * Route: /dev/theme-debug (only accessible in development - enforced by dev layout)
 */
export default function ThemeDebugPage() {
  const { theme: colorMode } = useTheme();
  const { activeTheme } = useThemeContext();
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

  if (!mounted) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-muted-foreground">Loading theme debug...</p>
      </div>
    );
  }

  return (
    <PageLayout header={<DevPageHeader title="Theme Debug" jumpLinks={JUMP_LINKS} showEnvPreview />}>
      <div className="space-y-8 p-8">
        <CSSVariablesSection variables={variables} open={cssOpen} onOpenChange={setCssOpen} />
        <ColorPaletteSection />
        <ButtonsSection />
        <FormControlsSection />
        <FeedbackSection />
        <OverlaysSection />
        <CardsLayoutSection />
        <InteractiveStatesSection />
      </div>
    </PageLayout>
  );
}
