/**
 * Tests for project detail page generateMetadata functions.
 *
 * Verifies that dynamic metadata returns correct titles, descriptions,
 * and OG images for known projects, and empty metadata for unknown slugs.
 */

import { describe, it, expect } from "vitest";
import { generateMetadata as softwareMetadata } from "../software/[slug]/page";
import { generateMetadata as gamesMetadata } from "../games/[slug]/page";
import { generateMetadata as modsMetadata } from "../mods/[slug]/page";
import { projects } from "@/data/projects";
import { mods } from "@/data/mods";

// Helper to create the params shape expected by generateMetadata
const makeParams = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe("Software project metadata", () => {
  const knownProject = projects.find((p) => p.projectType === "software")!;

  it("returns title and description for a known project", async () => {
    const metadata = await softwareMetadata(makeParams(knownProject.slug));

    expect(metadata.title).toBe(knownProject.title);
    expect(metadata.description).toBe(knownProject.shortDescription);
  });

  it("returns OG image from project hero image", async () => {
    const metadata = await softwareMetadata(makeParams(knownProject.slug));

    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph!.images).toEqual([{ url: knownProject.images.hero }]);
  });

  it("returns empty metadata for unknown slug", async () => {
    const metadata = await softwareMetadata(makeParams("nonexistent-project"));

    expect(metadata).toEqual({});
  });
});

describe("Game project metadata", () => {
  const knownGame = projects.find((p) => p.projectType === "game")!;

  it("returns title and description for a known game", async () => {
    const metadata = await gamesMetadata(makeParams(knownGame.slug));

    expect(metadata.title).toBe(knownGame.title);
    expect(metadata.description).toBe(knownGame.shortDescription);
  });

  it("returns OG image from project hero image", async () => {
    const metadata = await gamesMetadata(makeParams(knownGame.slug));

    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph!.images).toEqual([{ url: knownGame.images.hero }]);
  });

  it("returns empty metadata for unknown slug", async () => {
    const metadata = await gamesMetadata(makeParams("nonexistent-game"));

    expect(metadata).toEqual({});
  });
});

describe("Mod project metadata", () => {
  const knownMod = mods[0];

  it("returns title and description for a known mod", async () => {
    const metadata = await modsMetadata(makeParams(knownMod.slug));

    expect(metadata.title).toBe(knownMod.title);
    expect(metadata.description).toBe(knownMod.shortDescription);
  });

  it("returns OG image from mod hero image", async () => {
    const metadata = await modsMetadata(makeParams(knownMod.slug));

    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph!.images).toEqual([{ url: knownMod.images.hero }]);
  });

  it("returns empty metadata for unknown slug", async () => {
    const metadata = await modsMetadata(makeParams("nonexistent-mod"));

    expect(metadata).toEqual({});
  });
});
