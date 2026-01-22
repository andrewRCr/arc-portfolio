/**
 * EducationSection - Modular component for displaying education credentials
 *
 * Renders academic degrees using EducationCard components.
 * Layout: Side-by-side on desktop (2-column grid), stacked on mobile.
 */

import { education } from "@/data/education";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { EducationCard } from "@/components/about/EducationCard";

export function EducationSection() {
  return (
    <section>
      <SectionHeader title="Education" />

      {/* Content with horizontal padding, 2-column grid on md+ */}
      <div className="mt-4 grid grid-cols-1 gap-4 px-0 md:grid-cols-2 md:px-4">
        {education.map((edu) => (
          <EducationCard key={edu.id} education={edu} />
        ))}
      </div>
    </section>
  );
}
