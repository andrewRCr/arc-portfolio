"use client";

/**
 * FontComparisonSection
 *
 * Dev tool for experimenting with the 3-slot typography system.
 * Follows the surface dev page pattern: live CSS variable manipulation,
 * production value comparison, reset-to-production, and CSS export.
 *
 * Slots:
 * - Title: Page titles, project names, section headers
 * - Terminal: Navigation, tabs, badges, labels (system UI elements)
 * - Body: Prose content, descriptions, paragraphs
 *
 * Changes apply to the entire page via CSS variable overrides on
 * document.documentElement. Overrides are removed on unmount.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** Font option with optional next/font CSS variable for export */
interface FontOption {
  label: string;
  family: string;
  fallback: "monospace" | "sans-serif";
  /** CSS variable from next/font in layout.tsx (only for fonts already loaded) */
  cssVar?: string;
}

/** Individual font options available for each slot */
const FONTS: Record<string, FontOption> = {
  // Monospace options
  "geist-mono": {
    label: "Geist Mono",
    family: "var(--font-geist-mono)",
    fallback: "monospace",
    cssVar: "--font-geist-mono",
  },
  "jetbrains-mono": { label: "JetBrains Mono", family: '"JetBrains Mono"', fallback: "monospace" },
  "fira-code": { label: "Fira Code", family: '"Fira Code"', fallback: "monospace", cssVar: "--font-fira-code" },
  "ibm-plex-mono": { label: "IBM Plex Mono", family: '"IBM Plex Mono"', fallback: "monospace" },
  "source-code-pro": { label: "Source Code Pro", family: '"Source Code Pro"', fallback: "monospace" },
  "space-mono": { label: "Space Mono", family: '"Space Mono"', fallback: "monospace" },
  // Sans-serif options
  "geist-sans": {
    label: "Geist Sans",
    family: "var(--font-geist-sans)",
    fallback: "sans-serif",
    cssVar: "--font-geist-sans",
  },
  inter: { label: "Inter", family: '"Inter"', fallback: "sans-serif" },
  "ibm-plex-sans": {
    label: "IBM Plex Sans",
    family: '"IBM Plex Sans"',
    fallback: "sans-serif",
    cssVar: "--font-ibm-plex-sans",
  },
  "source-sans": { label: "Source Sans 3", family: '"Source Sans 3"', fallback: "sans-serif" },
  "space-grotesk": { label: "Space Grotesk", family: '"Space Grotesk"', fallback: "sans-serif" },
};

type FontId = keyof typeof FONTS;

/** Slot configuration */
interface SlotConfig {
  title: FontId;
  terminal: FontId;
  body: FontId;
}

/** Current production font configuration (from globals.css) */
const PRODUCTION_CONFIG: SlotConfig = {
  title: "geist-mono",
  terminal: "geist-mono",
  body: "ibm-plex-sans",
};

/** CSS variables managed by this tool */
const MANAGED_CSS_VARS = ["--font-title", "--font-terminal", "--font-body"] as const;

/** Preset combinations for quick testing */
const PRESETS: Record<string, { label: string; config: SlotConfig }> = {
  production: {
    label: "Production",
    config: PRODUCTION_CONFIG,
  },
  "jetbrains-inter": {
    label: "JetBrains + Inter",
    config: { title: "jetbrains-mono", terminal: "jetbrains-mono", body: "inter" },
  },
  "space-family": {
    label: "Space family",
    config: { title: "space-mono", terminal: "space-mono", body: "space-grotesk" },
  },
  "ibm-plex": {
    label: "IBM Plex family",
    config: { title: "ibm-plex-mono", terminal: "ibm-plex-mono", body: "ibm-plex-sans" },
  },
  "mixed-distinctive": {
    label: "Mixed (JetBrains/Geist/Inter)",
    config: { title: "jetbrains-mono", terminal: "geist-mono", body: "inter" },
  },
};

/** Google Fonts URL for loading comparison fonts */
const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap";

function getFontFamily(fontId: FontId): string {
  const font = FONTS[fontId];
  return `${font.family}, ${font.fallback}`;
}

/** Apply font selections as CSS variable overrides on documentElement */
function applyCssVariables(config: SlotConfig): void {
  const style = document.documentElement.style;
  style.setProperty("--font-title", getFontFamily(config.title));
  style.setProperty("--font-terminal", getFontFamily(config.terminal));
  style.setProperty("--font-body", getFontFamily(config.body));
}

/** Remove all CSS variable overrides (reverts to globals.css defaults) */
function removeCssOverrides(): void {
  const style = document.documentElement.style;
  for (const prop of MANAGED_CSS_VARS) {
    style.removeProperty(prop);
  }
}

/** Format CSS export for globals.css */
function formatExport(config: SlotConfig): string {
  const lines = (["title", "terminal", "body"] as const).map((slot) => {
    const font = FONTS[config[slot]];
    const value = font.cssVar ? `var(${font.cssVar})` : `${font.family}, ${font.fallback}`;
    return `  --font-${slot}: ${value};`;
  });
  return lines.join("\n");
}

