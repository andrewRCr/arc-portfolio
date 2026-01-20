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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Skill } from "@/types/skills";

type LayoutType = "row" | "grid";
type SizeType = "sm" | "md" | "lg" | "responsive" | "responsiveLg";
type GapType = "tight" | "relaxed";

interface SkillLogoGridProps {
  /** Array of skills to display logos for */
  skills: Skill[];
  /** Layout style - row (horizontal flex) or grid */
  layout?: LayoutType;
  /** Size of logo icons. "responsive" = smaller on phone, larger on tablet+ */
  size?: SizeType;
  /** Gap between icons on mobile. Both use same tablet+ spacing. */
  gap?: GapType;
  /** If true, wrap each logo in a link to /projects?skills=SkillName */
  linkToProjects?: boolean;
  /** Additional class names for the container */
  className?: string;
}

const sizeClasses: Record<SizeType, string> = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  responsive: "w-7 h-7 sm:w-12 sm:h-12",
  responsiveLg: "w-11 h-11 sm:w-12 sm:h-12",
};

const layoutClasses: Record<LayoutType, string> = {
  row: "flex flex-wrap items-center justify-center",
  grid: "grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8",
};

// Gap classes for row layout (grid has its own gap)
const rowGapClasses: Record<GapType, string> = {
  tight: "gap-x-2 gap-y-0 sm:gap-6",
  relaxed: "gap-x-5 gap-y-0 sm:gap-6",
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
  gap = "tight",
  linkToProjects = false,
  className,
}: SkillLogoGridProps) {
  // Filter to skills that have valid icons
  const skillsWithIcons = skills.filter((skill) => {
    if (!skill.iconSlug) return false;
    return getSkillIcon(skill.iconSlug) !== null;
  });

  // Apply row gap classes only for row layout (grid has built-in gap)
  const gapClass = layout === "row" ? rowGapClasses[gap] : "";

  return (
    <div className={cn(layoutClasses[layout], gapClass, className)}>
      {skillsWithIcons.flatMap((skill, index) => {
        const icon = getSkillIcon(skill.iconSlug!);
        if (!icon) return [];

        const logo = (
          <svg
            viewBox={icon.viewBox ?? "0 0 24 24"}
            className={cn(sizeClasses[size], "fill-current text-foreground/70")}
            aria-hidden="true"
          >
            <path d={icon.path} />
          </svg>
        );

        const element = linkToProjects ? (
          <TouchTarget key={skill.name} className="-mx-1 sm:mx-0 sm:min-h-0 sm:min-w-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/projects?skills=${encodeURIComponent(skill.name)}`}
                  className="transition-opacity hover:opacity-80"
                  aria-label={`View projects using ${skill.name}`}
                >
                  {logo}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">{skill.name}</TooltipContent>
            </Tooltip>
          </TouchTarget>
        ) : (
          <Tooltip key={skill.name}>
            <TooltipTrigger asChild>
              <div className="cursor-default">{logo}</div>
            </TooltipTrigger>
            <TooltipContent side="bottom">{skill.name}</TooltipContent>
          </Tooltip>
        );

        // Insert line break after 5th item on mobile for 10-icon layout (5/5 split)
        // Skip for 6 or fewer icons (single row on mobile)
        if (index === 4 && layout === "row" && skillsWithIcons.length > 6) {
          return [element, <div key="break" className="w-full sm:hidden" aria-hidden="true" />];
        }

        return [element];
      })}
    </div>
  );
}
