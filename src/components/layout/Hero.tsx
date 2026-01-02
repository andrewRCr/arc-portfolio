import { SITE } from "@/config/site";

/**
 * Hero Component
 *
 * Full hero section for the home page with terminal-inspired styling.
 * Displays name, tagline, and decorative prompt element.
 */
export function Hero() {
  return (
    <div className="px-14 py-2 pb-4">
      <div className="border-l-2 border-primary pl-6">
        <div className="space-y-4 mb-12">
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground">&gt; portfolio.init()</p>

            <h1 className="text-4xl font-bold font-mono">{SITE.name}</h1>

            <p className="text-lg text-muted-foreground">{SITE.tagline}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
