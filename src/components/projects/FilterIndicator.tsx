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

export default function FilterIndicator({ skills, onRemoveSkill, onClearAll }: FilterIndicatorProps) {
  // Don't render anything if no skills selected
  if (skills.length === 0) {
    return null;
  }

  return (
    <div className="mx-7 flex min-h-11 flex-wrap items-center gap-x-2 gap-y-2 border-b border-border/50 pb-2 sm:items-end">
      <span className="text-muted-foreground text-sm sm:pb-0.5">Filtering by:</span>
      {/* Badges + Clear all grouped together so they wrap as a unit */}
      <div className="flex flex-wrap items-center gap-1.5">
        {skills.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="gap-1 pr-1 cursor-pointer sm:cursor-default [-webkit-tap-highlight-color:transparent] will-change-transform"
            onClick={() => onRemoveSkill(skill)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onRemoveSkill(skill);
              }
            }}
            aria-label={`Remove ${skill} filter`}
          >
            {skill}
            <XIcon className="size-3 ml-0.5 opacity-60" aria-hidden="true" />
          </Badge>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="min-h-11 sm:min-h-0 sm:h-auto px-2 py-1 text-xs text-muted-foreground hover:text-accent-foreground will-change-transform"
          aria-label="Clear all filters"
        >
          Clear all
        </Button>
      </div>
    </div>
  );
}
