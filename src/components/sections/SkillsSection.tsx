/**
 * SkillsSection - Modular component for displaying categorized technical skills
 *
 * Renders skills data organized by category (Languages, Frontend, Backend, etc.)
 */

import { skills } from "@/data/skills";

export function SkillsSection() {
  return (
    <section className="p-8">
      <h2 className="mb-8 text-3xl font-bold">Skills & Technologies</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category} className="rounded-lg border border-border p-4">
            <h3 className="mb-3 text-xl font-semibold">{category}</h3>
            <ul className="space-y-1">
              {skillList.map((skill) => (
                <li key={skill} className="text-sm text-foreground">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
