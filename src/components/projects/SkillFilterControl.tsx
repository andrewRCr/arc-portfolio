"use client";

/**
 * SkillFilterControl component
 *
 * Responsive wrapper that renders SkillFilterPopover on desktop and
 * SkillFilterDrawer on mobile. Uses CSS-based ResponsiveSwitch to
 * prevent hydration flash.
 */

import { ResponsiveSwitch } from "@/components/common/ResponsiveSwitch";
import SkillFilterPopover from "./SkillFilterPopover";
import SkillFilterDrawer from "./SkillFilterDrawer";
import { Project } from "@/types/project";

interface SkillFilterControlProps {
  allProjects: Project[];
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
}

export default function SkillFilterControl({ allProjects, selectedSkills, onSkillsChange }: SkillFilterControlProps) {
  return (
    <ResponsiveSwitch
      breakpoint="sm"
      mobile={
        <SkillFilterDrawer allProjects={allProjects} selectedSkills={selectedSkills} onSkillsChange={onSkillsChange} />
      }
      desktop={
        <SkillFilterPopover allProjects={allProjects} selectedSkills={selectedSkills} onSkillsChange={onSkillsChange} />
      }
    />
  );
}
