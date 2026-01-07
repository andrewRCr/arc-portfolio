"use client";

/**
 * DEV ONLY: Swatch Prototype Component
 *
 * Prototype for evaluating color swatch arrangements across themes.
 * Shows all three themes in both light/dark modes side-by-side.
 *
 * DELETE THIS FILE after design decisions are finalized.
 */

import { gruvboxPalette, gruvboxA11y } from "@/data/themes/palettes/gruvbox";
import { remedyAccents, remedyBright, remedyDark, remedyA11y } from "@/data/themes/palettes/remedy";
import { rosePineMain, rosePineDawn, rosePineA11y } from "@/data/themes/palettes/rose-pine";

// =============================================================================
// APPROACH A: ANSI Order (terminal-authentic)
// =============================================================================
// Order: Black(bg), Red, Green, Yellow, Blue, Magenta, Cyan, White(fg)

const remedyDarkAnsi = [
  remedyDark.base,
  remedyAccents.bright.red,
  remedyAccents.bright.green,
  remedyAccents.bright.yellow,
  remedyAccents.bright.blue,
  remedyAccents.bright.magenta,
  remedyAccents.bright.cyan,
  remedyDark.foreground,
];

const remedyLightAnsi = [
  remedyBright.base,
  remedyAccents.normal.red,
  remedyAccents.normal.green,
  remedyAccents.normal.yellow,
  remedyAccents.normal.blue,
  remedyAccents.normal.magenta,
  remedyAccents.normal.cyan,
  remedyBright.foreground,
];

const gruvboxDarkAnsi = [
  gruvboxPalette.dark0,
  gruvboxPalette.bright_red,
  gruvboxPalette.bright_green,
  gruvboxPalette.bright_yellow,
  gruvboxPalette.bright_blue,
  gruvboxPalette.bright_purple,
  gruvboxPalette.bright_aqua,
  gruvboxPalette.light1,
];

const gruvboxLightAnsi = [
  gruvboxPalette.light0,
  gruvboxPalette.faded_red,
  gruvboxPalette.faded_green,
  gruvboxPalette.faded_yellow,
  gruvboxPalette.faded_blue,
  gruvboxPalette.faded_purple,
  gruvboxPalette.faded_aqua,
  gruvboxPalette.dark1,
];

const rosePineDarkAnsi = [
  rosePineMain.base,
  rosePineMain.love,
  rosePineMain.leaf,
  rosePineMain.gold,
  rosePineMain.pine,
  rosePineMain.iris,
  rosePineMain.foam,
  rosePineMain.text,
];

const rosePineLightAnsi = [
  rosePineDawn.base,
  rosePineDawn.love,
  rosePineDawn.leaf,
  rosePineDawn.gold,
  rosePineDawn.pine,
  rosePineDawn.iris,
  rosePineDawn.foam,
  rosePineDawn.text,
];

// =============================================================================
// APPROACH B: Weighted (semantic tokens - shows UI-dominant colors)
// =============================================================================
// Order: Muted, Primary, Secondary, Accent, Red, Blue, Purple, Foreground
// Uses actual theme definition values (with A11y adjustments)

const remedyDarkWeighted = [
  remedyDark.baseCode, // muted bg
  remedyA11y.orange_light, // primary (orange, a11y adjusted)
  remedyAccents.bright.yellow, // secondary
  remedyAccents.bright.cyan, // accent
  remedyAccents.bright.red, // accent-red
  remedyAccents.bright.blue, // accent-blue
  remedyAccents.bright.magenta, // accent-purple
  remedyDark.foreground, // foreground
];

const remedyLightWeighted = [
  remedyBright.baseCode, // muted bg
  remedyAccents.normal.orange, // primary
  remedyAccents.normal.yellow, // secondary
  remedyA11y.cyan_light, // accent (a11y adjusted)
  remedyAccents.normal.red, // accent-red
  remedyAccents.normal.blue, // accent-blue
  remedyAccents.normal.magenta, // accent-purple
  remedyBright.foreground, // foreground
];

