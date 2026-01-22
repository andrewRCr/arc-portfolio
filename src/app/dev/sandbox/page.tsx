"use client";

/**
 * Development Sandbox Page
 *
 * Permanent scratch space for quick visual prototyping and A/B testing.
 * Modify freely - content here is meant to be temporary experiments.
 *
 * Route: /dev/sandbox
 */

import { PageLayout } from "@/components/layout/PageLayout";
import { DevPageHeader } from "@/components/dev/DevPageHeader";
import { useHasMounted } from "@/hooks/useHasMounted";

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

        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground">Empty sandbox. Add your prototypes here.</p>
        </div>

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
