"use client";

/**
 * FontComparisonSection
 *
 * Dev tool for comparing font choices across a 3-slot typography system:
 * - Title: Page titles, project names, section headers
 * - Terminal: Navigation, tabs, badges, labels (system UI elements)
 * - Body: Prose content, descriptions, paragraphs
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** Individual font options available for each slot */
const FONTS = {
  // Monospace options
  "geist-mono": { label: "Geist Mono", family: "var(--font-geist-mono)", fallback: "monospace" },
  "jetbrains-mono": { label: "JetBrains Mono", family: '"JetBrains Mono"', fallback: "monospace" },
  "fira-code": { label: "Fira Code", family: '"Fira Code"', fallback: "monospace" },
  "ibm-plex-mono": { label: "IBM Plex Mono", family: '"IBM Plex Mono"', fallback: "monospace" },
  "source-code-pro": { label: "Source Code Pro", family: '"Source Code Pro"', fallback: "monospace" },
  "space-mono": { label: "Space Mono", family: '"Space Mono"', fallback: "monospace" },
  // Sans-serif options
  "geist-sans": { label: "Geist Sans", family: "var(--font-geist-sans)", fallback: "sans-serif" },
  inter: { label: "Inter", family: '"Inter"', fallback: "sans-serif" },
  "ibm-plex-sans": { label: "IBM Plex Sans", family: '"IBM Plex Sans"', fallback: "sans-serif" },
  "source-sans": { label: "Source Sans 3", family: '"Source Sans 3"', fallback: "sans-serif" },
  "space-grotesk": { label: "Space Grotesk", family: '"Space Grotesk"', fallback: "sans-serif" },
} as const;

type FontId = keyof typeof FONTS;

/** Slot configuration */
interface SlotConfig {
  title: FontId;
  terminal: FontId;
  body: FontId;
}

