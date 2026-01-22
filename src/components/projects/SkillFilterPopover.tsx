"use client";

/**
 * SkillFilterPopover component
 *
 * Provides a searchable, categorized skill filter for the Projects page.
 * Skills are organized by category and filtered to only show those with
 * icons and matching projects.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { FilterIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { skills as skillsData } from "@/data/skills";
import { SkillCategory } from "@/types/skills";
import { Project } from "@/types/project";

interface SkillFilterPopoverProps {
  allProjects: Project[];
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
}

// Categories to display (excluding Methodologies)
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

export default function SkillFilterPopover({ allProjects, selectedSkills, onSkillsChange }: SkillFilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Reset search when popover closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery("");
    }
  };

  // Workaround for Radix bug #2782: after interacting inside a Popover,
  // the first outside click is swallowed. This listener ensures single-click close.
  // See: https://github.com/radix-ui/primitives/issues/2782
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Element;
      const popoverContent = document.querySelector('[data-slot="popover-content"]');
      const isInsideTrigger = triggerRef.current?.contains(target);
      const isInsideContent = popoverContent?.contains(target);

      if (!isInsideTrigger && !isInsideContent) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, { capture: true });
    return () => document.removeEventListener("pointerdown", handlePointerDown, { capture: true });
  }, [open]);

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
    <Popover open={open} onOpenChange={handleOpenChange} modal={true}>
      <PopoverTrigger asChild>
        <Button ref={triggerRef} variant="ghost" size="sm" aria-haspopup="dialog">
          <FilterIcon className="size-4" />
          Filter{selectedSkills.length > 0 && ` (${selectedSkills.length})`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <Command shouldFilter={true}>
          <CommandInput
            placeholder="Search..."
            aria-label="Search skills"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No skills found</CommandEmpty>
            {Object.entries(categorizedSkills).map(([category, skills]) => (
              <CommandGroup key={category} heading={category}>
                {skills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill.name);
                  return (
                    <CommandItem
                      key={skill.name}
                      value={skill.name}
                      onSelect={() => handleSkillToggle(skill.name)}
                      role="checkbox"
                      aria-checked={isSelected}
                      className="flex items-center gap-2"
                    >
                      <div
                        aria-hidden="true"
                        className={`flex size-4 shrink-0 items-center justify-center rounded-sm border-2 ${
                          isSelected
                            ? "border-secondary bg-secondary text-secondary-foreground"
                            : "border-border-strong"
                        }`}
                      >
                        {isSelected && <CheckIcon className="size-3 text-secondary-foreground" />}
                      </div>
                      <span className="flex-1">{skill.name}</span>
                      <span className="text-xs opacity-60">({skill.count})</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
          {selectedSkills.length > 0 && (
            <div className="flex justify-center border-t p-2">
              <Button variant="ghost" size="sm" onClick={handleClearAll}>
                Clear all
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
