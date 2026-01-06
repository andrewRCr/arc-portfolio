/**
 * AboutSection - Modular component for displaying biographical content
 *
 * Renders bio paragraphs with basic markdown link support [text](url).
 */

import React from "react";
import { about } from "@/data/about";

/**
 * Simple markdown link parser
 * Converts [text](url) to <a> elements with external link attributes
 */
function parseMarkdownLinks(text: string): React.ReactElement[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactElement[] = [];
  let lastIndex = 0;
  let match;
  let keyIndex = 0;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${keyIndex++}`}>{text.substring(lastIndex, match.index)}</span>);
    }

    // Add the link
    const linkText = match[1];
    const url = match[2];
    parts.push(
      <a
        key={`link-${keyIndex++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:text-accent/80 underline"
      >
        {linkText}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last link
  if (lastIndex < text.length) {
    parts.push(<span key={`text-${keyIndex++}`}>{text.substring(lastIndex)}</span>);
  }

  return parts;
}

export function AboutSection() {
  return (
    <section className="px-0 md:px-4 py-2">
      <div className="rounded-lg border border-border p-6">
        <div className="space-y-4 text-foreground">
          {about.paragraphs.map((paragraph, index) => (
            <p key={index} className="leading-relaxed">
              {parseMarkdownLinks(paragraph)}
            </p>
          ))}
        </div>
      </div>

      {about.highlightedAchievements && about.highlightedAchievements.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {about.highlightedAchievements.map((achievement) => (
            <div key={achievement.label} className="rounded-lg border border-border p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{achievement.value}</p>
              <p className="text-sm text-muted-foreground">{achievement.label}</p>
              {achievement.link && (
                <a
                  href={achievement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-accent hover:text-accent/80 underline"
                >
                  View →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
