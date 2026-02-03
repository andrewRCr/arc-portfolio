"use client";

/**
 * TechStackScroller component
 *
 * Displays tech stack badges in a horizontally scrollable container with
 * scroll-snap behavior. Uses CSS mask gradients to indicate scrollable content.
 *
 * At full width: all badges fit, no scroll needed, looks like normal flex row.
 * At narrow widths: horizontal scroll with snap-to-badge behavior and edge fades.
 */

import { useState, useEffect, useCallback } from "react";

interface TechStackScrollerProps {
  /** Array of technology names to display */
  techStack: string[];
  /** Badge size variant */
  size?: "sm" | "md";
  /** Whether scrolling is enabled. Disable for cards where parent handles click. */
  scrollable?: boolean;
  /** Additional class for the container */
  className?: string;
}

/** Threshold in pixels from edge to consider "at edge" */
const SCROLL_THRESHOLD = 10;

export function TechStackScroller({
  techStack,
  size = "md",
  scrollable = true,
  className = "",
}: TechStackScrollerProps) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [scrollState, setScrollState] = useState<"none" | "left" | "right" | "both">("none");

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const evaluate = () => {
      const hasOverflow = element.scrollWidth > element.clientWidth;

      if (!hasOverflow) {
        setScrollState("none");
        return;
      }

      const atLeft = element.scrollLeft <= SCROLL_THRESHOLD;
      const distanceFromRight = element.scrollWidth - element.clientWidth - element.scrollLeft;
      const atRight = distanceFromRight <= SCROLL_THRESHOLD;

      if (atLeft && atRight) {
        // Shouldn't happen if hasOverflow, but handle it
        setScrollState("none");
      } else if (atLeft) {
        // At left edge, can scroll right - fade right edge
        setScrollState("right");
      } else if (atRight) {
        // At right edge, can scroll left - fade left edge
        setScrollState("left");
      } else {
        // In middle, can scroll both ways - fade both edges
        setScrollState("both");
      }
    };

    element.addEventListener("scroll", evaluate);
    const resizeObserver = new ResizeObserver(evaluate);
    resizeObserver.observe(element);
    evaluate();

    return () => {
      element.removeEventListener("scroll", evaluate);
      resizeObserver.disconnect();
    };
  }, [element]);

  // Size-based styling
  const badgeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-xs" // ProjectCard size
      : "px-3 py-1 text-sm"; // ProjectDetail size (default)

  // Scroll padding matches fade zone width (24px) so badges don't snap under fades
  const containerClasses = scrollable
    ? "flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-padding-inline"
    : "flex gap-2 overflow-x-hidden";

  const badgeSnapClass = scrollable ? "snap-start" : "";

  return (
    <div ref={ref} data-scroll-fade={scrollState} className={`${containerClasses} ${className}`}>
      {techStack.map((tech) => (
        <span
          key={tech}
          className={`shrink-0 ${badgeSnapClass} border border-border bg-surface-muted font-terminal ${badgeClasses} text-foreground`}
        >
          {tech}
        </span>
      ))}
    </div>
  );
}
