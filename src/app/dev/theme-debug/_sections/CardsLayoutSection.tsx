import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Cards & Layout Section
 *
 * Showcases card patterns using the production surface token hierarchy:
 * - surface-card header + surface-background body (EducationCard pattern)
 * - surface-muted metadata badges
 * - ProjectCard-style hover with secondary-high border
 *
 * Replaces the previous generic bg-card/bg-muted fills with actual
 * production patterns.
 */
export function CardsLayoutSection() {
  return (
    <Card id="cards">
      <CardHeader>
        <CardTitle className="font-title text-2xl">Cards &amp; Layout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Production card pattern */}
        <div className="space-y-3">
          <h3 className="font-terminal text-lg font-semibold text-muted-foreground">
            Production Card (Surface Hierarchy)
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            <code>surface-card</code> header + <code>surface-background</code> body + <code>surface-muted</code> badges
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {/* EducationCard pattern */}
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="bg-surface-card px-4 py-3">
                <h4 className="font-terminal text-sm font-semibold text-foreground">University Name</h4>
                <p className="text-xs text-muted-foreground">2018 – 2022</p>
              </div>
              <div className="space-y-3 bg-surface-background px-4 py-4">
                <span className="inline-block bg-secondary-high px-3 py-1.5 font-terminal text-sm text-secondary-foreground">
                  Computer Science
                </span>
                <span className="ml-2 inline-block bg-surface-muted px-3 py-1.5 font-terminal text-sm text-muted-foreground">
                  B.S.
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="border border-border bg-surface-muted px-2.5 py-0.5 font-terminal text-xs text-muted-foreground">
                    Dean&apos;s List
                  </span>
                  <span className="border border-border bg-surface-muted px-2.5 py-0.5 font-terminal text-xs text-muted-foreground">
                    3.8 GPA
                  </span>
                </div>
              </div>
            </div>

            {/* ProjectCard-style pattern */}
            <div className="group cursor-pointer overflow-hidden rounded-lg border border-border transition-[border-color,box-shadow] duration-300 hover:border-secondary-high hover:shadow-md">
              <div className="aspect-video bg-surface-card" />
              <div className="flex flex-1 flex-col bg-surface-background p-4">
                <span className="mb-2 w-fit bg-surface-card px-2 py-0.5 font-terminal text-xs font-semibold text-foreground">
                  Game Title
                </span>
                <h4 className="mb-2 font-title text-lg font-semibold leading-relaxed">
                  <span className="bg-accent-low px-2 py-0.5 text-accent-low-foreground transition-colors duration-300 box-decoration-clone group-hover:bg-secondary-high group-hover:text-secondary-foreground">
                    Mod Project Name
                  </span>
                </h4>
                <p className="text-sm text-muted-foreground">Short description of the project.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badge in card context */}
        <div className="space-y-3">
          <h3 className="font-terminal text-lg font-semibold text-muted-foreground">Badges in Card Context</h3>
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex flex-wrap items-center gap-2 bg-surface-background p-4">
              <Badge variant="secondary">ModStats Badge</Badge>
              <Badge variant="secondary" className="gap-1.5">
                <span className="size-3 rounded-full bg-accent-green" />
                With Icon
              </Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge>Default</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
