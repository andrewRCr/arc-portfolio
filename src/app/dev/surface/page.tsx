"use client";

/**
 * Surface Tuning Dev Tool
 *
 * Interactive tool for comparing production surface values with experimental ones.
 * Supports separate light/dark mode value sets, live preview on actual page surfaces,
 * and TypeScript export for easy theme definition updates.
 *
 * Route: /dev/surface
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { DevPageHeader } from "@/components/dev/DevPageHeader";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useThemeTransition } from "@/hooks/useThemeTransition";
import { useThemeContext } from "@/contexts/ThemeContext";
import { themes, type ModeSurfaceConfig, type SurfaceShadow } from "@/data/themes";

// =============================================================================
// TYPES
// =============================================================================

/** Tunable surface parameters (excludes surfaceHierarchy which is architectural) */
interface TunableConfig {
  surfaceOpacity: number;
  surfaceDarken: number;
  windowOpacity: number;
  windowDarken: number;
  surfaceBorderStrong: boolean;
  surfaceShadow: SurfaceShadow;
}

// CSS variables manipulated by this tool
const MANAGED_CSS_VARS = [
  "--surface-opacity",
  "--surface-darken",
  "--window-bg-opacity",
  "--window-darken",
  "--surface-border-color",
  "--surface-shadow",
] as const;

// =============================================================================
// HELPERS
// =============================================================================

/** Extract tunable fields from a full ModeSurfaceConfig */
function toTunable(config: ModeSurfaceConfig): TunableConfig {
  return {
    surfaceOpacity: config.surfaceOpacity,
    surfaceDarken: config.surfaceDarken,
    windowOpacity: config.windowOpacity,
    windowDarken: config.windowDarken,
    surfaceBorderStrong: config.surfaceBorderStrong,
    surfaceShadow: config.surfaceShadow,
  };
}

/** Apply a TunableConfig to the document's CSS variables */
function applyCssVariables(config: TunableConfig): void {
  const style = document.documentElement.style;
  style.setProperty("--surface-opacity", config.surfaceOpacity.toString());
  style.setProperty("--surface-darken", `${config.surfaceDarken}%`);
  style.setProperty("--window-bg-opacity", config.windowOpacity.toString());
  style.setProperty("--window-darken", `${config.windowDarken}%`);
  style.setProperty(
    "--surface-border-color",
    config.surfaceBorderStrong ? "rgb(var(--border-strong))" : "rgb(var(--border))"
  );
  style.setProperty(
    "--surface-shadow",
    config.surfaceShadow === "none" ? "none" : `var(--shadow-${config.surfaceShadow})`
  );
}

/** Remove all managed inline CSS variable overrides */
function removeCssOverrides(): void {
  const style = document.documentElement.style;
  for (const prop of MANAGED_CSS_VARS) {
    style.removeProperty(prop);
  }
}

/** Format a ModeSurfaceConfig as TypeScript for copy-paste into theme definitions */
function formatExport(
  light: TunableConfig,
  dark: TunableConfig,
  lightHierarchy: string,
  darkHierarchy: string
): string {
  const fmt = (c: TunableConfig, hierarchy: string) =>
    `  { surfaceOpacity: ${c.surfaceOpacity}, surfaceDarken: ${c.surfaceDarken}, windowOpacity: ${c.windowOpacity}, windowDarken: ${c.windowDarken}, surfaceHierarchy: "${hierarchy}", surfaceBorderStrong: ${c.surfaceBorderStrong}, surfaceShadow: "${c.surfaceShadow}" }`;

  return `const surfaces: ThemeSurfaces = {\n  light:\n${fmt(light, lightHierarchy)},\n  dark:\n${fmt(dark, darkHierarchy)},\n};`;
}

// =============================================================================
// SURFACE TUNING TOOL
// =============================================================================

