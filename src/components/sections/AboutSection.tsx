/**
 * AboutSection - Modular component for displaying biographical content
 *
 * Renders bio paragraphs with basic markdown link support [text](url).
 * Designed to be reusable across multiple pages (e.g., /about, homepage).
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
        className="text-blue-600 hover:text-blue-800 underline"
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
    <section className="p-8">
      <h2 className="mb-8 text-3xl font-bold">{about.heading}</h2>

      <div className="space-y-4 text-gray-700">
        {about.paragraphs.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {parseMarkdownLinks(paragraph)}
          </p>
        ))}
      </div>

      {about.highlightedAchievements && about.highlightedAchievements.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {about.highlightedAchievements.map((achievement, index) => (
            <div key={index} className="rounded-lg border border-gray-300 p-4 text-center">
              <p className="text-3xl font-bold text-gray-900">{achievement.value}</p>
              <p className="text-sm text-gray-600">{achievement.label}</p>
              {achievement.link && (
                <a
                  href={achievement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-800"
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
