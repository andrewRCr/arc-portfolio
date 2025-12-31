/**
 * EducationSection - Modular component for displaying education credentials
 *
 * Renders academic degrees with institution and optional details (location, dates, GPA).
 */

import { education } from "@/data/education";

export function EducationSection() {
  return (
    <section className="px-8">
      {/* <h2 className="mb-8 text-3xl font-bold">Education</h2> */}

      <ul className="space-y-6">
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
