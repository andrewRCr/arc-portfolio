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
import type {
  ForegroundToken,
  ThemeColors,
  ThemeOpacities,
  ThemeSurfaces,
  ThemeHoverConfig,
} from "../src/data/themes/types";
import { DEFAULT_LAYOUT_TOKENS } from "../src/lib/theme/tokens/layout";

const GLOBALS_CSS_PATH = path.join(__dirname, "../src/app/globals.css");
const VARIANTS_CSS_PATH = path.join(__dirname, "../src/app/theme-variants.generated.css");

// Markers for :root defaults (inside :root block)
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
function foregroundTokenToCss(
  token: ForegroundToken | "primary-foreground" | "secondary-foreground" | "foreground-lightened"
): string {
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

  // Surface border and shadow treatment
  lines.push(
    `${indent}--surface-border-color: ${config.surfaceBorderStrong ? "var(--color-border-strong)" : "var(--color-border)"};`
  );
  lines.push(
    `${indent}--surface-shadow: ${config.surfaceShadow === "none" ? "none" : `var(--shadow-${config.surfaceShadow})`};`
  );

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
 * Default opacity values matching the CSS @theme block fallbacks.
 * Used when a theme doesn't provide an opacities config.
 */
const DEFAULT_ACCENT_OPACITIES = { high: 0.8, mid: 0.5, low: 0.2 };
const DEFAULT_SECONDARY_OPACITIES = { high: 0.8, mid: 0.4, low: 0.2 };
const DEFAULT_ACCENT_DECORATIVE_OPACITY = 0.9;

/**
 * Tokens that get a direct `rgb(R G B)` wrap — no opacity.
 * These map 1:1 from ThemeColors keys to --color-* CSS custom properties.
 */
const DIRECT_RGB_TOKENS: (keyof ThemeColors)[] = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "accent-red",
  "accent-orange",
  "accent-green",
  "accent-blue",
  "accent-purple",
  "destructive",
  "destructive-foreground",
  "border",
  "border-strong",
  "input",
  "ring",
];

/**
 * Resolve a ForegroundToken to an RGB string from the theme's colors.
 * Maps token names to their ThemeColors values.
 */
function resolveForegroundToken(token: ForegroundToken | "primary-foreground", colors: ThemeColors): string {
  switch (token) {
    case "foreground":
      return colors.foreground;
    case "background":
      return colors.background;
    case "accent-foreground":
      return colors["accent-foreground"];
    case "primary-foreground":
      return colors["primary-foreground"];
    default: {
      const _exhaustive: never = token;
      throw new Error(`Unknown foreground token: ${_exhaustive}`);
    }
  }
}

/**
 * Generate resolved --color-* CSS variable declarations with direct RGB values.
 *
 * Safari cannot interpolate registered custom properties whose values change
 * via inner var() dependencies. By emitting resolved values (e.g.,
 * `--color-foreground: rgb(245 216 153)` instead of `rgb(var(--foreground))`),
 * Safari sees direct color-to-color changes on registered properties and can
 * smoothly interpolate during theme transitions.
 *
 * @param colors - Theme color values for this mode
 * @param opacities - Theme opacity configuration (optional)
 * @param mode - "light" or "dark"
 * @param indent - Indentation string
 */
