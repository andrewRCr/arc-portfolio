#!/usr/bin/env npx tsx
/**
 * Generate CSS Theme Definitions
 *
 * Generates two sections in globals.css:
 * 1. :root defaults - fallback values from default theme's dark mode
 * 2. Theme class variants - all theme/mode combinations as CSS classes
 *
 * This eliminates FOUC by allowing a blocking script to set classes
 * (e.g., `class="remedy dark"`) before React hydrates, with CSS handling
 * the variable resolution instantly.
 *
 * Usage: npx tsx scripts/generate-css-defaults.ts
 *        npm run generate:css-defaults
 */

import * as fs from "fs";
import * as path from "path";
import { themes, defaultPalette } from "../src/data/themes";
import type { ThemeColors, ThemeOpacities, ThemeSurfaces, ThemeHoverConfig } from "../src/data/themes/types";
import { DEFAULT_LAYOUT_TOKENS } from "../src/lib/theme/tokens/layout";

const GLOBALS_CSS_PATH = path.join(__dirname, "../src/app/globals.css");

// Markers for :root defaults (inside :root block)
const START_MARKER = "/* AUTO-GENERATED THEME DEFAULTS - DO NOT EDIT MANUALLY */";
const END_MARKER = "/* END AUTO-GENERATED THEME DEFAULTS */";

// Markers for theme class variants (after :root block)
const VARIANTS_START_MARKER = "/* AUTO-GENERATED THEME VARIANTS - DO NOT EDIT MANUALLY */";
const VARIANTS_END_MARKER = "/* END AUTO-GENERATED THEME VARIANTS */";

/**
 * Layout tokens that should be exposed as CSS variables.
 * Maps token name to CSS variable name.
 */
const LAYOUT_TOKENS_TO_CSS: Record<string, string> = {
  contentPaddingY: "--content-padding-y",
  contentPaddingX: "--content-padding-x",
};

/**
 * Generate CSS variable declarations from layout tokens.
 */
function generateLayoutCssVariables(): string {
  const lines: string[] = [];
  lines.push("  /* Layout tokens */");

  for (const [tokenName, cssVar] of Object.entries(LAYOUT_TOKENS_TO_CSS)) {
    const value = DEFAULT_LAYOUT_TOKENS[tokenName as keyof typeof DEFAULT_LAYOUT_TOKENS];
    if (typeof value === "number" && Number.isFinite(value)) {
      lines.push(`  ${cssVar}: ${value}px;`);
    }
  }

  return lines.join("\n");
}

/**
 * Token categories for organizing CSS output.
 */
const TOKEN_CATEGORIES: Record<string, (keyof ThemeColors)[]> = {
  "Base colors": ["background", "foreground"],
  "Card colors": ["card", "card-foreground"],
  "Popover colors": ["popover", "popover-foreground"],
  "Primary colors": ["primary", "primary-foreground"],
  "Secondary colors": ["secondary", "secondary-foreground"],
  "Muted colors": ["muted", "muted-foreground"],
  "Accent colors": ["accent", "accent-foreground"],
  "Decorative accents": ["accent-red", "accent-orange", "accent-green", "accent-blue", "accent-purple"],
  "Destructive colors": ["destructive", "destructive-foreground"],
  "UI elements": ["border", "border-strong", "input", "ring"],
  "Shadow tokens": ["shadow-sm", "shadow-md", "shadow-lg"],
};

/**
 * Generate CSS variable declarations from theme colors.
 * @param themeColors - Theme color values
 * @param indent - Indentation string (default 2 spaces for :root)
 */
function generateThemeCssVariables(themeColors: ThemeColors, indent = "  "): string {
  const lines: string[] = [];

  for (const [category, tokens] of Object.entries(TOKEN_CATEGORIES)) {
    lines.push(`${indent}/* ${category} */`);
    for (const token of tokens) {
      const value = themeColors[token];
      if (value !== undefined) {
        lines.push(`${indent}--${token}: ${value};`);
      }
    }
    lines.push("");
  }

  // Remove trailing empty line
  if (lines[lines.length - 1] === "") {
    lines.pop();
  }

  return lines.join("\n");
}

/**
 * Map foreground token to CSS variable reference.
 */
function foregroundTokenToCss(token: string): string {
  if (token === "primary-foreground") {
    return "var(--primary-foreground)";
  }
  if (token === "foreground-lightened") {
    return "color-mix(in oklch, rgb(var(--foreground)) 90%, white 10%)";
  }
  return `var(--${token})`;
}

