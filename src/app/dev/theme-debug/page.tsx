"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useThemeContext } from "@/contexts/ThemeContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { DevPageHeader } from "@/components/dev/DevPageHeader";
import {
  CSSVariablesSection,
  ColorPaletteSection,
  SurfaceTokensSection,
  OpacityVariantsSection,
  ShadowElevationSection,
  ButtonsSection,
  FormControlsSection,
  FeedbackSection,
  OverlaysSection,
  CardsLayoutSection,
  InteractiveStatesSection,
} from "./_sections";

/** CSS color variables to display in debug view */
const COLOR_VARS = [
  // Base
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  // Semantic
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  // Decorative accents
  "--accent-red",
  "--accent-orange",
  "--accent-green",
  "--accent-blue",
  "--accent-purple",
  // UI elements
  "--border",
  "--border-strong",
  "--input",
  "--ring",
  // Opacity config
  "--accent-high-opacity",
  "--accent-mid-opacity",
  "--accent-low-opacity",
  "--secondary-high-opacity",
  "--secondary-mid-opacity",
  "--secondary-low-opacity",
  // Surface config
  "--surface-opacity",
  "--surface-darken",
  "--surface-card-base",
  "--surface-background-base",
  "--surface-border-color",
  "--surface-shadow",
  // Hover config
  "--primary-hover-value",
  "--primary-hover-foreground-value",
  "--accent-mid-hover-value",
  "--accent-mid-hover-foreground-value",
] as const;

/** Jump links for in-page navigation */
const JUMP_LINKS = [
  { id: "color-palette", label: "Colors" },
  { id: "surface-tokens", label: "Surfaces" },
  { id: "opacity-variants", label: "Opacity" },
  { id: "shadow-elevation", label: "Shadows" },
  { id: "css-variables", label: "Variables" },
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
 * Sections are ordered: tokens first, then component patterns.
 *
 * Route: /dev/theme-debug (only accessible in development - enforced by dev layout)
 */
export default function ThemeDebugPage() {
  const { theme: colorMode } = useTheme();
  const { activeTheme } = useThemeContext();
  const mounted = useHasMounted();
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [cssOpen, setCssOpen] = useState(false);

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
      <div className="space-y-8">
        {/* Token Sections */}
        <ColorPaletteSection />
        <SurfaceTokensSection />
        <OpacityVariantsSection />
        <ShadowElevationSection />
        <CSSVariablesSection variables={variables} open={cssOpen} onOpenChange={setCssOpen} />

        {/* Component Pattern Sections */}
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
