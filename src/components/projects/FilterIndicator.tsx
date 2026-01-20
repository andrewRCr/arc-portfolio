/**
 * FilterIndicator component
 *
 * Displays active skill filters as dismissible badges with a clear all option.
 * Used on the Projects page to show which skills are currently filtering results.
 */

import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FilterIndicatorProps {
  skills: string[];
  onRemoveSkill: (skill: string) => void;
  onClearAll: () => void;
}

export default function FilterIndicator({
  skills,
  onRemoveSkill,
  onClearAll,
}: FilterIndicatorProps) {
  // Don't render anything if no skills selected
  if (skills.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground text-sm">Filtering by:</span>
      {skills.map((skill) => (
        <Badge key={skill} variant="secondary" className="gap-1 pr-1">
          {skill}
          <button
            type="button"
            onClick={() => onRemoveSkill(skill)}
            className="hover:bg-muted ml-0.5 rounded-full p-0.5 transition-colors"
            aria-label={`Remove ${skill} filter`}
          >
            <XIcon className="size-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-muted-foreground hover:text-foreground h-auto px-2 py-1 text-xs"
      >
        Clear all
      </Button>
    </div>
  );
}
