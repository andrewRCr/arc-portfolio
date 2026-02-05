"use client";

/**
 * Development Sandbox Page
 *
 * Permanent scratch space for quick visual prototyping and A/B testing.
 * Modify freely - content here is meant to be temporary experiments.
 *
 * Route: /dev/sandbox
 */

import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { DevPageHeader } from "@/components/dev/DevPageHeader";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useThemeTransition } from "@/hooks/useThemeTransition";

// =============================================================================
// SURFACE OPACITY A/B COMPARISON
// =============================================================================

type BorderMode = "normal" | "strong" | "boosted";
type ShadowLevel = "none" | "sm" | "md" | "lg";

interface ValueSet {
  surfaceOpacity: number;
  surfaceDarken: number;
  windowOpacity: number;
  windowDarken: number; // 0-20%, mix foreground into window bg
  borderMode: BorderMode;
  shadowLevel: ShadowLevel;
  wallpaperOverlay: number; // 0-100, positive = darken, negative = lighten
}

const DEFAULT_DARK: ValueSet = {
  surfaceOpacity: 0.8,
  surfaceDarken: 0,
  windowOpacity: 0.8,
  windowDarken: 0,
  borderMode: "normal",
  shadowLevel: "none",
  wallpaperOverlay: 0, // no change
};

const DEFAULT_LIGHT: ValueSet = {
  surfaceOpacity: 0.92,
  surfaceDarken: 5,
  windowOpacity: 0.7,
  windowDarken: 3, // slight darken for window bg
  borderMode: "strong",
  shadowLevel: "md",
  wallpaperOverlay: 15, // slight darken to improve contrast
};

