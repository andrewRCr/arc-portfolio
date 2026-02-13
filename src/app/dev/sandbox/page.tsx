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
    <PageLayout header={<DevPageHeader title="Sandbox" jumpLinks={[]} showEnvPreview={true} />}>
      <div className="space-y-8">
        <p className="text-sm text-muted-foreground">Empty scratch space. Add temporary experiments here.</p>
      </div>
    </PageLayout>
  );
}
