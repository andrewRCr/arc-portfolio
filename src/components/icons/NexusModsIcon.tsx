/**
 * NexusMods Icon
 *
 * Custom outline-style icon based on NexusMods branding.
 * Represents their pinwheel/vortex logo with 4 curved arrows pointing inward.
 * Styled to match lucide-react icons (stroke-based, currentColor).
 */

import type { SVGProps } from "react";

export interface NexusModsIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function NexusModsIcon({ size = 24, ...props }: NexusModsIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Four curved arrows pointing inward (pinwheel pattern), rotated 90° */}
      <g transform="rotate(45 12 12)">
        {/* Top arrow */}
        <path d="M12 3c-2 2-2 4 0 6" />
        <path d="M12 9l-2-2h4l-2 2" />
        {/* Right arrow */}
        <path d="M21 12c-2-2-4-2-6 0" />
        <path d="M15 12l2-2v4l-2-2" />
        {/* Bottom arrow */}
        <path d="M12 21c2-2 2-4 0-6" />
        <path d="M12 15l2 2h-4l2-2" />
        {/* Left arrow */}
        <path d="M3 12c2 2 4 2 6 0" />
        <path d="M9 12l-2 2v-4l2 2" />
      </g>
    </svg>
  );
}
