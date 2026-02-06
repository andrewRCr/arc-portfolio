import { ArrowLeft, ExternalLink, Github, Linkedin, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardContentInset } from "./CardContentInset";

/**
 * Interactive States Section
 *
 * Demonstrates the four interaction emphasis tiers used in production,
 * plus the subtle emphasis pattern (accent-low) and nav link states.
 *
 * Tiers:
 * 1. Ambient — muted default, accent-high on hover (supporting context)
 * 2. Focal — accent-mid default, accent-mid-hover on hover (button IS the focus)
 * 3. Primary CTA — primary default, primary-hover on hover (single main action)
 * 4. Area hover — border → secondary-high + shadow-md (cards, large surfaces)
 */
export function InteractiveStatesSection() {
  return (
    <Card id="interactive">
      <CardHeader>
        <CardTitle className="font-title text-2xl">Interactive States</CardTitle>
      </CardHeader>
      <CardContent>
        <CardContentInset className="space-y-6">
          {/* Tier 1: Ambient */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Tier 1 — Ambient</h3>
            <p className="font-body text-sm text-muted-foreground">
              Low-key by default, <code>accent-high</code> on hover. Button is supporting context — TopBar toggle,
              FooterBar socials, back button, filter button.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-accent-high-foreground hover:bg-accent-high"
              >
                <SlidersHorizontal className="size-4" />
                Filter
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-accent-high-foreground hover:bg-accent-high"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <Button
                variant="outline"
                className="border-transparent text-foreground hover:text-accent-mid hover:bg-transparent"
              >
                <ExternalLink className="size-4" />
                External Link
              </Button>
            </div>
          </div>

          {/* Tier 2: Focal */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Tier 2 — Focal</h3>
            <p className="font-body text-sm text-muted-foreground">
              <code>accent-mid</code> default, <code>accent-mid-hover</code> on hover. Button IS the focus — ContactForm
              social links.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#interactive"
                className="flex items-center gap-2 border border-border bg-accent-mid px-4 py-2 text-accent-mid-foreground transition-colors hover:bg-accent-mid-hover hover:text-accent-mid-hover-foreground"
              >
                <Github className="size-4" />
                <span className="font-terminal text-sm font-medium">GitHub</span>
              </a>
              <a
                href="#interactive"
                className="flex items-center gap-2 border border-border bg-accent-mid px-4 py-2 text-accent-mid-foreground transition-colors hover:bg-accent-mid-hover hover:text-accent-mid-hover-foreground"
              >
                <Linkedin className="size-4" />
                <span className="font-terminal text-sm font-medium">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Tier 3: Primary CTA */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Tier 3 — Primary CTA</h3>
            <p className="font-body text-sm text-muted-foreground">
              <code>primary</code> default, <code>primary-hover</code> on hover. Single main action per page —
              ContactForm submit.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                className="bg-primary px-4 py-2 font-terminal font-medium uppercase text-primary-foreground transition-colors hover:bg-primary-hover hover:text-primary-hover-foreground"
              >
                Send Message
              </button>
              <button
                type="button"
                disabled
                className="bg-primary px-4 py-2 font-terminal font-medium uppercase text-primary-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Disabled
              </button>
            </div>
          </div>

          {/* Tier 4: Area Hover */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Tier 4 — Area Hover</h3>
            <p className="font-body text-sm text-muted-foreground">
              <code>border-border</code> → <code>border-secondary-high</code> + <code>shadow-md</code>. FeaturedSection
              project cards, ProjectCard.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="cursor-pointer overflow-hidden border border-border transition-[border-color,box-shadow] duration-300 hover:border-secondary-high hover:shadow-md">
                <div className="aspect-video bg-surface-card" />
                <div className="bg-surface-background p-4">
                  <h4 className="mb-1 font-title text-lg font-semibold">
                    <span className="bg-accent-low px-2 py-0.5 text-accent-low-foreground transition-colors duration-300 box-decoration-clone group-hover:bg-secondary-high">
                      Project Title
                    </span>
                  </h4>
                  <p className="text-sm text-muted-foreground">Card with secondary-high border hover</p>
                </div>
              </div>
              <div className="cursor-pointer overflow-hidden border border-border transition-[border-color,box-shadow] duration-300 hover:border-secondary-high hover:shadow-md">
                <div className="aspect-video bg-surface-card" />
                <div className="bg-surface-background p-4">
                  <h4 className="mb-1 font-title text-lg font-semibold">
                    <span className="bg-accent-low px-2 py-0.5 text-accent-low-foreground">Another Card</span>
                  </h4>
                  <p className="text-sm text-muted-foreground">Shadow elevates on hover</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle Emphasis */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Subtle Emphasis</h3>
            <p className="font-body text-sm text-muted-foreground">
              <code>accent-low</code> for visual weight without implying interactivity. Used on ProjectCard titles and
              category badges.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-accent-low px-2 py-0.5 font-terminal text-sm text-accent-low-foreground">
                Category Badge
              </span>
              <span className="bg-accent-low px-2 py-0.5 font-title text-lg font-semibold text-accent-low-foreground box-decoration-clone">
                Project Title
              </span>
            </div>
          </div>

          {/* Navigation Link States */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Navigation Link States</h3>
            <p className="font-body text-sm text-muted-foreground">
              Progression: muted-foreground → secondary-low hover → secondary-mid active
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-1 font-terminal text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary-low hover:text-foreground">
                Default
              </span>
              <span className="bg-secondary-low px-2 py-1 font-terminal text-sm font-semibold text-foreground">
                Hover
              </span>
              <span className="bg-secondary-mid px-2 py-1 font-terminal text-sm font-semibold text-foreground">
                Active
              </span>
              <span className="bg-secondary-low px-2 py-1 font-terminal text-sm font-semibold text-foreground">
                Pending
              </span>
            </div>
          </div>

          {/* Text Links */}
          <div className="space-y-3">
            <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Text Links</h3>
            <p className="font-body text-sm text-muted-foreground">
              Production TextLink: <code>text-accent</code> (light) / <code>text-accent-high</code> (dark) + underline
              on hover
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#interactive"
                className="text-accent hover:underline focus-visible:underline dark:text-accent-high"
              >
                Standard Link
              </a>
              <Button variant="link">Button Link Variant</Button>
            </div>
          </div>
        </CardContentInset>
      </CardContent>
    </Card>
  );
}
