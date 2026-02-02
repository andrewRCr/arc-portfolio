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
// EXTERNAL LINKS BOX EXPERIMENT
// =============================================================================

import { Github, Globe, ExternalLink } from "lucide-react";

function ExternalLinksBoxExperiment() {
  // Mock links similar to what DetailHeaderDesktop would have
  const mockLinks = [
    { icon: Github, label: "GitHub", href: "#" },
    { icon: Globe, label: "Live Demo", href: "#" },
    { icon: ExternalLink, label: "Download", href: "#" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="font-mono text-lg font-semibold">External Links Box Variants</h2>
      <p className="text-sm text-muted-foreground">
        Connected box approach for external links - label + icon buttons in a framed container
      </p>

      <div className="space-y-6">
        {/* Variant A: Label left, icons right, outer border only */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">A: Outer border, no internal dividers</p>
          <div className="inline-flex items-stretch border border-border">
            <span className="flex items-center px-3 font-terminal text-xs text-muted-foreground uppercase tracking-wider">
              Links
            </span>
            <div className="flex">
              {mockLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Variant B: bg-muted label section */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">B: Label with bg-muted background</p>
          <div className="inline-flex items-stretch border border-border">
            <span className="flex items-center bg-muted px-3 font-terminal text-xs text-muted-foreground uppercase tracking-wider">
              Links
            </span>
            <div className="flex">
              {mockLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Variant B-inv: Inverted - icons with bg-muted */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">B-inv: Icons with bg-muted background</p>
          <div className="inline-flex items-stretch border border-border">
            <span className="flex items-center px-3 font-terminal text-xs text-muted-foreground uppercase tracking-wider">
              Links
            </span>
            <div className="flex bg-muted">
              {mockLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Variant C: Accent label like title badge */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">C: Label with bg-accent (matches title badge)</p>
          <div className="inline-flex items-stretch border border-border">
            <span className="flex items-center bg-accent/80 px-3 font-terminal text-xs text-accent-foreground uppercase tracking-wider">
              Links
            </span>
            <div className="flex">
              {mockLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Variant D: No outer border, just connected blocks */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            D: No outer border, connected blocks (like back+title)
          </p>
          <div className="inline-flex items-stretch">
            <span className="flex items-center bg-muted px-3 font-terminal text-xs text-muted-foreground uppercase tracking-wider">
              Links
            </span>
            <div className="flex bg-card">
              {mockLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Variant E: Subtle border, larger icons */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">E: Subtle border, larger touch targets (44px)</p>
          <div className="inline-flex items-stretch border border-border/50">
            <span className="flex items-center bg-muted/50 px-3 font-terminal text-xs text-muted-foreground uppercase tracking-wider">
              Links
            </span>
            <div className="flex">
              {mockLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Variant E-inv: Inverted - icons with subtle bg-muted */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            E-inv: Icons with bg-muted/50, larger touch targets
          </p>
          <div className="inline-flex items-stretch border border-border/50">
            <span className="flex items-center px-3 font-terminal text-xs text-muted-foreground uppercase tracking-wider">
              Links
            </span>
            <div className="flex bg-muted/50">
              {mockLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Context: How it might look in a header footer bar */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">In context: Mock header footer bar</p>
          <div className="flex items-center justify-between gap-4 px-4 py-3 bg-card/80 rounded-lg border border-border">
            {/* Left side: category badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-accent/20 px-2 py-0.5 font-terminal text-sm font-semibold text-foreground">
                Web App
              </span>
              <span className="bg-accent/20 px-2 py-0.5 font-terminal text-sm font-semibold text-foreground">
                Full-Stack
              </span>
              <span className="ml-2 text-sm text-muted-foreground">Solo · 2024</span>
            </div>

            {/* Right side: External links box */}
            <div className="inline-flex items-stretch border border-border">
              <span className="flex items-center bg-muted px-3 font-terminal text-xs text-muted-foreground uppercase tracking-wider">
                Links
              </span>
              <div className="flex">
                {mockLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      aria-label={link.label}
                      className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
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

        <ExternalLinksBoxExperiment />

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