function SurfaceTuningTool() {
  const { activeTheme } = useThemeContext();
  const { theme: colorMode, setTheme } = useThemeTransition();

  // Resolve current mode — default to "dark" for "system"/undefined
  const currentMode = colorMode === "light" ? "light" : "dark";

  // Production values from active theme
  const themeData = themes[activeTheme];
  const prodLight = themeData.surfaces
    ? toTunable(themeData.surfaces.light)
    : {
        surfaceOpacity: 0.7,
        surfaceDarken: 20,
        windowOpacity: 0.7,
        windowDarken: 10,
        surfaceBorderStrong: true,
        surfaceShadow: "md" as SurfaceShadow,
      };
  const prodDark = themeData.surfaces
    ? toTunable(themeData.surfaces.dark)
    : {
        surfaceOpacity: 0.8,
        surfaceDarken: 0,
        windowOpacity: 0.8,
        windowDarken: 0,
        surfaceBorderStrong: false,
        surfaceShadow: "none" as SurfaceShadow,
      };
  const lightHierarchy = themeData.surfaces?.light.surfaceHierarchy ?? "swapped";
  const darkHierarchy = themeData.surfaces?.dark.surfaceHierarchy ?? "normal";

  // Experimental value sets (initialized from production)
  const [expLight, setExpLight] = useState<TunableConfig>(prodLight);
  const [expDark, setExpDark] = useState<TunableConfig>(prodDark);

  // Track whether we've applied overrides (for cleanup)
  const hasApplied = useRef(false);

  // Active experimental config for current mode
  const activeExp = currentMode === "light" ? expLight : expDark;
  const setActiveExp = currentMode === "light" ? setExpLight : setExpDark;
  const activeProd = currentMode === "light" ? prodLight : prodDark;

  // Apply CSS overrides whenever the active experimental config changes
  useEffect(() => {
    applyCssVariables(activeExp);
    hasApplied.current = true;
  }, [activeExp]);

  // Cleanup: remove all inline overrides on unmount
  useEffect(() => {
    return () => {
      if (hasApplied.current) {
        removeCssOverrides();
      }
    };
  }, []);

  // Re-sync experimental values when theme palette changes
  useEffect(() => {
    setExpLight(prodLight);
    setExpDark(prodDark);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTheme]);

  // Update a single field in the active experimental config
  const updateField = useCallback(
    <K extends keyof TunableConfig>(field: K, value: TunableConfig[K]) => {
      setActiveExp((prev) => ({ ...prev, [field]: value }));
    },
    [setActiveExp]
  );

  // Reset current mode to production values
  const resetToProduction = useCallback(() => {
    setActiveExp(activeProd);
  }, [setActiveExp, activeProd]);

  // Switch editing mode
  const switchMode = useCallback(
    (mode: "light" | "dark") => {
      if (mode === currentMode) return;
      setTheme(mode);
    },
    [currentMode, setTheme]
  );

  // Check if current values differ from production
  const isDirty = JSON.stringify(activeExp) !== JSON.stringify(activeProd);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-mono text-lg font-semibold">Surface Tuning</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Compare and adjust surface parameters. Changes apply live to all page surfaces. Active theme:{" "}
          <strong>{themeData.label}</strong>
        </p>
      </div>

      {/* Mode switcher + status */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {(["dark", "light"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => switchMode(mode)}
              className={`px-4 py-1.5 text-sm font-terminal border rounded transition-colors ${
                currentMode === mode
                  ? "border-accent bg-accent/20 text-foreground"
                  : "border-border hover:border-accent/50 text-muted-foreground"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          Editing: <strong>{currentMode}</strong> mode
          {isDirty && <span className="ml-2 text-accent">(modified)</span>}
        </span>
      </div>

      {/* Control panel — uses bg-surface-background so border/shadow changes are visible */}
      <div className="p-4 border rounded-lg bg-surface-background space-y-4">
        {/* Surface opacity */}
        <SliderControl
          label="--surface-opacity"
          min={0.5}
          max={1}
          step={0.02}
          value={activeExp.surfaceOpacity}
          prodValue={activeProd.surfaceOpacity}
          format={(v) => v.toFixed(2)}
          onChange={(v) => updateField("surfaceOpacity", v)}
        />

        {/* Surface darken */}
        <SliderControl
          label="--surface-darken"
          min={0}
          max={30}
          step={1}
          value={activeExp.surfaceDarken}
          prodValue={activeProd.surfaceDarken}
          format={(v) => `${v}%`}
          onChange={(v) => updateField("surfaceDarken", v)}
        />

        {/* Window opacity */}
        <SliderControl
          label="--window-bg-opacity"
          min={0.4}
          max={1}
          step={0.02}
          value={activeExp.windowOpacity}
          prodValue={activeProd.windowOpacity}
          format={(v) => v.toFixed(2)}
          onChange={(v) => updateField("windowOpacity", v)}
        />

        {/* Window darken */}
        <SliderControl
          label="--window-darken"
          min={0}
          max={20}
          step={1}
          value={activeExp.windowDarken}
          prodValue={activeProd.windowDarken}
          format={(v) => `${v}%`}
          onChange={(v) => updateField("windowDarken", v)}
        />

        {/* Divider */}
        <div className="border-t border-border/50 pt-4 mt-4">
          <p className="text-xs font-terminal text-muted-foreground mb-3">Visual Definition (borders & shadows)</p>
        </div>

        {/* Border strength */}
        <div className="flex items-center gap-4">
          <span className="font-terminal text-sm text-muted-foreground w-48">Border strength:</span>
          <div className="flex gap-2">
            {([false, true] as const).map((strong) => (
              <button
                key={String(strong)}
                onClick={() => updateField("surfaceBorderStrong", strong)}
                className={`px-3 py-1 text-xs font-terminal border rounded transition-colors ${
                  activeExp.surfaceBorderStrong === strong
                    ? "border-accent bg-accent/20 text-foreground"
                    : "border-border hover:border-accent/50 text-muted-foreground"
                }`}
              >
                {strong ? "strong" : "normal"}
              </button>
            ))}
          </div>
          {activeExp.surfaceBorderStrong !== activeProd.surfaceBorderStrong && (
            <span className="text-xs text-muted-foreground">
              prod: {activeProd.surfaceBorderStrong ? "strong" : "normal"}
            </span>
          )}
        </div>

        {/* Shadow level */}
        <div className="flex items-center gap-4">
          <span className="font-terminal text-sm text-muted-foreground w-48">Shadow level:</span>
          <div className="flex gap-2">
            {(["none", "sm", "md", "lg"] as SurfaceShadow[]).map((level) => (
              <button
                key={level}
                onClick={() => updateField("surfaceShadow", level)}
                className={`px-3 py-1 text-xs font-terminal border rounded transition-colors ${
                  activeExp.surfaceShadow === level
                    ? "border-accent bg-accent/20 text-foreground"
                    : "border-border hover:border-accent/50 text-muted-foreground"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          {activeExp.surfaceShadow !== activeProd.surfaceShadow && (
            <span className="text-xs text-muted-foreground">prod: {activeProd.surfaceShadow}</span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={resetToProduction}
          disabled={!isDirty}
          className={`px-4 py-1.5 text-sm font-terminal border rounded transition-colors ${
            isDirty
              ? "border-border hover:border-accent/50 text-foreground"
              : "border-border/50 text-muted-foreground/50 cursor-not-allowed"
          }`}
        >
          Reset to production
        </button>
      </div>

      {/* Production vs experimental comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        <ValueDisplay label="Production" config={activeProd} />
        <ValueDisplay label="Experimental" config={activeExp} isModified={isDirty} />
      </div>

      {/* Live preview with real surface token classes */}
      <SurfacePreview />

      {/* Export */}
      <ExportSection
        light={expLight}
        dark={expDark}
        lightHierarchy={lightHierarchy}
        darkHierarchy={darkHierarchy}
        lightDirty={JSON.stringify(expLight) !== JSON.stringify(prodLight)}
        darkDirty={JSON.stringify(expDark) !== JSON.stringify(prodDark)}
      />
    </div>
  );
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

interface SliderControlProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  prodValue: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

function SliderControl({ label, min, max, step, value, prodValue, format, onChange }: SliderControlProps) {
  const isModified = Math.abs(value - prodValue) > 0.001;
  return (
    <label className="flex items-center gap-4">
      <span className="font-terminal text-sm text-muted-foreground w-48">{label}:</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1"
      />
      <span className="font-mono text-sm w-12">{format(value)}</span>
      {isModified && <span className="text-xs text-muted-foreground w-20">prod: {format(prodValue)}</span>}
    </label>
  );
}

interface ValueDisplayProps {
  label: string;
  config: TunableConfig;
  isModified?: boolean;
}

function ValueDisplay({ label, config, isModified }: ValueDisplayProps) {
  return (
    <div className={`p-4 border rounded-lg bg-surface-card ${isModified ? "border-accent/50" : ""}`}>
      <h3 className="font-terminal text-sm font-semibold mb-2">
        {label}
        {isModified && <span className="ml-2 text-accent text-xs font-normal">(modified)</span>}
      </h3>
      <div className="text-xs font-mono text-muted-foreground space-y-1">
        <div>
          surface: {config.surfaceOpacity.toFixed(2)}&alpha; {config.surfaceDarken}%dk
        </div>
        <div>
          window: {config.windowOpacity.toFixed(2)}&alpha; {config.windowDarken}%dk
        </div>
        <div>
          border: {config.surfaceBorderStrong ? "strong" : "normal"} | shadow: {config.surfaceShadow}
        </div>
      </div>
    </div>
  );
}

/** Sample cards that mirror real app patterns for visual feedback */
function SurfacePreview() {
  return (
    <div className="space-y-3">
      <h3 className="font-terminal text-sm text-muted-foreground">Live Preview</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Card pattern (like FeaturedSection / ProjectCard) */}
        <div className="border rounded-sm overflow-hidden bg-surface-card">
          <div className="p-4 pb-2 bg-surface-card">
            <span className="text-xs font-terminal text-foreground">[software]</span>
            <h4 className="font-semibold font-title mt-1">
              <span className="bg-accent-low px-1.5 py-0.5 text-accent-low-foreground">Project Title</span>
            </h4>
          </div>
          <div className="min-h-16 px-4 py-3 bg-surface-background">
            <p className="text-sm text-muted-foreground">Body content using bg-surface-background.</p>
          </div>
        </div>

        {/* Detail card pattern (like EducationCard / DetailCard) */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-surface-card px-4 py-3">
            <h4 className="font-title text-base font-bold">Detail Card Header</h4>
          </div>
          <div className="bg-surface-background px-4 py-3">
            <p className="text-sm text-muted-foreground">Body with surface-background.</p>
            <div className="flex gap-2 mt-2">
              <span className="border border-border bg-surface-muted px-2 py-0.5 text-xs text-muted-foreground">
                badge
              </span>
              <span className="border border-border bg-surface-muted px-2 py-0.5 text-xs text-muted-foreground">
                tag
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ExportSectionProps {
  light: TunableConfig;
  dark: TunableConfig;
  lightHierarchy: string;
  darkHierarchy: string;
  lightDirty: boolean;
  darkDirty: boolean;
}

function ExportSection({ light, dark, lightHierarchy, darkHierarchy, lightDirty, darkDirty }: ExportSectionProps) {
  const [copied, setCopied] = useState(false);
  const exportText = formatExport(light, dark, lightHierarchy, darkHierarchy);
  const hasDiff = lightDirty || darkDirty;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <details className="border border-border rounded-lg">
      <summary className="px-4 py-2 cursor-pointer text-sm font-terminal text-muted-foreground hover:text-foreground">
        Export TypeScript {hasDiff ? "(has changes)" : "(no changes)"}
      </summary>
      <div className="px-4 py-3 border-t border-border">
        <pre className="text-xs font-mono bg-muted/50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
          {exportText}
        </pre>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 text-xs font-terminal border border-border rounded hover:border-accent/50"
          >
            {copied ? "Copied!" : "Copy to clipboard"}
          </button>
          {!hasDiff && (
            <span className="text-xs text-muted-foreground">Values match production — nothing to update</span>
          )}
        </div>
      </div>
    </details>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function SurfaceTuningPage() {
  const mounted = useHasMounted();

  if (!mounted) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <PageLayout header={<DevPageHeader title="Surface Tuning" jumpLinks={[]} showEnvPreview={true} />}>
      <SurfaceTuningTool />
    </PageLayout>
  );
}
