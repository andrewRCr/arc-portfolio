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
import type { ThemeColors } from "../src/data/themes/types";
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
    if (value !== undefined) {
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
 * Generate all theme class variants.
 * Creates .{themeName}.dark and .{themeName}.light for each theme.
 */
function generateThemeVariants(): string {
  const blocks: string[] = [];

  for (const [themeName, theme] of Object.entries(themes)) {
    // Dark mode variant
    const darkVars = generateThemeCssVariables(theme.dark, "  ");
    blocks.push(`.${themeName}.dark {\n${darkVars}\n}`);

    // Light mode variant
    const lightVars = generateThemeCssVariables(theme.light, "  ");
    blocks.push(`.${themeName}.light {\n${lightVars}\n}`);
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
