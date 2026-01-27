"use client";

/**
 * Development Sandbox Page
 *
 * Permanent scratch space for quick visual prototyping and A/B testing.
 * Modify freely - content here is meant to be temporary experiments.
 *
 * Route: /dev/sandbox
 */

import { useState, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { DevPageHeader } from "@/components/dev/DevPageHeader";
import { useHasMounted } from "@/hooks/useHasMounted";

// =============================================================================
// PAGE TRANSITION VARIANT TESTER
// =============================================================================

type TransitionVariant = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | null;

/** Current baseline from PageTransition.tsx */
const BASELINE = { delay: 0.1, duration: 0.4 };

/** Material Design standard easing */
const MATERIAL_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
/** Snappy/punchy easing */
const SNAPPY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
/** Premium bounce (slight overshoot) */
const BOUNCE_EASE: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

/**
 * Variant definitions for header vs body timing exploration
 *
 * A-C: Original opacity-based variants
 * D-G: New techniques from research (clip-path, blur, parallax, diagonal)
 */
const variants: Record<
  "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H",
  { header: Variants; body: Variants; description: string }
> = {
  // === ORIGINAL VARIANTS ===
  A: {
    description: "Staggered: header first, then body",
    header: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { delay: BASELINE.delay, duration: BASELINE.duration * 0.6, ease: "easeOut" },
      },
    },
    body: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { delay: BASELINE.delay + BASELINE.duration * 0.4, duration: BASELINE.duration, ease: "easeOut" },
      },
    },
  },
  B: {
    description: "Same timing, header snappier easing",
    header: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { delay: BASELINE.delay, duration: BASELINE.duration * 0.7, ease: SNAPPY_EASE },
      },
    },
    body: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { delay: BASELINE.delay, duration: BASELINE.duration, ease: "easeInOut" },
      },
    },
  },
  C: {
    description: "Header slides down + fades, body fades",
    header: {
      hidden: { opacity: 0, y: -8 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { delay: BASELINE.delay, duration: BASELINE.duration * 0.8, ease: SNAPPY_EASE },
      },
    },
    body: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { delay: BASELINE.delay + 0.05, duration: BASELINE.duration, ease: "easeOut" },
      },
    },
  },

  // === NEW VARIANTS FROM RESEARCH ===
  D: {
    description: "Clip-path wipe: left-to-right reveal",
    header: {
      hidden: { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
      visible: {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        transition: { delay: BASELINE.delay, duration: 0.35, ease: SNAPPY_EASE },
      },
    },
    body: {
      hidden: { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
      visible: {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        transition: { delay: BASELINE.delay + 0.08, duration: 0.4, ease: MATERIAL_EASE },
      },
    },
  },
  E: {
    description: "Scale + blur: dimensional depth effect",
    header: {
      hidden: { opacity: 0, scale: 0.96, filter: "blur(4px)" },
      visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: { delay: BASELINE.delay, duration: 0.35, ease: MATERIAL_EASE },
      },
    },
    body: {
      hidden: { opacity: 0, scale: 0.98, filter: "blur(6px)" },
      visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: { delay: BASELINE.delay + 0.05, duration: 0.4, ease: MATERIAL_EASE },
      },
    },
  },
  F: {
    description: "Layered parallax: header up, body up (different distances)",
    header: {
      hidden: { opacity: 0, y: -15 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { delay: BASELINE.delay, duration: 0.35, ease: MATERIAL_EASE },
      },
    },
    body: {
      hidden: { opacity: 0, y: 25 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { delay: BASELINE.delay + 0.08, duration: 0.45, ease: MATERIAL_EASE },
      },
    },
  },
  G: {
    description: "Diagonal zoom: x/y/scale with bounce easing",
    header: {
      hidden: { opacity: 0, x: -20, y: -10, scale: 0.97 },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: { delay: BASELINE.delay, duration: 0.45, ease: BOUNCE_EASE },
      },
    },
    body: {
      hidden: { opacity: 0, x: -30, y: 15, scale: 0.95 },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: { delay: BASELINE.delay + 0.06, duration: 0.5, ease: BOUNCE_EASE },
      },
    },
  },
  H: {
    description: "Parallax + blur: movement with focus-in (no scale)",
    header: {
      hidden: { opacity: 0, y: -15, filter: "blur(4px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { delay: BASELINE.delay, duration: 0.35, ease: MATERIAL_EASE },
      },
    },
    body: {
      hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { delay: BASELINE.delay + 0.08, duration: 0.45, ease: MATERIAL_EASE },
      },
    },
  },
};