const gruvboxDarkWeighted = [
  gruvboxPalette.dark1, // muted bg
  gruvboxPalette.bright_green, // primary
  gruvboxPalette.bright_yellow, // secondary
  gruvboxPalette.bright_aqua, // accent
  gruvboxPalette.bright_red, // accent-red
  gruvboxPalette.bright_blue, // accent-blue
  gruvboxPalette.bright_purple, // accent-purple
  gruvboxPalette.light1, // foreground
];

const gruvboxLightWeighted = [
  gruvboxPalette.light1, // muted bg
  gruvboxA11y.faded_green_dark, // primary (a11y adjusted)
  gruvboxPalette.faded_orange, // secondary
  gruvboxPalette.neutral_aqua, // accent
  gruvboxPalette.faded_red, // accent-red
  gruvboxPalette.faded_blue, // accent-blue
  gruvboxPalette.faded_purple, // accent-purple
  gruvboxPalette.dark1, // foreground
];

const rosePineDarkWeighted = [
  rosePineMain.highlight_med, // muted bg
  rosePineA11y.pine_light, // primary (pine, a11y adjusted)
  rosePineMain.foam, // secondary
  rosePineMain.rose, // accent
  rosePineMain.love, // accent-red
  rosePineMain.pine, // accent-blue (note: same as primary base, but shown for consistency)
  rosePineMain.iris, // accent-purple
  rosePineMain.text, // foreground
];

const rosePineLightWeighted = [
  rosePineDawn.highlight_med, // muted bg
  rosePineDawn.pine, // primary
  rosePineA11y.foam_dark, // secondary (a11y adjusted)
  rosePineA11y.rose_dark, // accent (a11y adjusted)
  rosePineDawn.love, // accent-red
  rosePineDawn.pine, // accent-blue (note: same as primary)
  rosePineDawn.iris, // accent-purple
  rosePineDawn.text, // foreground
];

// =============================================================================
// APPROACH D: Deduplicated Weighted (semantic but no redundancy)
// =============================================================================
// Order: Muted, Primary, Secondary, Accent, then 3 colors NOT used by P/S/A
// Each theme picks different "other" colors to avoid duplicates

// Remedy: P=orange, S=yellow, A=cyan → others: red, green, purple (not blue - too close to cyan)
const remedyDarkDedup = [
  remedyDark.baseCode, // muted
  remedyA11y.orange_light, // primary
  remedyAccents.bright.yellow, // secondary
  remedyAccents.bright.cyan, // accent
  remedyAccents.bright.red, // other-1: red
  remedyAccents.bright.green, // other-2: green (instead of blue)
  remedyAccents.bright.magenta, // other-3: purple
  remedyDark.foreground, // foreground
];

const remedyLightDedup = [
  remedyBright.baseCode,
  remedyAccents.normal.orange,
  remedyAccents.normal.yellow,
  remedyA11y.cyan_light,
  remedyAccents.normal.red,
  remedyAccents.normal.green, // green instead of blue
  remedyAccents.normal.magenta,
  remedyBright.foreground,
];

// Gruvbox: P=green, S=orange/yellow, A=aqua → others: red, blue, purple
const gruvboxDarkDedup = [
  gruvboxPalette.dark1, // muted
  gruvboxPalette.bright_green, // primary
  gruvboxPalette.bright_yellow, // secondary
  gruvboxPalette.bright_aqua, // accent
  gruvboxPalette.bright_red, // other-1: red
  gruvboxPalette.bright_blue, // other-2: blue
  gruvboxPalette.bright_purple, // other-3: purple
  gruvboxPalette.light1, // foreground
];

const gruvboxLightDedup = [
  gruvboxPalette.light1,
  gruvboxA11y.faded_green_dark,
  gruvboxPalette.faded_orange,
  gruvboxPalette.neutral_aqua,
  gruvboxPalette.faded_red,
  gruvboxPalette.faded_blue,
  gruvboxPalette.faded_purple,
  gruvboxPalette.dark1,
];