/**
 * Generate CSS variable declarations from theme opacity configuration.
 * @param opacities - Theme opacity configuration
 * @param mode - "light" or "dark"
 * @param indent - Indentation string
 */
function generateOpacityCssVariables(opacities: ThemeOpacities, mode: "light" | "dark", indent = "  "): string {
  const config = opacities[mode];
  const lines: string[] = [];

  lines.push(`${indent}/* Opacity configuration */`);

  // Accent opacities
  lines.push(`${indent}--accent-high-opacity: ${config.accent.high};`);
  lines.push(`${indent}--accent-mid-opacity: ${config.accent.mid};`);
  lines.push(`${indent}--accent-low-opacity: ${config.accent.low};`);

  // Accent foregrounds
  lines.push(`${indent}--accent-high-foreground: ${foregroundTokenToCss(config.accentForeground.high)};`);
  lines.push(`${indent}--accent-mid-foreground: ${foregroundTokenToCss(config.accentForeground.mid)};`);
  lines.push(`${indent}--accent-low-foreground: ${foregroundTokenToCss(config.accentForeground.low)};`);

  // Secondary opacities
  lines.push(`${indent}--secondary-high-opacity: ${config.secondary.high};`);
  lines.push(`${indent}--secondary-mid-opacity: ${config.secondary.mid};`);
  lines.push(`${indent}--secondary-low-opacity: ${config.secondary.low};`);

  // Accent decorative opacity
  lines.push(`${indent}--accent-decorative-opacity: ${config.accentDecorativeOpacity};`);

  // Accent decorative token/foreground overrides (mode-independent, but emitted per class)
  if (opacities.accentDecorative?.token) {
    lines.push(`${indent}--accent-decorative: var(--${opacities.accentDecorative.token});`);
  }
  if (opacities.accentDecorative?.foreground) {
    lines.push(
      `${indent}--accent-decorative-foreground: ${foregroundTokenToCss(opacities.accentDecorative.foreground)};`
    );
  }

  return lines.join("\n");
}

/**
 * Generate CSS variable declarations from theme surface configuration.
 * @param surfaces - Theme surface configuration
 * @param mode - "light" or "dark"
 * @param indent - Indentation string
 */
function generateSurfaceCssVariables(surfaces: ThemeSurfaces, mode: "light" | "dark", indent = "  "): string {
  const config = surfaces[mode];
  const lines: string[] = [];

  lines.push(`${indent}/* Surface configuration */`);
  lines.push(`${indent}--surface-opacity: ${config.surfaceOpacity};`);
  lines.push(`${indent}--surface-darken: ${config.surfaceDarken}%;`);
  lines.push(`${indent}--window-bg-opacity: ${config.windowOpacity};`);
  lines.push(`${indent}--window-darken: ${config.windowDarken}%;`);

  // Surface hierarchy determines which tokens to use for card/background bases
  if (config.surfaceHierarchy === "swapped") {
    lines.push(`${indent}--surface-card-base: var(--background);`);
    lines.push(`${indent}--surface-background-base: var(--card);`);
  } else {
    lines.push(`${indent}--surface-card-base: var(--card);`);
    lines.push(`${indent}--surface-background-base: var(--background);`);
  }

  return lines.join("\n");
}

/**
 * Generate CSS variable declarations from theme hover configuration.
 *
 * Supports two approaches:
 * 1. Color swap: Hover swaps to secondary color (when hoverColor is set)
 * 2. Darkening: Hover darkens the original color (fallback)
 *    - Dark mode: Opacity-based (85% for primary, accent-low for accent-mid)
 *    - Light mode: Color-mix with foreground
 *
 * @param hover - Theme hover configuration
 * @param mode - "light" or "dark"
 * @param indent - Indentation string
 */
