import { SITE } from "@/config/site";

/**
 * Hero Component
 *
 * Full hero section for the home page with terminal-inspired styling.
 * Displays name, tagline, and decorative prompt element.
 */
export function Hero() {
  return (
    <div className="pl-0 md:pl-2 py-2 pb-4">
      <div className="border-l-2 border-primary pl-6">
        <div className="space-y-4 mb-8 md:mb-12">
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground">&gt; portfolio.init()</p>

            <h1 className="text-4xl font-bold font-mono">{SITE.name}</h1>

            <p className="text-lg text-muted-foreground">
              {(() => {
                const parts = SITE.tagline.split(" | ");
                if (parts.length === 2) {
                  return (
                    <>
                      {parts[0]}
                      <br className="md:hidden" />
                      <span className="hidden md:inline">&nbsp; | &nbsp;</span>
                      {parts[1]}
                    </>
                  );
                }
                return SITE.tagline;
              })()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