function generateResolvedColorVariables(
  colors: ThemeColors,
  opacities: ThemeOpacities | undefined,
  mode: "light" | "dark",
  indent: string
): string {
  const lines: string[] = [];
  lines.push(`${indent}/* Resolved color values for Safari transition interpolation */`);

  // === Direct RGB tokens (25 tokens) ===
  for (const token of DIRECT_RGB_TOKENS) {
    lines.push(`${indent}--color-${token}: rgb(${colors[token]});`);
  }

  // === Opacity variant tokens (7 tokens) ===
  const modeConfig = opacities?.[mode];
  const accentOp = modeConfig?.accent ?? DEFAULT_ACCENT_OPACITIES;
  const secondaryOp = modeConfig?.secondary ?? DEFAULT_SECONDARY_OPACITIES;
  const accentDecorativeOp = modeConfig?.accentDecorativeOpacity ?? DEFAULT_ACCENT_DECORATIVE_OPACITY;

  lines.push(`${indent}--color-accent-high: rgb(${colors.accent} / ${accentOp.high});`);
  lines.push(`${indent}--color-accent-mid: rgb(${colors.accent} / ${accentOp.mid});`);
  lines.push(`${indent}--color-accent-low: rgb(${colors.accent} / ${accentOp.low});`);
  lines.push(`${indent}--color-secondary-high: rgb(${colors.secondary} / ${secondaryOp.high});`);
  lines.push(`${indent}--color-secondary-mid: rgb(${colors.secondary} / ${secondaryOp.mid});`);
  lines.push(`${indent}--color-secondary-low: rgb(${colors.secondary} / ${secondaryOp.low});`);

  // Accent decorative: resolve base color token
  const decorativeBaseToken = opacities?.accentDecorative?.token;
  const decorativeBase = decorativeBaseToken ? colors[decorativeBaseToken] : colors.primary;
  lines.push(`${indent}--color-accent-decorative: rgb(${decorativeBase} / ${accentDecorativeOp});`);

  // === Foreground resolution tokens (4 tokens) ===
  const fgMapping = modeConfig?.accentForeground;
  const highFg = fgMapping?.high ?? "accent-foreground";
  const midFg = fgMapping?.mid ?? "foreground";
  const lowFg = fgMapping?.low ?? "foreground";

  lines.push(`${indent}--color-accent-high-foreground: rgb(${resolveForegroundToken(highFg, colors)});`);
  lines.push(`${indent}--color-accent-mid-foreground: rgb(${resolveForegroundToken(midFg, colors)});`);
  lines.push(`${indent}--color-accent-low-foreground: rgb(${resolveForegroundToken(lowFg, colors)});`);

  // Accent decorative foreground: resolve token
  const decorativeFgToken = opacities?.accentDecorative?.foreground ?? "primary-foreground";
  lines.push(
    `${indent}--color-accent-decorative-foreground: rgb(${resolveForegroundToken(decorativeFgToken, colors)});`
  );

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

    // Add resolved --color-* values for Safari transition interpolation
    darkBlock += `\n\n${generateResolvedColorVariables(theme.dark, theme.opacities, "dark", "  ")}`;

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

    // Add resolved --color-* values for Safari transition interpolation
    lightBlock += `\n\n${generateResolvedColorVariables(theme.light, theme.opacities, "light", "  ")}`;

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

  // Write updated globals.css (:root defaults only)
  fs.writeFileSync(GLOBALS_CSS_PATH, css, "utf-8");

  // === Write theme variants to separate file ===
  const themeCount = Object.keys(themes).length;
  const variantFile = `/* AUTO-GENERATED — DO NOT EDIT MANUALLY
 * Source: scripts/generate-css-defaults.ts
 * ${themeCount} themes × 2 modes = ${themeCount * 2} class variants
 *
 * Each variant sets inner CSS variables (--background, --foreground, etc.)
 * plus resolved --color-* values for Safari transition interpolation.
 * See the @theme block in globals.css for why both layers exist.
 */

${themeVariants}
`;

  fs.writeFileSync(VARIANTS_CSS_PATH, variantFile, "utf-8");

  console.log(`Updated ${GLOBALS_CSS_PATH}:`);
  console.log(`  - :root defaults from "${defaultPalette}" palette (dark mode)`);
  console.log(`Updated ${VARIANTS_CSS_PATH}:`);
  console.log(`  - ${themeCount * 2} theme class variants (${themeCount} themes × 2 modes)`);
}

// Run the script
updateGlobalsCss();
