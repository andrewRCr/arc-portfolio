/**
 * EducationSection - Modular component for displaying education credentials
 *
 * Renders academic degrees with institution and optional details (location, dates, GPA).
 * Designed to be reusable across multiple pages (e.g., /about, homepage).
 */

import { education } from "@/data/education";

export function EducationSection() {
  return (
    <section className="p-8">
      <h2 className="mb-8 text-3xl font-bold">Education</h2>

      <ul className="space-y-6">
        {education.map((edu, index) => (
          <li key={index} className="rounded-lg border border-gray-300 p-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {edu.degree} in {edu.major}
              </h3>
              <p className="text-lg text-gray-700">{edu.institution}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {edu.location && <span>{edu.location}</span>}
                {edu.graduationDate && <span>{edu.graduationDate}</span>}
                {edu.gpa && <span>GPA: {edu.gpa}</span>}
              </div>

              {edu.honors && edu.honors.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">Honors:</p>
                  <ul className="ml-4 list-disc text-sm text-gray-600">
                    {edu.honors.map((honor, i) => (
                      <li key={i}>{honor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