// Rose Pine: P=pine, S=foam, A=rose → others: love(red), gold(orange), iris(purple)
const rosePineDarkDedup = [
  rosePineMain.highlight_med, // muted
  rosePineA11y.pine_light, // primary
  rosePineMain.foam, // secondary
  rosePineMain.rose, // accent
  rosePineMain.love, // other-1: red
  rosePineMain.gold, // other-2: orange (instead of duplicate pine)
  rosePineMain.iris, // other-3: purple
  rosePineMain.text, // foreground
];

const rosePineLightDedup = [
  rosePineDawn.highlight_med,
  rosePineDawn.pine,
  rosePineA11y.foam_dark,
  rosePineA11y.rose_dark,
  rosePineDawn.love,
  rosePineDawn.gold, // orange instead of duplicate pine
  rosePineDawn.iris,
  rosePineDawn.text,
];

// Legacy exports for backward compatibility (point to ANSI approach)
const remedyDarkSwatch = remedyDarkAnsi;
const remedyLightSwatch = remedyLightAnsi;
const gruvboxDarkSwatch = gruvboxDarkAnsi;
const gruvboxLightSwatch = gruvboxLightAnsi;
const rosePineDarkSwatch = rosePineDarkAnsi;
const rosePineLightSwatch = rosePineLightAnsi;

interface SwatchRowProps {
  colors: string[];
  label: string;
  size?: number;
}

function SwatchRow({ colors, label, size = 24 }: SwatchRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-32 text-sm font-mono">{label}</span>
      <div className="flex">
        {colors.map((color, i) => (
          <div
            key={i}
            style={{
              backgroundColor: color,
              width: size,
              height: size,
            }}
            title={`${i}: ${color}`}
          />
        ))}
      </div>
    </div>
  );
}

interface ThemeSwatchBlockProps {
  name: string;
  darkSwatch: string[];
  lightSwatch: string[];
  size?: number;
}

function ThemeSwatchBlock({ name, darkSwatch, lightSwatch, size = 24 }: ThemeSwatchBlockProps) {
  return (
    <div className="space-y-2 p-4 border border-border rounded">
      <h3 className="font-bold text-lg">{name}</h3>
      <SwatchRow colors={darkSwatch} label="Dark mode" size={size} />
      <SwatchRow colors={lightSwatch} label="Light mode" size={size} />
    </div>
  );
}

