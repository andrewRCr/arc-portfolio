"use client";

/**
 * EducationCard Component
 *
 * Displays education credentials in a card format following DetailCard pattern.
 * Header (bg-card/80): Institution name (abbreviated on phone - drops leading "The ")
 * Body (bg-background/80): Major + degree type (joined, monospace) + metadata badges
 *
 * Degree display uses square corners and monospace to differentiate from
 * rounded metadata badges, creating a "structured data" aesthetic.
 *
 * Responsive:
 * - Phone: Stacked major/degree, abbreviated location (state abbrev), shorter institution
 * - Tablet+: Side-by-side major/degree (joined), full location
 */

import { useIsPhone } from "@/hooks/useMediaQuery";
import { abbreviateLocation } from "@/lib/state-abbreviations";
import type { Education } from "@/types/education";

interface EducationCardProps {
  education: Education;
}

export function EducationCard({ education }: EducationCardProps) {
  const { degree, major, institution, location, graduationDate, gpa } = education;
  const hasMetadata = location || graduationDate || gpa;
  const isPhone = useIsPhone();
  const displayLocation = location ? (isPhone ? abbreviateLocation(location) : location) : null;
  const displayInstitution = isPhone && institution.startsWith("The ") ? institution.slice(4) : institution;

  return (
    <div data-testid="education-card" className="overflow-hidden rounded-lg border border-border-strong">
      {/* Header - institution name */}
      <div data-testid="education-card-header" className="bg-card/80 px-4 py-3">
        <h3 className="text-lg font-bold text-foreground">{displayInstitution}</h3>
      </div>

      {/* Body - degree info + metadata badges */}
      <div data-testid="education-card-body" className="bg-background/80 px-4 py-4">
        {/* Major + degree type: stacked on phone, joined side-by-side on tablet+ */}
        <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-0">
          <span className="inline-block bg-secondary/80 px-3 py-1.5 text-base font-mono text-secondary-foreground">
            {major}
          </span>
          <span className="inline-block bg-muted px-3 py-1.5 text-base font-mono text-muted-foreground">{degree}</span>
        </div>

        {/* Metadata badges */}
        {hasMetadata && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {displayLocation && (
              <span className="rounded border border-border bg-muted px-2.5 py-0.5 text-sm text-foreground">
                {displayLocation}
              </span>
            )}
            {graduationDate && (
              <span className="rounded border border-border bg-muted px-2.5 py-0.5 text-sm text-foreground">
                {graduationDate}
              </span>
            )}
            {gpa && (
              <span className="ml-auto rounded border border-border bg-muted px-2.5 py-0.5 text-sm text-foreground">
                GPA: {gpa.split("/")[0]}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
