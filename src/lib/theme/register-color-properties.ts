/**
 * Registers --color-* CSS custom properties with `syntax: '<color>'`
 * so browsers (notably Safari) can interpolate them during transitions.
 *
 * Without registration, custom properties are "discrete" by spec and
 * snap instead of transitioning smoothly.
 */

let registered = false;

const COLOR_PROPERTIES = [
  // Base
  "--color-background",
  "--color-foreground",

  // Card / Popover
  "--color-card",
  "--color-card-foreground",
  "--color-popover",
  "--color-popover-foreground",

  // Surface
  "--color-surface-card",
  "--color-surface-background",
  "--color-surface-muted",
  "--color-surface-popover",

  // Primary / Secondary / Muted
  "--color-primary",
  "--color-primary-foreground",
  "--color-primary-hover",
  "--color-primary-hover-foreground",
  "--color-secondary",
  "--color-secondary-foreground",
  "--color-muted",
  "--color-muted-foreground",

  // Accent
  "--color-accent",
  "--color-accent-foreground",
  "--color-accent-high",
  "--color-accent-mid",
  "--color-accent-low",
  "--color-accent-high-foreground",
  "--color-accent-mid-foreground",
  "--color-accent-low-foreground",
  "--color-accent-mid-hover",
  "--color-accent-mid-hover-foreground",

  // Secondary opacity variants
  "--color-secondary-high",
  "--color-secondary-mid",
  "--color-secondary-low",

  // Decorative
  "--color-accent-decorative",
  "--color-accent-decorative-foreground",
  "--color-accent-red",
  "--color-accent-orange",
  "--color-accent-green",
  "--color-accent-blue",
  "--color-accent-purple",

  // Destructive
  "--color-destructive",
  "--color-destructive-foreground",

  // Borders
  "--color-border",
  "--color-border-strong",
  "--color-input",
  "--color-ring",

  // Sidebar
  "--color-sidebar",
  "--color-sidebar-foreground",
  "--color-sidebar-primary",
  "--color-sidebar-primary-foreground",
  "--color-sidebar-accent",
  "--color-sidebar-accent-foreground",
  "--color-sidebar-border",
  "--color-sidebar-ring",

  // Chart
  "--color-chart-1",
  "--color-chart-2",
  "--color-chart-3",
  "--color-chart-4",
  "--color-chart-5",
] as const;

export function registerThemeColorProperties(): void {
  if (registered) return;
  if (typeof CSS === "undefined" || !CSS.registerProperty) return;

  for (const name of COLOR_PROPERTIES) {
    try {
      CSS.registerProperty({
        name,
        syntax: "<color>",
        inherits: true,
        initialValue: "transparent",
      });
    } catch {
      // Already registered or unsupported — safe to ignore
    }
  }

  registered = true;
}
