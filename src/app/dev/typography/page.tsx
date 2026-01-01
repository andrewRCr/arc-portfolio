"use client";

import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { DevPageHeader } from "@/components/dev/DevPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/** Jump links for in-page navigation */
const JUMP_LINKS = [
  { id: "headings", label: "Headings" },
  { id: "body-text", label: "Body" },
  { id: "font-sizes", label: "Sizes" },
  { id: "font-weights", label: "Weights" },
  { id: "line-heights", label: "Line Heights" },
  { id: "text-colors", label: "Colors" },
];

/**
 * Typography Debug Page
 *
 * Development-only page for testing typography across themes.
 * Separated from theme-debug for focused typography inspection.
 *
 * Route: /dev/typography (only accessible in development - enforced by dev layout)
 */
export default function TypographyPage() {
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional hydration pattern
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-muted-foreground">Loading typography...</p>
      </div>
    );
  }

  return (
    <PageLayout header={<DevPageHeader title="Typography" jumpLinks={JUMP_LINKS} showEnvPreview />}>
      <div className="space-y-8 p-8">
        {/* Headings */}
        <Card id="headings">
          <CardHeader>
            <CardTitle className="text-2xl">Headings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h1 className="text-4xl font-bold">Heading 1 - The quick brown fox</h1>
            <h2 className="text-3xl font-bold">Heading 2 - The quick brown fox</h2>
            <h3 className="text-2xl font-semibold">Heading 3 - The quick brown fox</h3>
            <h4 className="text-xl font-semibold">Heading 4 - The quick brown fox</h4>
            <h5 className="text-lg font-medium">Heading 5 - The quick brown fox</h5>
            <h6 className="text-base font-medium">Heading 6 - The quick brown fox</h6>
          </CardContent>
        </Card>

        {/* Body Text */}
        <Card id="body-text">
          <CardHeader>
            <CardTitle className="text-2xl">Body Text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">
              Regular paragraph text in foreground color. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus justo, ut fringilla velit fermentum
              a.
            </p>

            <p className="text-muted-foreground">
              Muted paragraph text for less emphasis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum vestibulum. Cras porttitor metus justo.
            </p>

            <p className="text-sm text-muted-foreground">
              Small muted text for captions and metadata. Often used for timestamps, labels, and secondary information
              that doesn&apos;t need primary visual weight.
            </p>
          </CardContent>
        </Card>

        {/* Font Sizes */}
        <Card id="font-sizes">
          <CardHeader>
            <CardTitle className="text-2xl">Font Sizes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs">text-xs (12px) - Extra small text</p>
            <p className="text-sm">text-sm (14px) - Small text</p>
            <p className="text-base">text-base (16px) - Base text size</p>
            <p className="text-lg">text-lg (18px) - Large text</p>
            <p className="text-xl">text-xl (20px) - Extra large</p>
            <p className="text-2xl">text-2xl (24px) - 2x large</p>
            <p className="text-3xl">text-3xl (30px) - 3x large</p>
            <p className="text-4xl">text-4xl (36px) - 4x large</p>
          </CardContent>
        </Card>

        {/* Font Weights */}
        <Card id="font-weights">
          <CardHeader>
            <CardTitle className="text-2xl">Font Weights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-light">font-light (300) - Light weight text</p>
            <p className="font-normal">font-normal (400) - Normal weight text</p>
            <p className="font-medium">font-medium (500) - Medium weight text</p>
            <p className="font-semibold">font-semibold (600) - Semibold weight text</p>
            <p className="font-bold">font-bold (700) - Bold weight text</p>
          </CardContent>
        </Card>

        {/* Line Heights */}
        <Card id="line-heights">
          <CardHeader>
            <CardTitle className="text-2xl">Line Heights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">leading-tight (1.25)</p>
              <p className="leading-tight">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum
                vestibulum. Cras porttitor metus justo.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">leading-normal (1.5)</p>
              <p className="leading-normal">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum
                vestibulum. Cras porttitor metus justo.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">leading-relaxed (1.625)</p>
              <p className="leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum
                vestibulum. Cras porttitor metus justo.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">leading-loose (2)</p>
              <p className="leading-loose">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum
                vestibulum. Cras porttitor metus justo.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Text Colors */}
        <Card id="text-colors">
          <CardHeader>
            <CardTitle className="text-2xl">Text Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-foreground">text-foreground - Primary text color</p>
            <p className="text-muted-foreground">text-muted-foreground - Muted/secondary text</p>
            <p className="text-primary">text-primary - Primary brand color</p>
            <p className="text-secondary-foreground">text-secondary-foreground - Secondary foreground</p>
            <p className="text-accent-foreground">text-accent-foreground - Accent foreground</p>
            <p className="text-destructive">text-destructive - Destructive/error color</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <span className="text-accent-red">accent-red</span>
              <span className="text-accent-orange">accent-orange</span>
              <span className="text-accent-green">accent-green</span>
              <span className="text-accent-blue">accent-blue</span>
              <span className="text-accent-purple">accent-purple</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
