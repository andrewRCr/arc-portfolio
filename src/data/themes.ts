/**
 * Theme Definitions
 *
 * Multi-theme support using CSS variable injection.
 * Each theme defines light and dark color palettes.
 *
 * Color format: RGB space-separated values (e.g., "249 245 229")
 * This format works with Tailwind's opacity modifiers (bg-primary/50)
 *
 * Future: Add more themes (rose-pine, catppuccin, nord, dracula, etc.)
 */

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
}

export interface Theme {
  name: string;
  label: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export const themes: Record<string, Theme> = {
  gruvbox: {
    name: "gruvbox",
    label: "Gruvbox",
    light: {
      background: "251 241 199", // #fbf1c7
      foreground: "60 56 54", // #3c3836
      card: "249 245 215", // #f9f5d7
      "card-foreground": "60 56 54",
      popover: "249 245 215",
      "popover-foreground": "60 56 54",
      primary: "121 116 14", // #79740e - green
      "primary-foreground": "251 241 199",
      secondary: "175 58 3", // #af3a03 - orange
      "secondary-foreground": "251 241 199",
      muted: "235 219 178", // #ebdbb2
      "muted-foreground": "102 92 84", // #665c54
      accent: "104 157 106", // #689d6a - aqua
      "accent-foreground": "60 56 54",
      destructive: "157 0 6", // #9d0006 - red
      border: "213 196 161", // #d5c4a1
      input: "213 196 161",
      ring: "121 116 14",
    },
    dark: {
      background: "40 40 40", // #282828
      foreground: "235 219 178", // #ebdbb2
      card: "50 48 47", // #32302f
      "card-foreground": "235 219 178",
      popover: "50 48 47",
      "popover-foreground": "235 219 178",
      primary: "184 187 38", // #b8bb26 - green
      "primary-foreground": "40 40 40",
      secondary: "250 189 47", // #fabd2f - yellow
      "secondary-foreground": "40 40 40",
      muted: "60 56 54", // #3c3836
      "muted-foreground": "168 153 132", // #a89984
      accent: "142 192 124", // #8ec07c - aqua
      "accent-foreground": "40 40 40",
      destructive: "251 73 52", // #fb4934 - red
      border: "80 73 69", // #504945
      input: "80 73 69",
      ring: "184 187 38",
    },
  },
  // Future themes can be added here:
  // 'rose-pine': { ... },
  // 'catppuccin': { ... },
  // 'nord': { ... },
  // etc.
};

export const defaultTheme = "gruvbox";
