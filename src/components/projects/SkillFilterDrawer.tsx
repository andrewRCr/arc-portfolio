"use client";

/**
 * SkillFilterDrawer component
 *
 * Mobile-optimized bottom sheet variant of the skill filter.
 * Provides the same functionality as SkillFilterPopover but with
 * touch-friendly 44px targets and drawer-based navigation.
 */

import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { OverlayScrollbars } from "overlayscrollbars";
import { FilterIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileDrawer } from "@/components/ui/MobileDrawer";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollShadow } from "@/components/layout/ScrollShadow";
import { useScrollShadow } from "@/hooks/useScrollShadow";
import { skills as skillsData } from "@/data/skills";
import { SkillCategory } from "@/types/skills";
import { Project } from "@/types/project";

interface SkillFilterDrawerProps {
  allProjects: Project[];
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
}

// Categories to display (excluding Methodologies) - same as SkillFilterPopover
const DISPLAY_CATEGORIES: SkillCategory[] = [
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "DevOps & Infrastructure",
  "AI-Assisted Development",
  "Testing & Quality",
];

/**
 * Calculate the number of projects that contain a given skill in their tags
 */
function getProjectCountForSkill(projects: Project[], skillName: string): number {
  const normalizedSkill = skillName.toLowerCase();
  return projects.filter((project) => project.tags.some((tag) => tag.toLowerCase() === normalizedSkill)).length;
}

export default function SkillFilterDrawer({ allProjects, selectedSkills, onSkillsChange }: SkillFilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
  const { ref: scrollShadowRef, showTopShadow, showBottomShadow } = useScrollShadow();

  // Combined ref for CommandList - captures element for OverlayScrollbars
  const scrollRef = useCallback((node: HTMLElement | null) => {
    setScrollElement(node);
  }, []);

  // Initialize OverlayScrollbars on the scroll container
  useLayoutEffect(() => {
    if (!scrollElement) return;

    const instance = OverlayScrollbars(scrollElement, {
      scrollbars: {
        theme: "os-theme-dark",
        autoHide: "leave",
        autoHideDelay: 1000,
      },
    });

    // Connect OverlayScrollbars viewport to scroll shadow detection
    const { viewport } = instance.elements();
    scrollShadowRef(viewport);

    return () => {
      scrollShadowRef(null);
      instance.destroy();
    };
  }, [scrollElement, scrollShadowRef]);

  // Build categorized skills with project counts
  // Show skills that are: (curated for default filters OR currently selected) AND have matching projects
  const categorizedSkills = useMemo(() => {
    const result: Record<string, Array<{ name: string; count: number }>> = {};

    for (const category of DISPLAY_CATEGORIES) {
      const categorySkills = skillsData[category]
        .filter((skill) => skill.showInDefaultFilters || selectedSkills.includes(skill.name))
        .map((skill) => ({
          name: skill.name,
          count: getProjectCountForSkill(allProjects, skill.name),
        }))
        .filter((skill) => skill.count > 0); // Only skills with matching projects

      if (categorySkills.length > 0) {
        result[category] = categorySkills;
      }
    }

    return result;
  }, [allProjects, selectedSkills]);

  // Handle skill toggle
  const handleSkillToggle = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      onSkillsChange(selectedSkills.filter((s) => s !== skillName));
    } else {
      onSkillsChange([...selectedSkills, skillName]);
    }
  };

  // Handle clear all
  const handleClearAll = () => {
    onSkillsChange([]);
  };

  return (
    <MobileDrawer
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="ghost" size="sm" className="min-h-11 min-w-11">
          <FilterIcon className="size-4" />
          Filter{selectedSkills.length > 0 && ` (${selectedSkills.length})`}
        </Button>
      }
      title="Filter"
      aria-describedby={undefined}
      fillHeight
    >
      <Command shouldFilter={true} className="flex flex-col flex-1 min-h-0">
        <CommandInput
          placeholder="Search..."
          aria-label="Search skills"
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="mx-3"
        />

        {/* Scrollable skill list with scroll shadows */}
        <div className="relative flex-1 min-h-0 border-b border-border" data-drawer="skill-filter">
          <ScrollShadow position="top" visible={showTopShadow} />
          <CommandList ref={scrollRef} className="h-full overflow-y-auto max-h-none px-3">
            <CommandEmpty>No skills found</CommandEmpty>
            {Object.entries(categorizedSkills).map(([category, skills]) => (
              <CommandGroup className="mt-2" key={category} heading={category}>
                {skills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill.name);
                  return (
                    <CommandItem
                      key={skill.name}
                      value={skill.name}
                      onSelect={() => handleSkillToggle(skill.name)}
                      data-skill-item
                      role="checkbox"
                      aria-checked={isSelected}
                      className="min-h-11 flex items-center gap-3 px-3 [-webkit-tap-highlight-color:transparent]"
                    >
                      <div
                        aria-hidden="true"
                        className={`flex size-5 shrink-0 items-center justify-center border-2 ${
                          isSelected
                            ? "border-secondary bg-secondary text-secondary-foreground"
                            : "border-border-strong"
                        }`}
                      >
                        {isSelected && <CheckIcon className="size-3.5 text-secondary-foreground" />}
                      </div>
                      <span className="flex-1">{skill.name}</span>
                      <span className="text-xs opacity-60">({skill.count})</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
          <ScrollShadow position="bottom" visible={showBottomShadow} />
        </div>

        {/* Clear all button - always visible for stable height */}
        <div className="flex justify-center pt-3 mx-3">
          <Button
            variant="ghost"
            size="sm"
            className="min-h-11"
            onClick={handleClearAll}
            disabled={selectedSkills.length === 0}
          >
            Clear all
          </Button>
        </div>
      </Command>
    </MobileDrawer>
  );
}
