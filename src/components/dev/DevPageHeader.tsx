"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Props for DevPageHeader component.
 */
export interface DevPageHeaderProps {
  /** Page title displayed in the header */
  title: string;
  /** Jump links for in-page navigation */
  jumpLinks: Array<{ id: string; label: string }>;
  /** Whether to show the Environment Preview toggle (default: false) */
  showEnvPreview?: boolean;
}

/**
 * DevPageHeader Component
 *
 * Shared sticky header for development pages. Provides:
 * - Page title
 * - Jump links for in-page navigation
 * - Optional Environment Preview toggle (for color evaluation pages)
 *
 * Note: Theme controls are in the TopBar, not duplicated here.
 *
 * The Environment Preview toggle controls WindowContainer opacity:
 * - OFF (default): 100% opacity for pure color evaluation
 * - ON: Normal TWM opacity (0.95) for representative view
 */
export function DevPageHeader({ title, jumpLinks, showEnvPreview = false }: DevPageHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [envPreview, setEnvPreview] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional hydration pattern
    setMounted(true);
  }, []);

  // Set default env preview state on mount (100% opacity for dev pages)
  useEffect(() => {
    if (mounted) {
      document.documentElement.dataset.envPreview = "false";
    }
    return () => {
      delete document.documentElement.dataset.envPreview;
    };
  }, [mounted]);

  // Toggle environment preview via data attribute on html element
  useEffect(() => {
    if (mounted && showEnvPreview) {
      document.documentElement.dataset.envPreview = envPreview ? "true" : "false";
    }
  }, [envPreview, showEnvPreview, mounted]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Get sticky header height dynamically, fallback to 80px
      const stickyHeader = document.querySelector("[data-dev-header]");
      const headerOffset = stickyHeader ? stickyHeader.getBoundingClientRect().height + 16 : 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  if (!mounted) {
    return (
      <div data-dev-header className="sticky top-0 z-10 border-b border-border bg-background px-6 py-3">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
      </div>
    );
  }

  return (
    <div data-dev-header className="sticky top-0 z-10 border-b border-border bg-background px-6 py-3">
      <div className="mx-auto max-w-4xl space-y-3">
        {/* Top row: Title and optional controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold">{title}</h1>

          {/* Environment Preview toggle (only for pages that need it) */}
          {showEnvPreview && (
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={envPreview}
                onChange={(e) => setEnvPreview(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="text-muted-foreground">Show window opacity</span>
            </label>
          )}
        </div>

        {/* Jump links */}
        {jumpLinks.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 border-t border-border/50 pt-2">
            {jumpLinks.map(({ id, label }) => (
              <Button key={id} variant="link" size="sm" onClick={() => scrollToSection(id)}>
                {label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
