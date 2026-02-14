/**
 * BIOS-style POST screen for the intro sequence.
 *
 * Server-rendered text block that paints at ~0ms, designed to register
 * as Chrome's LCP candidate before heavier page content loads. Styled
 * as a retro BIOS power-on self-test to fit the desktop environment
 * metaphor (BIOS → command window → tiling window manager).
 *
 * LCP constraints (do not change without re-testing):
 * - Text must live in a single block-level div (not flex) so Chrome
 *   attributes the full text bounding box as one LCP candidate
 * - Animated lines use inline spans (not block elements) inside the div
 * - Total text area must exceed ~34,000 CSS px² to beat page content
 * - Fade target is opacity:0.01, not 0 (Chrome invalidates at 0)
 */

import {
  BIOS_POST_HEADER_FOCUS,
  BIOS_POST_INITIAL_PAUSE,
  BIOS_POST_CHECK_STAGGER,
  BIOS_POST_FINAL_HOLD,
  BIOS_POST_FADE_DURATION,
} from "@/lib/animation-timing";

/** ARC logo path from icon.svg (arch shape, no background rectangle) */
const ARC_LOGO_PATH =
  "M465 421L268 421L268 332L378 332L378 298A110 100 0 0 0 158 298L158 421L71 421L71 296A197 182 0 0 1 465 296Z";

/** POST check lines (appear after initial pause, staggered) */
const CHECK_LINES = ["CPU ...................... OK", "Memory .............. 640K OK", "Display .................. OK"];

/** Final POST line (has its own trailing cursor) */
const FINAL_LINE = "Starting window manager... ";

/** Skip affordance — visible at first paint for LCP and user guidance */
const SKIP_HINT = "Press <Any> to skip POST.";

/** Derived: when each check line appears (after header focus + cursor pause) */
const checkStart = (i: number) => BIOS_POST_HEADER_FOCUS + BIOS_POST_INITIAL_PAUSE + i * BIOS_POST_CHECK_STAGGER;
/** Derived: when the final line + cursor appears */
const finalStart = checkStart(CHECK_LINES.length);
/** Derived: when the overall fade begins */
const fadeStart = finalStart + BIOS_POST_FINAL_HOLD;

interface BiosPostProps {
  /** When true, uses static positioning and no fade-out (for dev sandbox preview) */
  preview?: boolean;
}

export function BiosPost({ preview = false }: BiosPostProps) {
  const position = preview ? ("absolute" as const) : ("fixed" as const);
  const zBg = preview ? undefined : 101;
  const zContent = preview ? undefined : 102;

  const fadeStyle = preview
    ? undefined
    : ({
        "--bios-fade-delay": `${fadeStart}s`,
        "--bios-fade-duration": `${BIOS_POST_FADE_DURATION}s`,
      } as React.CSSProperties);

  return (
    <>
      {/* Full-viewport dark background (visual only — excluded from LCP by Chrome) */}
      <div
        aria-hidden="true"
        className={preview ? undefined : "bios-bg"}
        style={{
          position,
          inset: 0,
          zIndex: zBg,
          backgroundColor: "rgb(var(--intro-bg))",
          pointerEvents: "none",
          ...fadeStyle,
        }}
      />
      {/* POST text — single block element for LCP sizing. Logo is absolutely
          positioned within this div so it doesn't affect text flow or LCP.
          Cannot use inline-flex for the header — Chrome excludes its text
          from the parent's LCP bounding box, dropping below 34k threshold.
          Positioned to match command window vertical offset (20vh). */}
      <div
        data-lcp-anchor={!preview || undefined}
        aria-hidden="true"
        className={`${preview ? "" : "bios-post "}font-terminal`}
        style={{
          position,
          top: preview ? "50%" : "20vh",
          left: "50%",
          transform: preview ? "translate(-50%, -50%)" : "translateX(-50%)",
          zIndex: zContent,
          pointerEvents: "none",
          whiteSpace: "pre",
          fontSize: "0.875rem",
          lineHeight: "1.75",
          color: "rgb(var(--muted-foreground))",
          paddingLeft: "4.25rem",
          paddingRight: "4.25rem",
          ...fadeStyle,
        }}
      >
        {/* Logo — absolutely positioned at content edge so its left side
            aligns with the check lines below. Header text is indented by
            8 monospace characters to clear the logo + gap. */}
        <svg
          aria-hidden="true"
          className="bios-header"
          viewBox="60 100 420 325"
          style={{
            position: "absolute",
            left: "4.25rem",
            top: 0,
            width: "3.5rem",
            height: "3rem",
            fill: "rgb(var(--primary))",
          }}
        >
          <path d={ARC_LOGO_PATH} />
        </svg>
        {"        "}
        <span className="bios-header font-semibold">ARC BIOS v1.0</span>
        {"\n"}
        {"        "}
        <span className="bios-header">{"(C) 2026 andrewRCr"}</span>
        {"\n\n"}
        {/* Initial blinking cursor — appears after header focuses, blinks
            during pause, hidden when checks start */}
        <span
          className="bios-cursor"
          style={{
            animationDelay: `${BIOS_POST_HEADER_FOCUS}s`,
            animationDuration: `0s, ${BIOS_POST_INITIAL_PAUSE}s, ${BIOS_POST_INITIAL_PAUSE}s`,
          }}
        >
          _
        </span>
        {"\n"}
        {/* POST check lines — appear after initial pause */}
        {CHECK_LINES.map((text, i) => (
          <span key={i} className="bios-line" style={{ animationDelay: `${checkStart(i)}s` }}>
            {text + "\n"}
          </span>
        ))}
        {/* Final line with trailing cursor */}
        <span className="bios-line" style={{ animationDelay: `${finalStart}s` }}>
          {FINAL_LINE + " "}
        </span>
        <span className="bios-cursor-final" style={{ animationDelay: `${finalStart}s` }}>
          _
        </span>
        {"\n\n"}
        <span className="bios-header">{SKIP_HINT}</span>
        {"\n"}
      </div>
    </>
  );
}
