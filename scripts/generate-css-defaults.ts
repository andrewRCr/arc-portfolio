#!/usr/bin/env npx tsx
/**
 * Generate CSS Default Theme Values
 *
 * Reads the default theme definition and updates globals.css with the correct
 * CSS variable defaults. This prevents FOUC (flash of unstyled content) by
 * ensuring CSS defaults match the JS-applied default theme.
 *
 * Usage: npx tsx scripts/generate-css-defaults.ts
 *
 * The script updates the :root block in src/app/globals.css between the
 * AUTO-GENERATED markers.
 */

import * as fs from "fs";
import * as path from "path";
import { themes, defaultTheme } from "../src/data/themes";
import type { ThemeColors } from "../src/data/themes/types";
import { DEFAULT_LAYOUT_TOKENS } from "../src/lib/theme/tokens/layout";

const GLOBALS_CSS_PATH = path.join(__dirname, "../src/app/globals.css");

// Markers in globals.css that delimit the auto-generated section
const START_MARKER = "/* AUTO-GENERATED THEME DEFAULTS - DO NOT EDIT MANUALLY */";
const END_MARKER = "/* END AUTO-GENERATED THEME DEFAULTS */";

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
 * Generate CSS variable declarations from theme colors.
 */
function generateThemeCssVariables(themeColors: ThemeColors): string {
  const lines: string[] = [];

  // Group tokens by category for readability
  const categories: Record<string, (keyof ThemeColors)[]> = {
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

  for (const [category, tokens] of Object.entries(categories)) {
    lines.push(`  /* ${category} */`);
    for (const token of tokens) {
      const value = themeColors[token];
      if (value !== undefined) {
        lines.push(`  --${token}: ${value};`);
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
 * Update globals.css with generated theme defaults.
 */
function updateGlobalsCss(): void {
  // Get the default theme's dark mode colors (dark mode is the preferred default)
  const theme = themes[defaultTheme];
  if (!theme) {
    console.error(`Error: Default theme "${defaultTheme}" not found in theme registry`);
    process.exit(1);
  }

  const themeColors = theme.dark;
  const themeCssVariables = generateThemeCssVariables(themeColors);
  const layoutCssVariables = generateLayoutCssVariables();

  // Read current globals.css
  let css = fs.readFileSync(GLOBALS_CSS_PATH, "utf-8");

  // Check if markers exist
  const hasMarkers = css.includes(START_MARKER) && css.includes(END_MARKER);

  if (hasMarkers) {
    // Replace content between markers
    const startIndex = css.indexOf(START_MARKER);
    const endIndex = css.indexOf(END_MARKER) + END_MARKER.length;

    const before = css.slice(0, startIndex);
    const after = css.slice(endIndex);

    const generatedBlock = `${START_MARKER}
  /* Source: themes["${defaultTheme}"].dark from src/data/themes */
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

  // Write updated file
  fs.writeFileSync(GLOBALS_CSS_PATH, css, "utf-8");
  console.log(`Updated ${GLOBALS_CSS_PATH} with ${defaultTheme} theme defaults and layout tokens`);
}

// Run the script
updateGlobalsCss();
