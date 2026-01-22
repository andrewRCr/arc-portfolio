/**
 * DetailCard Component
 *
 * Section card for project detail pages with semi-transparent header and body.
 * Header uses bg-card/80, body uses bg-background/80 for improved text readability.
 * Both sections share a unified border with rounded corners.
 */

import { cn } from "@/lib/utils";

interface DetailCardProps {
  /** Section title displayed in transparent header area */
  title: string;
  /** Content displayed in semi-transparent card body */
  children: React.ReactNode;
  /** Optional className for spacing/layout (e.g., "mt-8") */
  className?: string;
}

export function DetailCard({ title, children, className }: DetailCardProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border-strong", className)}>
      {/* Header */}
      <div className="px-4 py-3 bg-card/80">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      {/* Body - higher contrast background for body text readability */}
      <div className="bg-background/80 px-4 py-4">{children}</div>
    </div>
  );
}