function generateHoverCssVariables(hover: ThemeHoverConfig, mode: "light" | "dark", indent = "  "): string {
  const config = hover[mode];
  const lines: string[] = [];

  lines.push(`${indent}/* Hover configuration */`);

  // === Primary hover ===
  if (config.primaryHoverColor) {
    // Color swap approach
    const hoverColor = config.primaryHoverColor;
    if (hoverColor === "secondary") {
      lines.push(`${indent}--primary-hover-value: rgb(var(--secondary));`);
    } else if (hoverColor === "secondary-high") {
      lines.push(`${indent}--primary-hover-value: rgb(var(--secondary) / var(--secondary-high-opacity));`);
    } else if (hoverColor === "accent-decorative") {
      lines.push(`${indent}--primary-hover-value: rgb(var(--accent-decorative, var(--primary)));`);
    } else if (hoverColor === "accent-decorative-high") {
      lines.push(`${indent}--primary-hover-value: rgb(var(--accent-decorative, var(--primary)) / 0.8);`);
    }
    // Foreground: use override if specified, else infer from hover color
    let defaultFg = "var(--secondary-foreground)";
    if (hoverColor === "accent-decorative" || hoverColor === "accent-decorative-high") {
      defaultFg = "var(--accent-decorative-foreground, var(--primary-foreground))";
    }
    const primaryFg = config.primaryHoverForeground ? foregroundTokenToCss(config.primaryHoverForeground) : defaultFg;
    lines.push(`${indent}--primary-hover-foreground-value: ${primaryFg};`);
  } else if (mode === "dark") {
    // Dark mode darkening: opacity-based
    lines.push(`${indent}--primary-hover-value: rgb(var(--primary) / 0.85);`);
    const primaryFg = config.primaryHoverForeground
      ? foregroundTokenToCss(config.primaryHoverForeground)
      : "var(--primary-foreground)";
    lines.push(`${indent}--primary-hover-foreground-value: ${primaryFg};`);
  } else {
    // Light mode darkening: color-mix
    const primaryDarken = config.primaryDarken;
    lines.push(
      `${indent}--primary-hover-value: color-mix(in oklch, rgb(var(--primary)) ${100 - primaryDarken}%, rgb(var(--foreground)) ${primaryDarken}%);`
    );
    const primaryFg = config.primaryHoverForeground
      ? foregroundTokenToCss(config.primaryHoverForeground)
      : "var(--primary-foreground)";
    lines.push(`${indent}--primary-hover-foreground-value: ${primaryFg};`);
  }

  // === Accent-mid hover ===
  if (config.accentMidHoverColor) {
    // Color swap approach
    const hoverColor = config.accentMidHoverColor;
    if (hoverColor === "secondary") {
      lines.push(`${indent}--accent-mid-hover-value: rgb(var(--secondary));`);
    } else if (hoverColor === "secondary-high") {
      lines.push(`${indent}--accent-mid-hover-value: rgb(var(--secondary) / var(--secondary-high-opacity));`);
    } else if (hoverColor === "accent-decorative") {
      lines.push(`${indent}--accent-mid-hover-value: rgb(var(--accent-decorative, var(--accent)));`);
    } else if (hoverColor === "accent-decorative-high") {
      lines.push(`${indent}--accent-mid-hover-value: rgb(var(--accent-decorative, var(--accent)) / 0.8);`);
    }
    // Foreground: use override if specified, else infer from hover color
    let defaultFg = "var(--secondary-foreground)";
    if (hoverColor === "accent-decorative" || hoverColor === "accent-decorative-high") {
      defaultFg = "var(--accent-decorative-foreground, var(--accent-foreground))";
    }
    const accentFg = config.accentMidHoverForeground
      ? foregroundTokenToCss(config.accentMidHoverForeground)
      : defaultFg;
    lines.push(`${indent}--accent-mid-hover-foreground-value: ${accentFg};`);
  } else if (mode === "dark") {
    // Dark mode darkening: opacity-based (accent-low)
    lines.push(`${indent}--accent-mid-hover-value: rgb(var(--accent) / var(--accent-low-opacity));`);
    const accentFg = config.accentMidHoverForeground
      ? foregroundTokenToCss(config.accentMidHoverForeground)
      : "var(--accent-low-foreground)";
    lines.push(`${indent}--accent-mid-hover-foreground-value: ${accentFg};`);
  } else {
    // Light mode darkening: color-mix
    const accentDarken = config.accentMidDarken;
    lines.push(
      `${indent}--accent-mid-hover-value: color-mix(in oklch, rgb(var(--accent) / var(--accent-mid-opacity)) ${100 - accentDarken}%, rgb(var(--foreground)) ${accentDarken}%);`
    );
    const accentFg = config.accentMidHoverForeground
      ? foregroundTokenToCss(config.accentMidHoverForeground)
      : "var(--accent-mid-foreground)";
    lines.push(`${indent}--accent-mid-hover-foreground-value: ${accentFg};`);
  }

  return lines.join("\n");
}

/**
 * Generate all theme class variants.
 * Creates .{themeName}.dark and .{themeName}.light for each theme.
 * Includes color tokens, opacity configuration, and surface configuration.
 */
