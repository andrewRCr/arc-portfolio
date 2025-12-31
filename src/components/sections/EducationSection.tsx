/**
 * EducationSection - Modular component for displaying education credentials
 *
 * Renders academic degrees with institution and optional details (location, dates, GPA).
 */

import { education } from "@/data/education";
import { SectionHeader } from "@/components/layout/SectionHeader";

export function EducationSection() {
  return (
    <section>
      <SectionHeader title="Education" />

      {/* Content with horizontal padding */}
      <ul className="mt-4 space-y-6 px-8">
        {education.map((edu) => (
          <li key={edu.id} data-testid={`education-${edu.id}`} className="rounded-lg border border-border p-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {edu.degree} in {edu.major}
              </h3>
              <p className="text-lg text-foreground">{edu.institution}</p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {edu.location && <span>{edu.location}</span>}
                {edu.graduationDate && <span>{edu.graduationDate}</span>}
                {edu.gpa && <span>GPA: {edu.gpa}</span>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