function TransitionTester() {
  const [activeVariant, setActiveVariant] = useState<TransitionVariant>(null);
  const [animationKey, setAnimationKey] = useState(0);

  const triggerVariant = useCallback((v: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H") => {
    setActiveVariant(v);
    setAnimationKey((k) => k + 1);
  }, []);

  const reset = useCallback(() => {
    setActiveVariant(null);
  }, []);

  const currentVariant = activeVariant ? variants[activeVariant] : null;

  const allVariants = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-mono text-lg font-semibold">Page Transition Variants</h2>
        <div className="flex flex-wrap gap-1.5">
          {allVariants.map((v) => (
            <button
              key={v}
              onClick={() => triggerVariant(v)}
              className={`rounded px-2.5 py-1 text-sm font-medium transition-colors ${
                activeVariant === v
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {v}
            </button>
          ))}
          <button
            onClick={reset}
            className="rounded px-2.5 py-1 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Description of current variant */}
      <p className="text-sm text-muted-foreground h-5">
        {currentVariant ? currentVariant.description : "Click a variant to preview the transition"}
      </p>

      {/* Mock page content area */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {currentVariant === null ? (
          // Static preview (no animation)
          <div className="p-4">
            <MockHeader />
            <MockBody />
          </div>
        ) : (
          // Animated preview
          <div key={animationKey} className="p-4">
            <motion.div initial="hidden" animate="visible" variants={currentVariant.header}>
              <MockHeader />
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={currentVariant.body}>
              <MockBody />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Mock PageHeader-like component */
function MockHeader() {
  return (
    <div className="space-y-1 pb-3 border-b border-border/50">
      <h1 className="font-mono text-xl font-bold text-foreground">Page Title</h1>
      <p className="text-sm text-muted-foreground">Subtitle or description text</p>
    </div>
  );
}

/** Mock body content */
function MockBody() {
  return (
    <div className="pt-4 space-y-4">
      <p className="text-sm text-foreground/80">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
      </p>
      <p className="text-sm text-foreground/80">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-md bg-muted p-4 text-center text-xs text-muted-foreground">
            Card {i}
          </div>
        ))}
      </div>
      <p className="text-sm text-foreground/80">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
        aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </p>
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
    <PageLayout header={<DevPageHeader title="Sandbox" jumpLinks={[]} />}>
      <div className="space-y-8">
        {/* ============================================
            SANDBOX AREA - Modify freely below this line
            ============================================ */}

        <TransitionTester />

        {/* ============================================
            Reference helpers (collapse or delete as needed)
            ============================================ */}
        <details className="rounded-lg border border-border">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
            Quick Reference: Colors & Tokens
          </summary>
          <div className="border-t border-border px-4 py-4 space-y-4">
            {/* Background colors */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Backgrounds</p>
              <div className="flex flex-wrap gap-2">
                <div className="rounded px-3 py-2 text-xs bg-background border border-border">background</div>
                <div className="rounded px-3 py-2 text-xs bg-card text-card-foreground">card</div>
                <div className="rounded px-3 py-2 text-xs bg-muted text-muted-foreground">muted</div>
                <div className="rounded px-3 py-2 text-xs bg-accent text-accent-foreground">accent</div>
                <div className="rounded px-3 py-2 text-xs bg-secondary text-secondary-foreground">secondary</div>
                <div className="rounded px-3 py-2 text-xs bg-primary text-primary-foreground">primary</div>
              </div>
            </div>

            {/* Text colors */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Text</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-foreground">foreground</span>
                <span className="text-muted-foreground">muted-foreground</span>
                <span className="text-accent-foreground bg-accent px-1 rounded">accent-fg</span>
              </div>
            </div>

            {/* Border colors */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Borders</p>
              <div className="flex flex-wrap gap-2">
                <div className="rounded border border-border px-3 py-2 text-xs">border</div>
                <div className="rounded border border-border-strong px-3 py-2 text-xs">border-strong</div>
              </div>
            </div>

            {/* Opacity variants */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Common opacity patterns</p>
              <div className="flex flex-wrap gap-2">
                <div className="rounded px-3 py-2 text-xs bg-card/80">card/80</div>
                <div className="rounded px-3 py-2 text-xs bg-background/80 border border-border">background/80</div>
                <div className="rounded px-3 py-2 text-xs bg-muted/80">muted/80</div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </PageLayout>
  );
}