function SurfaceOpacityComparison() {
  // Current working values
  const [lightOpacity, setLightOpacity] = useState(0.92);
  const [lightDarken, setLightDarken] = useState(5);
  const [windowOpacity, setWindowOpacity] = useState(0.7);
  const [windowDarken, setWindowDarken] = useState(3);
  const [borderMode, setBorderMode] = useState<BorderMode>("strong");
  const [shadowLevel, setShadowLevel] = useState<ShadowLevel>("md");
  const [wallpaperOverlay, setWallpaperOverlay] = useState(15);

  // Saved candidate sets for each mode
  const [darkModeSet, setDarkModeSet] = useState<ValueSet>(DEFAULT_DARK);
  const [lightModeSet, setLightModeSet] = useState<ValueSet>(DEFAULT_LIGHT);

  // Track which mode we're editing
  const [editingMode, setEditingMode] = useState<"light" | "dark">("light");

  // Theme switching
  const { setTheme } = useThemeTransition();

  // Apply a full value set to the UI and CSS
  const applyValueSet = (set: ValueSet) => {
    setLightOpacity(set.surfaceOpacity);
    setLightDarken(set.surfaceDarken);
    setWindowOpacity(set.windowOpacity);
    setWindowDarken(set.windowDarken);
    setBorderMode(set.borderMode);
    setShadowLevel(set.shadowLevel);
    setWallpaperOverlay(set.wallpaperOverlay);

    // Apply to CSS
    document.documentElement.style.setProperty("--surface-opacity", set.surfaceOpacity.toString());
    document.documentElement.style.setProperty("--surface-darken", `${set.surfaceDarken}%`);
    document.documentElement.style.setProperty("--window-darken", `${set.windowDarken}%`);
    document.querySelectorAll("[data-window-container]").forEach((el) => {
      (el as HTMLElement).style.setProperty("--window-bg-opacity", set.windowOpacity.toString());
    });
    applyWallpaperOverlay(set.wallpaperOverlay);
  };

  // Get current values as a set
  const getCurrentSet = (): ValueSet => ({
    surfaceOpacity: lightOpacity,
    surfaceDarken: lightDarken,
    windowOpacity: windowOpacity,
    windowDarken: windowDarken,
    borderMode: borderMode,
    shadowLevel: shadowLevel,
    wallpaperOverlay: wallpaperOverlay,
  });

  // Apply wallpaper overlay via pseudo-element injection
  const applyWallpaperOverlay = (value: number) => {
    const bg = document.querySelector("[data-testid='wallpaper-background']") as HTMLElement;
    if (!bg) return;

    // Remove existing overlay
    const existing = bg.querySelector("[data-sandbox-overlay]");
    if (existing) existing.remove();

    if (value === 0) return;

    // Create overlay div
    const overlay = document.createElement("div");
    overlay.setAttribute("data-sandbox-overlay", "true");
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: ${value > 0 ? `rgba(0,0,0,${value / 100})` : `rgba(255,255,255,${Math.abs(value) / 100})`};
      z-index: 1;
    `;
    bg.appendChild(overlay);
  };

  const updateWallpaperOverlay = (value: number) => {
    setWallpaperOverlay(value);
    applyWallpaperOverlay(value);
  };

  // Save current values to a mode
  const saveToMode = (mode: "light" | "dark") => {
    const current = getCurrentSet();
    if (mode === "light") {
      setLightModeSet(current);
    } else {
      setDarkModeSet(current);
    }
  };

  // Load and apply a mode's saved values (also switches color mode)
  const loadMode = (mode: "light" | "dark") => {
    setEditingMode(mode);
    setTheme(mode); // Switch actual color mode
    applyValueSet(mode === "light" ? lightModeSet : darkModeSet);
  };

  // Update CSS variables in real-time
  const updateOpacity = (value: number) => {
    setLightOpacity(value);
    document.documentElement.style.setProperty("--surface-opacity", value.toString());
  };

  const updateDarken = (value: number) => {
    setLightDarken(value);
    document.documentElement.style.setProperty("--surface-darken", `${value}%`);
  };

  const updateWindowOpacity = (value: number) => {
    setWindowOpacity(value);
    // WindowContainer uses inline style, so we need to update all instances directly
    document.querySelectorAll("[data-window-container]").forEach((el) => {
      (el as HTMLElement).style.setProperty("--window-bg-opacity", value.toString());
    });
  };

  const updateWindowDarken = (value: number) => {
    setWindowDarken(value);
    document.documentElement.style.setProperty("--window-darken", `${value}%`);
  };

  // Border class based on mode
  const getBorderClass = (mode: BorderMode) => {
    switch (mode) {
      case "normal":
        return "border-border";
      case "strong":
        return "border-border-strong";
      case "boosted":
        return "border-foreground/30"; // Even stronger for light mode
    }
  };

  // Shadow class based on level
  const getShadowClass = (level: ShadowLevel) => {
    switch (level) {
      case "none":
        return "";
      case "sm":
        return "shadow-sm";
      case "md":
        return "shadow-md";
      case "lg":
        return "shadow-lg";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-lg font-semibold">Surface Hierarchy: Mode-Aware Tuning</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Define separate value sets for light and dark modes. Save your tuned values, then switch themes to compare.
        </p>
      </div>

      {/* Mode candidate sets */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Dark mode set */}
        <div
          className={`p-4 border rounded-lg ${editingMode === "dark" ? "border-accent bg-accent/10" : "border-border"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-terminal text-sm font-semibold">Dark Mode Set</h3>
            <div className="flex gap-2">
              <button
                onClick={() => loadMode("dark")}
                className="px-2 py-1 text-xs font-terminal border border-border rounded hover:border-accent/50"
              >
                Load
              </button>
              <button
                onClick={() => saveToMode("dark")}
                className="px-2 py-1 text-xs font-terminal border border-border rounded hover:border-accent/50"
              >
                Save Current
              </button>
            </div>
          </div>
          <div className="text-xs font-mono text-muted-foreground space-y-1">
            <div>
              surface: {darkModeSet.surfaceOpacity.toFixed(2)}α {darkModeSet.surfaceDarken}%dk | window:{" "}
              {darkModeSet.windowOpacity.toFixed(2)}α {darkModeSet.windowDarken}%dk
            </div>
            <div>
              border: {darkModeSet.borderMode} | shadow: {darkModeSet.shadowLevel} | wallpaper:{" "}
              {darkModeSet.wallpaperOverlay > 0 ? "+" : ""}
              {darkModeSet.wallpaperOverlay}%
            </div>
          </div>
        </div>

        {/* Light mode set */}
        <div
          className={`p-4 border rounded-lg ${editingMode === "light" ? "border-accent bg-accent/10" : "border-border"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-terminal text-sm font-semibold">Light Mode Set</h3>
            <div className="flex gap-2">
              <button
                onClick={() => loadMode("light")}
                className="px-2 py-1 text-xs font-terminal border border-border rounded hover:border-accent/50"
              >
                Load
              </button>
              <button
                onClick={() => saveToMode("light")}
                className="px-2 py-1 text-xs font-terminal border border-border rounded hover:border-accent/50"
              >
                Save Current
              </button>
            </div>
          </div>
          <div className="text-xs font-mono text-muted-foreground space-y-1">
            <div>
              surface: {lightModeSet.surfaceOpacity.toFixed(2)}α {lightModeSet.surfaceDarken}%dk | window:{" "}
              {lightModeSet.windowOpacity.toFixed(2)}α {lightModeSet.windowDarken}%dk
            </div>
            <div>
              border: {lightModeSet.borderMode} | shadow: {lightModeSet.shadowLevel} | wallpaper:{" "}
              {lightModeSet.wallpaperOverlay > 0 ? "+" : ""}
              {lightModeSet.wallpaperOverlay}%
            </div>
          </div>
        </div>
      </div>

      {/* Export CSS */}
      <details className="border border-border rounded-lg">
        <summary className="px-4 py-2 cursor-pointer text-sm font-terminal text-muted-foreground hover:text-foreground">
          Export CSS (click to expand)
        </summary>
        <div className="px-4 py-3 border-t border-border">
          <pre className="text-xs font-mono bg-muted/50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
            {`:root {
  --surface-opacity: ${darkModeSet.surfaceOpacity.toFixed(2)};
  --surface-darken: ${darkModeSet.surfaceDarken}%;
  --window-darken: ${darkModeSet.windowDarken}%;
  --wallpaper-overlay: ${darkModeSet.wallpaperOverlay}%;
  /* window-bg-opacity: ${darkModeSet.windowOpacity.toFixed(2)} (in layout tokens) */
}

.light {
  --surface-opacity: ${lightModeSet.surfaceOpacity.toFixed(2)};
  --surface-darken: ${lightModeSet.surfaceDarken}%;
  --window-darken: ${lightModeSet.windowDarken}%;
  --wallpaper-overlay: ${lightModeSet.wallpaperOverlay}%;
}

/* Light mode window opacity override */
.light [data-window-container] {
  --window-bg-opacity: ${lightModeSet.windowOpacity.toFixed(2)} !important;
}

/* Wallpaper overlay (add to WallpaperBackground component) */
[data-testid="wallpaper-background"]::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: rgba(${lightModeSet.wallpaperOverlay >= 0 ? "0,0,0" : "255,255,255"}, calc(var(--wallpaper-overlay) / 100));
  z-index: 1;
}

/* Note: border "${lightModeSet.borderMode}" and shadow "${lightModeSet.shadowLevel}"
   require component updates (not pure CSS) */`}
          </pre>
          <button
            onClick={() => {
              const css = `:root {
  --surface-opacity: ${darkModeSet.surfaceOpacity.toFixed(2)};
  --surface-darken: ${darkModeSet.surfaceDarken}%;
}

.light {
  --surface-opacity: ${lightModeSet.surfaceOpacity.toFixed(2)};
  --surface-darken: ${lightModeSet.surfaceDarken}%;
}

.light [data-window-container] {
  --window-bg-opacity: ${lightModeSet.windowOpacity.toFixed(2)} !important;
}`;
              navigator.clipboard.writeText(css);
            }}
            className="mt-2 px-3 py-1 text-xs font-terminal border border-border rounded hover:border-accent/50"
          >
            Copy CSS to clipboard
          </button>
        </div>
      </details>

      {/* Control panel */}
      <div className="p-4 border border-border rounded-lg bg-muted/50 space-y-4">
        {/* Surface opacity */}
        <label className="flex items-center gap-4">
          <span className="font-terminal text-sm text-muted-foreground w-48">--surface-opacity:</span>
          <input
            type="range"
            min="0.7"
            max="1"
            step="0.02"
            value={lightOpacity}
            onChange={(e) => updateOpacity(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="font-mono text-sm w-12">{lightOpacity.toFixed(2)}</span>
        </label>

        {/* Surface darkening */}
        <label className="flex items-center gap-4">
          <span className="font-terminal text-sm text-muted-foreground w-48">--surface-darken:</span>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={lightDarken}
            onChange={(e) => updateDarken(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="font-mono text-sm w-12">{lightDarken}%</span>
        </label>

        {/* Window opacity */}
        <label className="flex items-center gap-4">
          <span className="font-terminal text-sm text-muted-foreground w-48">--window-bg-opacity:</span>
          <input
            type="range"
            min="0.4"
            max="1"
            step="0.02"
            value={windowOpacity}
            onChange={(e) => updateWindowOpacity(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="font-mono text-sm w-12">{windowOpacity.toFixed(2)}</span>
        </label>

        {/* Window darken */}
        <label className="flex items-center gap-4">
          <span className="font-terminal text-sm text-muted-foreground w-48">--window-darken:</span>
          <input
            type="range"
            min="0"
            max="15"
            step="1"
            value={windowDarken}
            onChange={(e) => updateWindowDarken(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="font-mono text-sm w-12">{windowDarken}%</span>
        </label>

        {/* Wallpaper overlay */}
        <label className="flex items-center gap-4">
          <span className="font-terminal text-sm text-muted-foreground w-48">Wallpaper overlay:</span>
          <input
            type="range"
            min="-30"
            max="50"
            step="5"
            value={wallpaperOverlay}
            onChange={(e) => updateWallpaperOverlay(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="font-mono text-sm w-12">
            {wallpaperOverlay > 0 ? `+${wallpaperOverlay}%` : wallpaperOverlay === 0 ? "0" : `${wallpaperOverlay}%`}
          </span>
        </label>
        <p className="text-xs text-muted-foreground -mt-2 ml-52">
          Positive = darken wallpaper, Negative = lighten wallpaper
        </p>

        {/* Divider */}
        <div className="border-t border-border/50 pt-4 mt-4">
          <p className="text-xs font-terminal text-muted-foreground mb-3">Visual Definition (borders & shadows)</p>
        </div>

        {/* Border mode */}
        <div className="flex items-center gap-4">
          <span className="font-terminal text-sm text-muted-foreground w-48">Border strength:</span>
          <div className="flex gap-2">
            {(["normal", "strong", "boosted"] as BorderMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setBorderMode(mode)}
                className={`px-3 py-1 text-xs font-terminal border rounded transition-colors ${
                  borderMode === mode
                    ? "border-accent bg-accent/20 text-foreground"
                    : "border-border hover:border-accent/50 text-muted-foreground"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Shadow level */}
        <div className="flex items-center gap-4">
          <span className="font-terminal text-sm text-muted-foreground w-48">Shadow level:</span>
          <div className="flex gap-2">
            {(["none", "sm", "md", "lg"] as ShadowLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setShadowLevel(level)}
                className={`px-3 py-1 text-xs font-terminal border rounded transition-colors ${
                  shadowLevel === level
                    ? "border-accent bg-accent/20 text-foreground"
                    : "border-border hover:border-accent/50 text-muted-foreground"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          <strong>Opacity:</strong> Higher = more solid (but brighter). <strong>Darken:</strong> Mix with foreground.
          <br />
          <strong>Border:</strong> Stronger = more definition. <strong>Shadow:</strong> Adds elevation depth cues.
        </p>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* OLD: Hardcoded /80 */}
        <div className="space-y-3">
          <h3 className="font-terminal text-sm text-muted-foreground">[OLD] Hardcoded /80</h3>

          {/* Simulated card like FeaturedSection */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="p-4 pb-2 bg-card/80">
              <span className="text-xs font-terminal text-foreground">[software]</span>
              <h4 className="font-semibold font-title mt-1">
                <span className="bg-accent-low px-1.5 py-0.5 text-accent-low-foreground">Project Title</span>
              </h4>
            </div>
            <div className="min-h-20 px-4 py-3 bg-background/80">
              <p className="text-sm text-muted-foreground">
                This card uses bg-card/80 and bg-background/80 - always 80% opacity regardless of mode.
              </p>
            </div>
          </div>

          {/* Another card variant */}
          <div className="border border-border-strong rounded-lg overflow-hidden">
            <div className="bg-card/80 px-4 py-3">
              <h3 className="font-title text-lg font-bold">Detail Card Header</h3>
            </div>
            <div className="bg-background/80 px-4 py-4">
              <p className="text-sm text-muted-foreground">
                Body content with bg-background/80. In light mode, opacity stacking washes this out.
              </p>
            </div>
          </div>
        </div>

        {/* NEW: Mode-aware surface tokens */}
        <div className="space-y-3">
          <h3 className="font-terminal text-sm text-muted-foreground">[NEW] Mode-aware + definition</h3>

          {/* Simulated card like FeaturedSection */}
          <div
            className={`border rounded-sm overflow-hidden ${getBorderClass(borderMode)} ${getShadowClass(shadowLevel)}`}
          >
            <div className="p-4 pb-2 bg-surface-card">
              <span className="text-xs font-terminal text-foreground">[software]</span>
              <h4 className="font-semibold font-title mt-1">
                <span className="bg-accent-low px-1.5 py-0.5 text-accent-low-foreground">Project Title</span>
              </h4>
            </div>
            <div className="min-h-20 px-4 py-3 bg-surface-background">
              <p className="text-sm text-muted-foreground">
                {lightOpacity.toFixed(2)}α, {lightDarken}%dk, {borderMode} border, {shadowLevel} shadow
              </p>
            </div>
          </div>

          {/* Another card variant */}
          <div
            className={`rounded-lg overflow-hidden border ${getBorderClass(borderMode)} ${getShadowClass(shadowLevel)}`}
          >
            <div className="bg-surface-card px-4 py-3">
              <h3 className="font-title text-lg font-bold">Detail Card Header</h3>
            </div>
            <div className="bg-surface-background px-4 py-4">
              <p className="text-sm text-muted-foreground">
                Borders and shadows add visual definition without changing colors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stacked layers visualization */}
      <div className="space-y-3">
        <h3 className="font-terminal text-sm text-muted-foreground">Layer Stack Visualization</h3>
        <p className="text-xs text-muted-foreground">
          Shows how opacity stacking creates different effects in light vs dark mode.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* OLD stack */}
          <div className="space-y-1">
            <p className="text-xs font-terminal text-muted-foreground">Old (80% always)</p>
            <div className="relative h-32 border border-border rounded overflow-hidden">
              {/* Base - wallpaper simulation */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />
              {/* Window layer */}
              <div className="absolute inset-2 bg-background/80 rounded">
                {/* Card layer */}
                <div className="absolute inset-3 bg-card/80 rounded flex items-center justify-center">
                  <span className="text-xs font-terminal">3 layers @ 80%</span>
                </div>
              </div>
            </div>
          </div>

          {/* NEW stack */}
          <div className="space-y-1">
            <p className="text-xs font-terminal text-muted-foreground">New (mode-aware)</p>
            <div className="relative h-32 border border-border rounded overflow-hidden">
              {/* Base - wallpaper simulation */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />
              {/* Window layer - still uses window opacity */}
              <div className="absolute inset-2 bg-background/80 rounded">
                {/* Card layer - uses surface opacity */}
                <div className="absolute inset-3 bg-surface-card rounded flex items-center justify-center">
                  <span className="text-xs font-terminal">
                    {lightOpacity.toFixed(2)}α + {lightDarken}%dk
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick presets */}
      <div className="space-y-2">
        <span className="text-xs font-terminal text-muted-foreground">Presets:</span>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Dark mode default", o: 0.8, d: 0, b: "normal" as BorderMode, s: "none" as ShadowLevel },
            { label: "Subtle fix", o: 0.85, d: 3, b: "normal" as BorderMode, s: "none" as ShadowLevel },
            { label: "Darken only", o: 0.8, d: 8, b: "normal" as BorderMode, s: "none" as ShadowLevel },
            { label: "Strong borders", o: 0.85, d: 5, b: "strong" as BorderMode, s: "none" as ShadowLevel },
            { label: "With shadows", o: 0.85, d: 5, b: "normal" as BorderMode, s: "md" as ShadowLevel },
            { label: "Full treatment", o: 0.9, d: 6, b: "strong" as BorderMode, s: "sm" as ShadowLevel },
            { label: "Material-ish", o: 0.95, d: 4, b: "normal" as BorderMode, s: "md" as ShadowLevel },
            { label: "Max definition", o: 0.92, d: 8, b: "boosted" as BorderMode, s: "md" as ShadowLevel },
          ].map(({ label, o, d, b, s }) => (
            <button
              key={label}
              onClick={() => {
                updateOpacity(o);
                updateDarken(d);
                setBorderMode(b);
                setShadowLevel(s);
              }}
              title={`${o}α, ${d}%dk, ${b}, ${s}`}
              className={`px-3 py-1 text-xs font-terminal border rounded transition-colors ${
                Math.abs(lightOpacity - o) < 0.01 && lightDarken === d && borderMode === b && shadowLevel === s
                  ? "border-accent bg-accent/20 text-foreground"
                  : "border-border hover:border-accent/50 text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function SandboxPage() {
  const mounted = useHasMounted();

  if (!mounted) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <PageLayout header={<DevPageHeader title="Sandbox" jumpLinks={[]} showEnvPreview={true} />}>
      <div className="space-y-8">
        <SurfaceOpacityComparison />
      </div>
    </PageLayout>
  );
}
