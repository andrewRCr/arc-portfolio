/**
 * Sample bio/about data demonstrating About interface usage
 *
 * Supports markdown syntax in paragraphs for links and emphasis.
 * In Phase 2, this will be replaced with actual bio from Squarespace
 * (3 paragraphs, ~150 words, including NexusMods link and career transition narrative).
 */

import { About } from "@/types/about";

export const about: About = {
  // Section heading
  heading: "About Me",

  // Array of paragraph text (supports markdown syntax)
  paragraphs: [
    "I'm a software developer with a passion for creating elegant solutions to complex problems. " +
      "My journey into software development began with a background in psychology, which gives me " +
      "a unique perspective on user experience and human-centered design.",

    "I specialize in full-stack web development with modern technologies like React, Next.js, and TypeScript. " +
      "I've also worked on game modifications that have been downloaded over [200,000 times](https://example.com/profile), " +
      "demonstrating my ability to create engaging user experiences.",

    "As a self-starter and continuous learner, I'm always exploring new technologies and best practices. " +
      "I believe in writing clean, maintainable code and following test-driven development principles.",
  ],

  // Optional highlighted achievements (not currently used in sample)
  // highlightedAchievements: [
  //   {
  //     label: "Downloads",
  //     value: "270K+",
  //     link: "https://nexusmods.com/profile",
  //   },
  // ],
};
