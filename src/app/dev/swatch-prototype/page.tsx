"use client";

/**
 * Swatch Prototype Page
 *
 * DEV ONLY: Prototype for evaluating color swatch arrangements across themes.
 * Shows all three themes in both light/dark modes side-by-side.
 *
 * Route: /dev/swatch-prototype
 *
 * DELETE THIS PAGE after design decisions are finalized.
 */

import { PageLayout } from "@/components/layout/PageLayout";
import { DevPageHeader } from "@/components/dev/DevPageHeader";
import { SwatchPrototype } from "@/components/dev/SwatchPrototype";

const JUMP_LINKS = [
  { id: "standard", label: "A: ANSI" },
  { id: "larger", label: "B: Weighted" },
  { id: "compact", label: "C: Hybrid" },
  { id: "dedup", label: "D: Dedup" },
];

export default function SwatchPrototypePage() {
  return (
    <PageLayout header={<DevPageHeader title="Swatch Prototype" jumpLinks={JUMP_LINKS} />}>
      <SwatchPrototype />
    </PageLayout>
  );
}