/** Check which fonts would need next/font imports in layout.tsx */
function getUnloadedFonts(config: SlotConfig): string[] {
  const unloaded: string[] = [];
  for (const slot of ["title", "terminal", "body"] as const) {
    const font = FONTS[config[slot]];
    if (!font.cssVar && !unloaded.includes(font.label)) {
      unloaded.push(font.label);
    }
  }
  return unloaded;
}

export function FontComparisonSection() {
  const [slots, setSlots] = useState<SlotConfig>(PRODUCTION_CONFIG);
  const [selectedPreset, setSelectedPreset] = useState<string>("production");

  const isDirty = useMemo(
    () =>
      slots.title !== PRODUCTION_CONFIG.title ||
      slots.terminal !== PRODUCTION_CONFIG.terminal ||
      slots.body !== PRODUCTION_CONFIG.body,
    [slots]
  );

  // Apply CSS variable overrides when slots change; clean up on unmount
  useEffect(() => {
    if (isDirty) {
      applyCssVariables(slots);
    } else {
      removeCssOverrides();
    }
    return () => removeCssOverrides();
  }, [slots, isDirty]);

  const applyPreset = useCallback((presetId: string) => {
    setSelectedPreset(presetId);
    if (PRESETS[presetId]) {
      setSlots(PRESETS[presetId].config);
    }
  }, []);

  const updateSlot = useCallback((slot: keyof SlotConfig, fontId: FontId) => {
    setSlots((prev) => ({ ...prev, [slot]: fontId }));
    setSelectedPreset("custom");
  }, []);

  const resetToProduction = useCallback(() => {
    setSlots(PRODUCTION_CONFIG);
    setSelectedPreset("production");
  }, []);

  return (
    <>
      {/* Load Google Fonts for comparison */}
      <link rel="stylesheet" href={GOOGLE_FONTS_URL} />

      <Card id="font-comparison">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-title text-2xl">Font Comparison (3-Slot System)</CardTitle>
            {isDirty && (
              <span className="shrink-0 rounded border border-accent-orange bg-accent-orange/10 px-2 py-0.5 font-terminal text-xs text-accent-orange">
                Modified
              </span>
            )}
          </div>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Changes apply to the entire page via CSS variable overrides. Title: headers/project names | Terminal:
            nav/tabs/badges | Body: prose content
          </p>

          {/* Preset selector + reset */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {Object.entries(PRESETS).map(([id, preset]) => (
              <button
                key={id}
                onClick={() => applyPreset(id)}
                className={`px-3 py-1 font-terminal text-xs rounded-md border transition-colors ${
                  selectedPreset === id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                {preset.label}
              </button>
            ))}
            <button
              onClick={resetToProduction}
              disabled={!isDirty}
              className="ml-auto px-3 py-1 font-terminal text-xs rounded-md border border-border transition-colors hover:border-accent/50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Reset to Production
            </button>
          </div>

          {/* Individual slot selectors */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {(["title", "terminal", "body"] as const).map((slot) => {
              const isSlotDirty = slots[slot] !== PRODUCTION_CONFIG[slot];
              return (
                <div key={slot}>
                  <label className="font-terminal text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {slot}
                  </label>
                  <select
                    value={slots[slot]}
                    onChange={(e) => updateSlot(slot, e.target.value as FontId)}
                    className="w-full mt-1 rounded-md border border-border bg-background px-2 py-1.5 font-body text-sm"
                  >
                    <optgroup label="Monospace">
                      {Object.entries(FONTS)
                        .filter(([, f]) => f.fallback === "monospace")
                        .map(([id, font]) => (
                          <option key={id} value={id}>
                            {font.label}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Sans-serif">
                      {Object.entries(FONTS)
                        .filter(([, f]) => f.fallback === "sans-serif")
                        .map(([id, font]) => (
                          <option key={id} value={id}>
                            {font.label}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                  {isSlotDirty && (
                    <p className="font-terminal text-xs text-muted-foreground mt-1">
                      Production: {FONTS[PRODUCTION_CONFIG[slot]].label}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Project Card Preview - Main showcase */}
          <div className="space-y-4">
            <h3 className="font-terminal text-lg font-semibold">Project Card Preview</h3>
            <p className="font-body text-sm text-muted-foreground">
              Realistic project cards showing all three font slots in context.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-background overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground text-sm">
                  [Project Thumbnail]
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <span className="font-terminal bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                      Web App
                    </span>
                  </div>

                  <h2 className="font-title text-xl font-bold text-foreground">TaskFocus</h2>

                  <p className="font-body text-sm text-muted-foreground">
                    A cross-platform personal task management application with native desktop and web interfaces,
                    designed around the Getting Things Done productivity methodology.
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["React", "TypeScript", ".NET", "Blazor"].map((tech) => (
                      <span
                        key={tech}
                        className="font-terminal border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground text-sm">
                  [Project Thumbnail]
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <span className="font-terminal bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                      Web App
                    </span>
                  </div>

                  <span className="inline-block bg-secondary/80 px-2 py-1">
                    <h2 className="font-title text-xl font-bold text-secondary-foreground">CineXplorer</h2>
                  </span>

                  <p className="font-body text-sm text-muted-foreground">
                    A comprehensive movie discovery application showcasing production-ready full-stack development with
                    systematic AI-assisted workflows.
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["React", "Django", "PostgreSQL", "Docker"].map((tech) => (
                      <span
                        key={tech}
                        className="font-terminal border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation & Tabs Preview */}
          <div className="space-y-4">
            <h3 className="font-terminal text-lg font-semibold">Navigation & Tabs (Terminal Slot)</h3>

            <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
              <div>
                <p className="font-body text-xs text-muted-foreground mb-2">Main Navigation</p>
                <div className="flex gap-1">
                  {["HOME", "PROJECTS", "SKILLS", "ABOUT", "CONTACT"].map((item, i) => (
                    <span
                      key={item}
                      className={`font-terminal px-2 py-1 text-sm font-semibold ${i === 1 ? "bg-secondary/40 text-foreground" : "text-muted-foreground"}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-body text-xs text-muted-foreground mb-2">Project Tabs</p>
                <div className="flex gap-2 border-b border-border">
                  {["SOFTWARE", "GAMES", "MODS"].map((tab, i) => (
                    <span
                      key={tab}
                      className={`font-terminal px-3 pb-2 text-sm font-semibold ${i === 0 ? "text-accent border-b-2 border-accent" : "text-muted-foreground"}`}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-body text-xs text-muted-foreground mb-2">Form Labels</p>
                <label className="font-terminal text-sm font-medium">Email Address</label>
              </div>
            </div>
          </div>

          {/* Page Header Preview */}
          <div className="space-y-4">
            <h3 className="font-terminal text-lg font-semibold">Page Headers (Title Slot)</h3>

            <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
              <div className="space-y-1">
                <h2 className="font-title text-2xl font-bold">Projects</h2>
                <p className="font-body text-sm text-muted-foreground">
                  A collection of software projects, games, and mods.
                </p>
              </div>

              <div className="space-y-1 pt-4 border-t border-border">
                <h2 className="font-title text-2xl font-bold">CineXplorer</h2>
                <p className="font-body text-sm text-muted-foreground">
                  A comprehensive movie discovery application showcasing production-ready full-stack development.
                </p>
              </div>

              <div className="space-y-1 pt-4 border-t border-border">
                <h2 className="font-title text-2xl font-bold">TaskFocus</h2>
                <p className="font-body text-sm text-muted-foreground">
                  Cross-platform personal task management with native desktop and web interfaces.
                </p>
              </div>
            </div>
          </div>

          {/* Body Text Comparison */}
          <div className="space-y-4">
            <h3 className="font-terminal text-lg font-semibold">Body Text (Body Slot)</h3>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="font-body text-sm leading-relaxed">
                A full-stack developer passionate about creating elegant solutions to complex problems. I specialize in
                modern web technologies including React, TypeScript, and Node.js. My work spans from enterprise
                applications to personal projects, always with a focus on clean architecture and user experience. I
                believe in writing code that is not only functional but also maintainable and well-documented.
              </p>
            </div>
          </div>

          {/* CSS Export */}
          <ExportSection config={slots} isDirty={isDirty} />
        </CardContent>
      </Card>
    </>
  );
}

/** Collapsible CSS export section with copy-to-clipboard */
function ExportSection({ config, isDirty }: { config: SlotConfig; isDirty: boolean }) {
  const [copied, setCopied] = useState(false);
  const exportText = formatExport(config);
  const unloadedFonts = getUnloadedFonts(config);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <details className="rounded-lg border border-dashed border-border bg-muted/20">
      <summary className="cursor-pointer p-4 font-terminal text-sm font-semibold select-none">
        CSS Export{isDirty ? " (has changes)" : " (no changes)"}
      </summary>
      <div className="border-t border-border/50 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={copyToClipboard}
            disabled={!isDirty}
            className="px-3 py-1 font-terminal text-xs border border-border rounded hover:border-accent/50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? "Copied!" : "Copy to clipboard"}
          </button>
          {!isDirty && (
            <span className="font-body text-xs text-muted-foreground">Values match production — nothing to update</span>
          )}
        </div>

        <p className="font-body text-xs text-muted-foreground">
          Add to <code className="bg-muted px-1 rounded">globals.css</code> @theme block:
        </p>
        <pre className="font-mono text-xs bg-muted p-3 rounded overflow-x-auto">{exportText}</pre>

        {unloadedFonts.length > 0 && (
          <p className="font-body text-xs text-accent-orange">
            Requires <code className="bg-muted px-1 rounded">next/font</code> import in layout.tsx:{" "}
            {unloadedFonts.join(", ")}
          </p>
        )}

        <p className="font-body text-xs text-muted-foreground">
          Use <code className="bg-muted px-1 rounded">font-title</code>,{" "}
          <code className="bg-muted px-1 rounded">font-terminal</code>,{" "}
          <code className="bg-muted px-1 rounded">font-body</code> utility classes.
        </p>
      </div>
    </details>
  );
}
