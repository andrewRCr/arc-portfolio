"use client";

/**
 * Development Sandbox Page
 *
 * Permanent scratch space for quick visual prototyping and A/B testing.
 * Modify freely - content here is meant to be temporary experiments.
 *
 * Route: /dev/sandbox
 */

import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { DevPageHeader } from "@/components/dev/DevPageHeader";
import { useHasMounted } from "@/hooks/useHasMounted";
import { BiosPost } from "@/components/intro/BiosPost";

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function SandboxPage() {
  const mounted = useHasMounted();
  const [biosKey, setBiosKey] = useState(0);

  if (!mounted) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <PageLayout header={<DevPageHeader title="Sandbox" jumpLinks={[]} showEnvPreview={true} />}>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-sm font-terminal text-muted-foreground">BIOS POST Screen (LCP anchor)</h2>
            <button
              onClick={() => setBiosKey((k) => k + 1)}
              className="text-xs font-terminal text-primary hover:text-accent-mid transition-colors"
            >
              [replay]
            </button>
          </div>
          <div
            key={biosKey}
            className="relative w-full rounded overflow-hidden border border-border"
            style={{ height: "24rem" }}
          >
            <BiosPost preview />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
