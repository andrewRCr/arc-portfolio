/**
 * Theme Showcase Page
 *
 * Development-only page for visual testing of theme system.
 * Shows all colors, typography, interactive elements, and hover states.
 * Access via footer link in development mode.
 */

export default function ThemeShowcasePage() {
  return (
    <div className="space-y-12 p-8">
      <header>
        <h1 className="mb-2 text-4xl font-bold">Theme Showcase</h1>
        <p className="text-muted-foreground">
          Visual reference for all theme colors, typography, and interactive elements
        </p>
      </header>

      {/* Color Palette Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Color Palette</h2>

        {/* Base Colors */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Base Colors</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ColorSwatch label="Background" className="bg-background text-foreground" />
            <ColorSwatch label="Foreground" className="bg-foreground text-background" />
            <ColorSwatch label="Card" className="bg-card text-card-foreground" />
            <ColorSwatch label="Popover" className="bg-popover text-popover-foreground" />
            <ColorSwatch label="Border" className="border-4 border-border bg-background" />
            <ColorSwatch label="Input" className="border-4 border-input bg-background" />
          </div>
        </div>

        {/* Semantic Colors */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Semantic Colors</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ColorSwatch label="Primary" className="bg-primary text-primary-foreground" />
            <ColorSwatch label="Secondary" className="bg-secondary text-secondary-foreground" />
            <ColorSwatch label="Muted" className="bg-muted text-muted-foreground" />
            <ColorSwatch label="Accent" className="bg-accent text-accent-foreground" />
            <ColorSwatch label="Destructive" className="bg-destructive text-destructive-foreground" />
            <ColorSwatch label="Ring" className="border-4 border-ring bg-background" />
          </div>
        </div>

        {/* Decorative Accent Colors */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Decorative Accents</h3>
          <p className="text-sm text-muted-foreground mb-2">
            For borders, text color, indicators - not for backgrounds with text
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ColorSwatch label="accent-red" className="border-4 border-accent-red bg-background text-accent-red" />
            <ColorSwatch
              label="accent-orange"
              className="border-4 border-accent-orange bg-background text-accent-orange"
            />
            <ColorSwatch
              label="accent-green"
              className="border-4 border-accent-green bg-background text-accent-green"
            />
            <ColorSwatch label="accent-blue" className="border-4 border-accent-blue bg-background text-accent-blue" />
            <ColorSwatch
              label="accent-purple"
              className="border-4 border-accent-purple bg-background text-accent-purple"
            />
            <ColorSwatch label="accent (default)" className="bg-accent text-accent-foreground" />
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Typography</h2>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Heading 1 - The quick brown fox</h1>
          <h2 className="text-3xl font-bold">Heading 2 - The quick brown fox</h2>
          <h3 className="text-2xl font-semibold">Heading 3 - The quick brown fox</h3>
          <h4 className="text-xl font-semibold">Heading 4 - The quick brown fox</h4>
          <h5 className="text-lg font-medium">Heading 5 - The quick brown fox</h5>
          <h6 className="text-base font-medium">Heading 6 - The quick brown fox</h6>

          <p className="text-foreground">
            Regular paragraph text in foreground color. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            lacinia odio vitae vestibulum vestibulum.
          </p>

          <p className="text-muted-foreground">
            Muted paragraph text for less emphasis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            lacinia odio vitae vestibulum vestibulum.
          </p>

          <p className="text-sm text-muted-foreground">
            Small muted text for captions and metadata. Often used for timestamps, labels, and secondary info.
          </p>
        </div>
      </section>

      {/* Links Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Links & Hover States</h2>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-xl font-semibold">Text Links</h3>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="text-primary underline hover:text-primary/80">
                Primary link
              </a>
              <a href="#" className="text-secondary underline hover:text-secondary/80">
                Secondary link
              </a>
              <a href="#" className="text-accent underline hover:text-accent/80">
                Accent link
              </a>
              <a href="#" className="text-accent-blue underline hover:text-accent-blue/80">
                Blue accent link
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold">Button-Style Links</h3>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Primary Button
              </a>
              <a
                href="#"
                className="rounded-lg bg-secondary px-4 py-2 text-secondary-foreground transition-colors hover:bg-secondary/90"
              >
                Secondary Button
              </a>
              <a
                href="#"
                className="rounded-lg bg-accent px-4 py-2 text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Accent Button
              </a>
              <a
                href="#"
                className="rounded-lg border border-border px-4 py-2 transition-colors hover:border-primary hover:bg-accent/10"
              >
                Outline Button
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Cards & Containers */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Cards & Containers</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border p-6">
            <h3 className="mb-2 text-xl font-semibold">Default Card</h3>
            <p className="text-sm text-muted-foreground">
              Standard card with border-border. Used throughout the application for content grouping.
            </p>
          </div>

          <div className="rounded-lg bg-card p-6 text-card-foreground">
            <h3 className="mb-2 text-xl font-semibold">Card Background</h3>
            <p className="text-sm text-muted-foreground">
              Uses bg-card for slight elevation effect. Useful for nested content areas.
            </p>
          </div>

          <div className="rounded-lg bg-muted p-6">
            <h3 className="mb-2 text-xl font-semibold text-foreground">Muted Card</h3>
            <p className="text-sm text-muted-foreground">
              Muted background for de-emphasized content. Good for sidebars and secondary info.
            </p>
          </div>

          <div className="rounded-lg bg-primary p-6 text-primary-foreground">
            <h3 className="mb-2 text-xl font-semibold">Primary Card</h3>
            <p className="text-sm">Highlighted card using primary brand color. Eye-catching for CTAs.</p>
          </div>

          <div className="rounded-lg bg-accent p-6 text-accent-foreground">
            <h3 className="mb-2 text-xl font-semibold">Accent Card</h3>
            <p className="text-sm">Using accent color for special callouts and featured content.</p>
          </div>

          <div className="rounded-lg bg-secondary p-6 text-secondary-foreground">
            <h3 className="mb-2 text-xl font-semibold">Secondary Card</h3>
            <p className="text-sm">Secondary color variation for additional hierarchy.</p>
          </div>
        </div>
      </section>

      {/* Interactive Elements */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Interactive Elements</h2>

        <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-xl font-semibold">Hover Cards</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="cursor-pointer rounded-lg border border-border p-4 transition-colors hover:border-primary hover:bg-accent/10">
                <h4 className="font-semibold">Hover: Border + Background</h4>
                <p className="text-sm text-muted-foreground">Hover to see border change to primary and subtle bg</p>
              </div>
              <div className="cursor-pointer rounded-lg border border-border p-4 transition-all hover:scale-105 hover:border-accent">
                <h4 className="font-semibold">Hover: Scale + Border</h4>
                <p className="text-sm text-muted-foreground">Hover to see scale and border color change</p>
              </div>
              <div className="cursor-pointer rounded-lg bg-muted p-4 transition-colors hover:bg-accent hover:text-accent-foreground">
                <h4 className="font-semibold">Hover: Full Background</h4>
                <p className="text-sm text-muted-foreground">Hover to see complete background color change</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Link Example (from ContactSection) */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Real Component Examples</h2>

        <div>
          <h3 className="mb-3 text-xl font-semibold">Social Link Style (ContactSection)</h3>
          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary hover:bg-accent/10"
            >
              <span className="font-medium text-foreground">GitHub</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary hover:bg-accent/10"
            >
              <span className="font-medium text-foreground">LinkedIn</span>
            </a>
          </div>
        </div>
      </section>

      {/* Developer Info */}
      <section className="rounded-lg border border-border bg-muted/50 p-6">
        <h2 className="mb-4 text-2xl font-bold">Developer Notes</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Purpose:</strong> This page showcases all theme colors and interactive
            states for visual QA testing.
          </p>
          <p>
            <strong className="text-foreground">Test Matrix:</strong> 2 themes (Gruvbox, Rose Pine) × 2 modes (light,
            dark) = 4 combinations
          </p>
          <p>
            <strong className="text-foreground">Hover States:</strong> Test all hover effects work correctly across
            themes
          </p>
          <p>
            <strong className="text-foreground">Accessibility:</strong> Verify contrast ratios and readability in all
            combinations
          </p>
        </div>
      </section>
    </div>
  );
}

/**
 * ColorSwatch Component
 *
 * Displays a color sample with label
 */
function ColorSwatch({ label, className }: { label: string; className: string }) {
  return (
    <div className={`flex h-24 items-center justify-center rounded-lg ${className}`}>
      <span className="font-medium">{label}</span>
    </div>
  );
}
