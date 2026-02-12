/**
 * SkillsSection - Modular component for displaying categorized technical skills
 *
 * Languages displayed as centered hero row (foundational, special treatment).
 * Other categories rendered in DetailCards with logo grids and text lists.
 * All skills link to filtered Projects view.
 * Used with PageLayout + PageHeader for consistent page structure.
 */

"use client";

import Link from "next/link";
import { skills } from "@/data/skills";
import { DetailCard } from "@/components/projects/DetailCard";
import { SkillLogoGrid } from "@/components/skills/SkillLogoGrid";
import { TouchTarget } from "@/components/common/TouchTarget";
import { useIsPhone, useIsShortViewport } from "@/hooks/useMediaQuery";
import { useDelayedShow } from "@/hooks/useDelayedShow";

// Categories to exclude from card grid (special treatment or removed)
const excludedCategories = ["Languages", "Methodologies"];

// Mobile: curated subset (skip HTML, CSS - implied by primary languages)
const mobileLanguageOrder = ["TypeScript", "JavaScript", "Python", "C#", "C++"];

export function SkillsSection() {
  const isPhone = useIsPhone();
  const isShortViewport = useIsShortViewport();
  const compact = !isPhone && isShortViewport;
  const allLanguages = skills.Languages ?? [];

  // Delay showing languages row to avoid hydration flash (mobile vs desktop curation)
  const showLanguages = useDelayedShow(150);

  // On mobile, show curated subset; on desktop, show all
  const languages = isPhone
    ? mobileLanguageOrder
        .map((name) => allLanguages.find((l) => l.name === name))
        .filter((skill): skill is NonNullable<typeof skill> => skill !== undefined)
    : allLanguages;

  const cardCategories = Object.entries(skills).filter(([cat]) => !excludedCategories.includes(cat));

  return (
    <section className="px-0 md:px-4">
      {/* Languages: foundational skills, centered hero-style */}
      {languages.length > 0 && (
        <div
          className={`flex justify-center ${compact ? "mb-5" : "mb-8"} transition-opacity duration-300 ${showLanguages ? "opacity-100" : "opacity-0"}`}
        >
          <SkillLogoGrid
            skills={languages}
            layout="row"
            size={compact ? "responsiveMd" : "responsiveLg"}
            gap="relaxed"
            linkToProjects={true}
          />
        </div>
      )}

      {/* Other categories in DetailCards */}
      <div className={`grid md:grid-cols-2 ${compact ? "gap-3.5" : "gap-5"}`}>
        {cardCategories.map(([category, skillList]) => {
          const primarySkills = skillList.filter((s) => s.iconSlug);
          const secondarySkills = skillList.filter((s) => !s.iconSlug);

          // Skip empty categories
          if (primarySkills.length === 0 && secondarySkills.length === 0) {
            return null;
          }

          return (
            <DetailCard key={category} title={category} compact={compact || isPhone}>
              {/* Primary skills with logos */}
              {primarySkills.length > 0 && (
                <div className="flex justify-center">
                  <SkillLogoGrid skills={primarySkills} layout="row" size="md" linkToProjects={true} />
                </div>
              )}

              {/* Secondary skills as text list */}
              {secondarySkills.length > 0 && (
                <ul
                  className={`flex flex-wrap justify-center gap-x-4 gap-y-0 ${primarySkills.length > 0 ? `${compact ? "mt-2 pt-2" : "mt-4 pt-4"} border-t border-border` : ""}`}
                >
                  {secondarySkills.map((skill) => (
                    <li key={skill.name}>
                      <TouchTarget className="-mx-1 -my-2 sm:mx-0 sm:my-0 sm:min-h-0 sm:min-w-0">
                        <Link
                          href={`/projects?skills=${encodeURIComponent(skill.name)}`}
                          className="font-body text-sm text-muted-foreground transition-colors hover:text-secondary dark:hover:text-secondary-high"
                        >
                          {skill.name}
                        </Link>
                      </TouchTarget>
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
