/**
 * EducationSection - Modular component for displaying education credentials
 *
 * Renders academic degrees using EducationCard components.
 * Layout: Side-by-side on desktop (2-column grid), stacked on mobile.
 * On short viewports, hides section header to reclaim vertical space.
 */

"use client";

import { education } from "@/data/education";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { EducationCard } from "@/components/about/EducationCard";
import { useIsPhone, useIsShortViewport } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export function EducationSection() {
  const isPhone = useIsPhone();
  const compact = useIsShortViewport() && !isPhone;

  return (
    <section>
      {!compact && <SectionHeader title="Education" compact={isPhone} />}

      {/* Content with horizontal padding, 2-column grid on md+ */}
      <div
        className={cn(
          "grid grid-cols-1 gap-4 px-0 md:grid-cols-2 md:px-4",
          compact ? "mt-6" : isPhone ? "mt-2" : "mt-4"
        )}
      >
        {education.map((edu) => (
          <EducationCard key={edu.id} education={edu} />
        ))}
      </div>
    </section>
  );
}
