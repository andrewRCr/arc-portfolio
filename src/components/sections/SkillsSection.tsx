/**
 * SkillsSection - Modular component for displaying categorized technical skills
 *
 * Languages displayed as centered hero row (foundational, special treatment).
 * Other categories rendered in DetailCards with logo grids and text lists.
 * All skills link to filtered Projects view.
 * Used with PageLayout + PageHeader for consistent page structure.
 */

import Link from "next/link";
import { skills } from "@/data/skills";
import { DetailCard } from "@/components/projects/DetailCard";
import { SkillLogoGrid } from "@/components/skills/SkillLogoGrid";

// Categories to exclude from card grid (special treatment or removed)
const excludedCategories = ["Languages", "Methodologies"];

export function SkillsSection() {
  const languages = skills.Languages ?? [];
  const cardCategories = Object.entries(skills).filter(([cat]) => !excludedCategories.includes(cat));

  return (
    <section className="px-0 md:px-4">
      {/* Languages: foundational skills, centered hero-style */}
      {languages.length > 0 && (
        <div className="flex justify-center mb-6">
          <SkillLogoGrid skills={languages} layout="row" size="lg" linkToProjects={true} />
        </div>
      )}

      {/* Other categories in DetailCards */}
      <div className="grid gap-4 md:grid-cols-2">
        {cardCategories.map(([category, skillList]) => {
          const primarySkills = skillList.filter((s) => s.iconSlug);
          const secondarySkills = skillList.filter((s) => !s.iconSlug);

          return (
            <DetailCard key={category} title={category}>
              {/* Primary skills with logos */}
              {primarySkills.length > 0 && (
                <div className="flex justify-center">
                  <SkillLogoGrid skills={primarySkills} layout="row" size="md" linkToProjects={true} />
                </div>
              )}

              {/* Secondary skills as text list */}
              {secondarySkills.length > 0 && (
                <ul
                  className={`flex flex-wrap justify-center gap-x-4 gap-y-1 ${primarySkills.length > 0 ? "mt-4 pt-4 border-t border-border" : ""}`}
                >
                  {secondarySkills.map((skill) => (
                    <li key={skill.name}>
                      <Link
                        href={`/projects?skill=${encodeURIComponent(skill.name)}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {skill.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </DetailCard>
          );
        })}
      </div>
    </section>
  );
}