/** Preset combinations for quick testing */
const PRESETS: Record<string, { label: string; config: SlotConfig }> = {
  current: {
    label: "Current (Geist all)",
    config: { title: "geist-mono", terminal: "geist-mono", body: "geist-sans" },
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

export function FontComparisonSection() {
  const [slots, setSlots] = useState<SlotConfig>({
    title: "geist-mono",
    terminal: "geist-mono",
    body: "geist-sans",
  });
  const [selectedPreset, setSelectedPreset] = useState<string>("current");

  const applyPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    if (PRESETS[presetId]) {
      setSlots(PRESETS[presetId].config);
    }
  };

  const updateSlot = (slot: keyof SlotConfig, fontId: FontId) => {
    setSlots((prev) => ({ ...prev, [slot]: fontId }));
    setSelectedPreset("custom");
  };

  const titleFamily = getFontFamily(slots.title);
  const terminalFamily = getFontFamily(slots.terminal);
  const bodyFamily = getFontFamily(slots.body);

  return (
    <>
      {/* Load Google Fonts for comparison */}
      <link rel="stylesheet" href={GOOGLE_FONTS_URL} />

      <Card id="font-comparison">
        <CardHeader>
          <CardTitle className="text-2xl">Font Comparison (3-Slot System)</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Title: headers/project names | Terminal: nav/tabs/badges | Body: prose content
          </p>

          {/* Preset selector */}
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(PRESETS).map(([id, preset]) => (
              <button
                key={id}
                onClick={() => applyPreset(id)}
                className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                  selectedPreset === id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Individual slot selectors */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {(["title", "terminal", "body"] as const).map((slot) => (
              <div key={slot}>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{slot}</label>
                <select
                  value={slots[slot]}
                  onChange={(e) => updateSlot(slot, e.target.value as FontId)}
                  className="w-full mt-1 rounded-md border border-border bg-background px-2 py-1.5 text-sm"
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
                <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: getFontFamily(slots[slot]) }}>
                  {FONTS[slots[slot]].label}
                </p>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Project Card Preview - Main showcase */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Project Card Preview</h3>
            <p className="text-sm text-muted-foreground">
              Realistic project cards showing all three font slots in context.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-background overflow-hidden">
                {/* Thumbnail placeholder */}
                <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground text-sm">
                  [Project Thumbnail]
                </div>

                <div className="p-4 space-y-3">
                  {/* Category badge - Terminal slot */}
                  <div className="flex gap-2">
                    <span
                      className="bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground"
                      style={{ fontFamily: terminalFamily }}
                    >
                      Web App
                    </span>
                  </div>

                  {/* Project title - Title slot */}
                  <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: titleFamily }}>
                    TaskFocus
                  </h2>

                  {/* Description - Body slot */}
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: bodyFamily }}>
                    A cross-platform personal task management application with native desktop and web interfaces,
                    designed around the Getting Things Done productivity methodology.
                  </p>

                  {/* Tech stack badges - Terminal slot */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["React", "TypeScript", ".NET", "Blazor"].map((tech) => (
                      <span
                        key={tech}
                        className="border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                        style={{ fontFamily: terminalFamily }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Second card - CineXplorer */}
              <div className="rounded-lg border border-border bg-background overflow-hidden">
                {/* Thumbnail placeholder */}
                <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground text-sm">
                  [Project Thumbnail]
                </div>

                <div className="p-4 space-y-3">
                  {/* Category badge - Terminal slot */}
                  <div className="flex gap-2">
                    <span
                      className="bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground"
                      style={{ fontFamily: terminalFamily }}
                    >
                      Web App
                    </span>
                  </div>

                  <span className="inline-block bg-secondary/80 px-2 py-1 ">
                    {/* Project title - Title slot */}
                    <h2 className="text-xl font-bold text-secondary-foreground" style={{ fontFamily: titleFamily }}>
                      CineXplorer
                    </h2>
                  </span>
                  {/* <span className="inline-block bg-muted px-3 py-1.5 text-base font-mono text-muted-foreground">
                    Web App
                  </span> */}

                  {/* Description - Body slot */}
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: bodyFamily }}>
                    A comprehensive movie discovery application showcasing production-ready full-stack development with
                    systematic AI-assisted workflows.
                  </p>

                  {/* Tech stack badges - Terminal slot */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["React", "Django", "PostgreSQL", "Docker"].map((tech) => (
                      <span
                        key={tech}
                        className="border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                        style={{ fontFamily: terminalFamily }}
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
            <h3 className="text-lg font-semibold">Navigation & Tabs (Terminal Slot)</h3>

            <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
              {/* Navigation */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Main Navigation</p>
                <div className="flex gap-1">
                  {["HOME", "PROJECTS", "SKILLS", "ABOUT", "CONTACT"].map((item, i) => (
                    <span
                      key={item}
                      className={`px-2 py-1 text-sm font-semibold ${i === 1 ? "bg-secondary/40 text-foreground" : "text-muted-foreground"}`}
                      style={{ fontFamily: terminalFamily }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Project Tabs</p>
                <div className="flex gap-2 border-b border-border">
                  {["SOFTWARE", "GAMES", "MODS"].map((tab, i) => (
                    <span
                      key={tab}
                      className={`px-3 pb-2 text-sm font-semibold ${i === 0 ? "text-accent border-b-2 border-accent" : "text-muted-foreground"}`}
                      style={{ fontFamily: terminalFamily }}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
              </div>

              {/* Form label */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Form Labels</p>
                <label className="text-sm font-medium" style={{ fontFamily: terminalFamily }}>
                  Email Address
                </label>
              </div>
            </div>
          </div>

          {/* Page Header Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Page Headers (Title Slot)</h3>

            <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold" style={{ fontFamily: titleFamily }}>
                  Projects
                </h2>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: bodyFamily }}>
                  A collection of software projects, games, and mods.
                </p>
              </div>

              <div className="space-y-1 pt-4 border-t border-border">
                <h2 className="text-2xl font-bold" style={{ fontFamily: titleFamily }}>
                  CineXplorer
                </h2>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: bodyFamily }}>
                  A comprehensive movie discovery application showcasing production-ready full-stack development.
                </p>
              </div>

              <div className="space-y-1 pt-4 border-t border-border">
                <h2 className="text-2xl font-bold" style={{ fontFamily: titleFamily }}>
                  TaskFocus
                </h2>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: bodyFamily }}>
                  Cross-platform personal task management with native desktop and web interfaces.
                </p>
              </div>
            </div>
          </div>

          {/* Body Text Comparison */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Body Text (Body Slot)</h3>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm leading-relaxed" style={{ fontFamily: bodyFamily }}>
                A full-stack developer passionate about creating elegant solutions to complex problems. I specialize in
                modern web technologies including React, TypeScript, and Node.js. My work spans from enterprise
                applications to personal projects, always with a focus on clean architecture and user experience. I
                believe in writing code that is not only functional but also maintainable and well-documented.
              </p>
            </div>
          </div>

          {/* Implementation Note */}
          <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4">
            <h4 className="text-sm font-semibold mb-2">Implementation</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Add to <code className="bg-muted px-1 rounded">globals.css</code> @theme block:
            </p>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
              {`--font-title: ${FONTS[slots.title].family};
--font-terminal: ${FONTS[slots.terminal].family};
--font-body: ${FONTS[slots.body].family};`}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              Then use <code className="bg-muted px-1 rounded">font-title</code>,{" "}
              <code className="bg-muted px-1 rounded">font-terminal</code>,{" "}
              <code className="bg-muted px-1 rounded">font-body</code> utility classes.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