function generateThemeVariants(): string {
  const blocks: string[] = [];

  for (const [themeName, theme] of Object.entries(themes)) {
    // Dark mode variant
    const darkColorVars = generateThemeCssVariables(theme.dark, "  ");
    let darkBlock = `.${themeName}.dark {\n${darkColorVars}`;

    // Add opacity config if present
    if (theme.opacities) {
      darkBlock += `\n\n${generateOpacityCssVariables(theme.opacities, "dark", "  ")}`;
    }

    // Add surface config if present
    if (theme.surfaces) {
      darkBlock += `\n\n${generateSurfaceCssVariables(theme.surfaces, "dark", "  ")}`;
    }

    // Add hover config if present
    if (theme.hover) {
      darkBlock += `\n\n${generateHoverCssVariables(theme.hover, "dark", "  ")}`;
    }

    darkBlock += "\n}";
    blocks.push(darkBlock);

    // Light mode variant
    const lightColorVars = generateThemeCssVariables(theme.light, "  ");
    let lightBlock = `.${themeName}.light {\n${lightColorVars}`;

    // Add opacity config if present
    if (theme.opacities) {
      lightBlock += `\n\n${generateOpacityCssVariables(theme.opacities, "light", "  ")}`;
    }

    // Add surface config if present
    if (theme.surfaces) {
      lightBlock += `\n\n${generateSurfaceCssVariables(theme.surfaces, "light", "  ")}`;
    }

    // Add hover config if present
    if (theme.hover) {
      lightBlock += `\n\n${generateHoverCssVariables(theme.hover, "light", "  ")}`;
    }

    lightBlock += "\n}";
    blocks.push(lightBlock);
  }

  return blocks.join("\n\n");
}

/**
 * Update globals.css with generated theme defaults and variants.
 */
function updateGlobalsCss(): void {
  // Get the default palette's dark mode colors (dark mode is the preferred default)
  const theme = themes[defaultPalette];
  if (!theme) {
    console.error(`Error: Default palette "${defaultPalette}" not found in theme registry`);
    process.exit(1);
  }

  const themeColors = theme.dark;
  const themeCssVariables = generateThemeCssVariables(themeColors);
  const layoutCssVariables = generateLayoutCssVariables();
  const themeVariants = generateThemeVariants();

  // Read current globals.css
  let css = fs.readFileSync(GLOBALS_CSS_PATH, "utf-8");

  // === Update :root defaults ===
  const hasDefaultMarkers = css.includes(START_MARKER) && css.includes(END_MARKER);

  if (hasDefaultMarkers) {
    const startIndex = css.indexOf(START_MARKER);
    const endIndex = css.indexOf(END_MARKER) + END_MARKER.length;

    const before = css.slice(0, startIndex);
    const after = css.slice(endIndex);

    const generatedBlock = `${START_MARKER}
  /* Source: themes["${defaultPalette}"].dark from src/data/themes */
${themeCssVariables}

${layoutCssVariables}
  ${END_MARKER}`;

    css = before + generatedBlock + after;
  } else {
    console.error("Error: Could not find AUTO-GENERATED markers in globals.css");
    console.error("Please add the following markers to :root in globals.css:");
    console.error(`  ${START_MARKER}`);
    console.error(`  ${END_MARKER}`);
    process.exit(1);
  }

  // === Update theme variants ===
  const hasVariantMarkers = css.includes(VARIANTS_START_MARKER) && css.includes(VARIANTS_END_MARKER);
  const themeCount = Object.keys(themes).length;
  const variantBlock = `${VARIANTS_START_MARKER}
/* Generated: ${themeCount} themes × 2 modes = ${themeCount * 2} class variants */

${themeVariants}

${VARIANTS_END_MARKER}`;

  if (hasVariantMarkers) {
    // Replace existing variants section
    const startIndex = css.indexOf(VARIANTS_START_MARKER);
    const endIndex = css.indexOf(VARIANTS_END_MARKER) + VARIANTS_END_MARKER.length;

    const before = css.slice(0, startIndex);
    const after = css.slice(endIndex);

    css = before + variantBlock + after;
  } else {
    // Insert variants section after :root block (before @layer base)
    const layerBaseIndex = css.indexOf("@layer base");
    if (layerBaseIndex !== -1) {
      const before = css.slice(0, layerBaseIndex);
      const after = css.slice(layerBaseIndex);
      css = before + variantBlock + "\n\n" + after;
    } else {
      // Fallback: append to end
      css = css + "\n\n" + variantBlock;
    }
  }

  // Write updated file
  fs.writeFileSync(GLOBALS_CSS_PATH, css, "utf-8");
  console.log(`Updated ${GLOBALS_CSS_PATH}:`);
  console.log(`  - :root defaults from "${defaultPalette}" palette (dark mode)`);
  console.log(`  - ${themeCount * 2} theme class variants (${themeCount} themes × 2 modes)`);
}

// Run the script
updateGlobalsCss();