export function SwatchPrototype() {
  return (
    <div className="space-y-8">
      {/* ===== APPROACH A: ANSI Order ===== */}
      <div id="standard" className="space-y-4 scroll-mt-4">
        <h2 className="text-xl font-semibold">Approach A: ANSI Order (24px)</h2>
        <p className="text-sm text-muted-foreground">
          Order: Bg, Red, Green, Yellow, Blue, Magenta, Cyan, Fg
          <br />
          <span className="text-destructive">Issue: Remedy&apos;s orange primary not shown</span>
        </p>
        <ThemeSwatchBlock
          name="Remedy"
          darkSwatch={remedyDarkAnsi}
          lightSwatch={remedyLightAnsi}
        />
        <ThemeSwatchBlock
          name="Gruvbox"
          darkSwatch={gruvboxDarkAnsi}
          lightSwatch={gruvboxLightAnsi}
        />
        <ThemeSwatchBlock
          name="Rose Pine"
          darkSwatch={rosePineDarkAnsi}
          lightSwatch={rosePineLightAnsi}
        />
      </div>

      {/* ===== APPROACH B: Weighted (Semantic) ===== */}
      <div id="larger" className="space-y-4 scroll-mt-4">
        <h2 className="text-xl font-semibold">Approach B: Weighted/Semantic (24px)</h2>
        <p className="text-sm text-muted-foreground">
          Order: Muted, Primary, Secondary, Accent, Red, Blue, Purple, Fg
          <br />
          <span className="text-accent-green">Pro: Shows dominant UI colors</span>
          {" | "}
          <span className="text-destructive">Con: No natural progression</span>
        </p>
        <ThemeSwatchBlock
          name="Remedy"
          darkSwatch={remedyDarkWeighted}
          lightSwatch={remedyLightWeighted}
        />
        <ThemeSwatchBlock
          name="Gruvbox"
          darkSwatch={gruvboxDarkWeighted}
          lightSwatch={gruvboxLightWeighted}
        />
        <ThemeSwatchBlock
          name="Rose Pine"
          darkSwatch={rosePineDarkWeighted}
          lightSwatch={rosePineLightWeighted}
        />
      </div>

      {/* ===== APPROACH C: Hybrid - ANSI order but with muted anchoring ===== */}
      <div id="compact" className="space-y-4 scroll-mt-4">
        <h2 className="text-xl font-semibold">Approach C: ANSI + Muted Anchor (24px)</h2>
        <p className="text-sm text-muted-foreground">
          Order: Muted, Red, Green, Yellow, Blue, Magenta, Cyan, Fg
          <br />
          <span className="text-accent-green">Pro: Natural progression, visible first color</span>
          {" | "}
          <span className="text-destructive">Con: Still missing some primaries</span>
        </p>
        <ThemeSwatchBlock
          name="Remedy"
          darkSwatch={[remedyDark.baseCode, ...remedyDarkAnsi.slice(1)]}
          lightSwatch={[remedyBright.baseCode, ...remedyLightAnsi.slice(1)]}
        />
        <ThemeSwatchBlock
          name="Gruvbox"
          darkSwatch={[gruvboxPalette.dark1, ...gruvboxDarkAnsi.slice(1)]}
          lightSwatch={[gruvboxPalette.light1, ...gruvboxLightAnsi.slice(1)]}
        />
        <ThemeSwatchBlock
          name="Rose Pine"
          darkSwatch={[rosePineMain.highlight_med, ...rosePineDarkAnsi.slice(1)]}
          lightSwatch={[rosePineDawn.highlight_med, ...rosePineLightAnsi.slice(1)]}
        />
      </div>

      {/* ===== APPROACH D: Deduplicated Weighted ===== */}
      <div id="dedup" className="space-y-4 scroll-mt-4">
        <h2 className="text-xl font-semibold">Approach D: Deduplicated Weighted (24px)</h2>
        <p className="text-sm text-muted-foreground">
          Order: Muted, Primary, Secondary, Accent, then 3 unique &quot;other&quot; colors
          <br />
          <span className="text-accent-green">Pro: Semantic + no redundancy</span>
          {" | "}
          Remedy: red/green/purple, Gruvbox: red/blue/purple, Rose Pine: red/orange/purple
        </p>
        <ThemeSwatchBlock
          name="Remedy"
          darkSwatch={remedyDarkDedup}
          lightSwatch={remedyLightDedup}
        />
        <ThemeSwatchBlock
          name="Gruvbox"
          darkSwatch={gruvboxDarkDedup}
          lightSwatch={gruvboxLightDedup}
        />
        <ThemeSwatchBlock
          name="Rose Pine"
          darkSwatch={rosePineDarkDedup}
          lightSwatch={rosePineLightDedup}
        />
      </div>

      {/* ===== Size Comparison ===== */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Size Comparison (Approach D)</h2>
        <div className="flex gap-8 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground mb-2">16px</p>
            <SwatchRow colors={remedyDarkDedup} label="" size={16} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">20px</p>
            <SwatchRow colors={remedyDarkDedup} label="" size={20} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">24px</p>
            <SwatchRow colors={remedyDarkDedup} label="" size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">32px</p>
            <SwatchRow colors={remedyDarkDedup} label="" size={32} />
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mt-8 space-y-2">
        <p>Hover over squares to see position index and hex value.</p>
        <p>
          <strong>Note:</strong> In the actual control, only one row would show at a time,
          changing when light/dark mode is toggled.
        </p>
        <p>
          <strong>Decision needed:</strong> Prioritize terminal aesthetic (A/C) or UI representation (B)?
        </p>
      </div>
    </div>
  );
}
