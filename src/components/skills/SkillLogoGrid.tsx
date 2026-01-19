/**
 * SkillLogoGrid - Display grid or row of skill technology logos
 *
 * Renders SVG logos for skills using simple-icons data.
 * Supports row layout (horizontal) or grid layout.
 * Optionally links each logo to the projects page filtered by that skill.
 */

import Link from "next/link";
import { cn } from "@/lib/utils";
import { getSkillIcon } from "@/lib/skill-icons";
import { TouchTarget } from "@/components/ui/TouchTarget";
import type { Skill } from "@/types/skills";

type LayoutType = "row" | "grid";
type SizeType = "sm" | "md" | "lg" | "responsive";

interface SkillLogoGridProps {
  /** Array of skills to display logos for */
  skills: Skill[];
  /** Layout style - row (horizontal flex) or grid */
  layout?: LayoutType;
  /** Size of logo icons. "responsive" = smaller on phone, larger on tablet+ */
  size?: SizeType;
  /** If true, wrap each logo in a link to /projects?skill=SkillName */
  linkToProjects?: boolean;
  /** Additional class names for the container */
  className?: string;
}

const sizeClasses: Record<SizeType, string> = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  responsive: "w-5 h-5 sm:w-9 sm:h-9", // 20px phone, 36px tablet+
};

const layoutClasses: Record<LayoutType, string> = {
  row: "flex flex-wrap items-center gap-0 sm:gap-4", // No gap on mobile (TouchTarget provides spacing)
  grid: "grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8",
};

/**
 * Renders a grid or row of skill logos
 *
 * @example
 * // Row of featured skills with links
 * <SkillLogoGrid
 *   skills={featuredSkills}
 *   layout="row"
 *   linkToProjects={true}
 * />
 *
 * @example
 * // Grid of all skills, no links
 * <SkillLogoGrid
 *   skills={allSkills}
 *   layout="grid"
 *   size="sm"
 * />
 */
export function SkillLogoGrid({
  skills,
  layout = "row",
  size = "md",
  linkToProjects = false,
  className,
}: SkillLogoGridProps) {
  // Filter to skills that have valid icons
  const skillsWithIcons = skills.filter((skill) => {
    if (!skill.iconSlug) return false;
    return getSkillIcon(skill.iconSlug) !== null;
  });

  return (
    <div className={cn(layoutClasses[layout], className)}>
      {skillsWithIcons.map((skill) => {
        const icon = getSkillIcon(skill.iconSlug!);
        if (!icon) return null;

        const logo = (
          <svg
            viewBox={icon.viewBox ?? "0 0 24 24"}
            className={cn(sizeClasses[size], "fill-current text-foreground/70")}
            aria-hidden="true"
            role="img"
          >
            <title>{icon.title}</title>
            <path d={icon.path} />
          </svg>
        );

        if (linkToProjects) {
          return (
            <TouchTarget key={skill.name} className="sm:min-h-0 sm:min-w-0">
              <Link
                href={`/projects?skill=${encodeURIComponent(skill.name)}`}
                className="transition-opacity hover:opacity-80"
                aria-label={`View projects using ${skill.name}`}
              >
                {logo}
              </Link>
            </TouchTarget>
          );
        }

        return <div key={skill.name}>{logo}</div>;
      })}
    </div>
  );
}
