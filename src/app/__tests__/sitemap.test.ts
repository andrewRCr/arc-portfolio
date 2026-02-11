/**
 * Tests for sitemap generation.
 *
 * Verifies that all public routes are present, no dev/API routes leak through,
 * and dynamic project routes are generated from data.
 */

import { describe, it, expect } from "vitest";
import sitemap from "../sitemap";
import { SITE } from "@/config/site";
import { projects } from "@/data/projects";
import { mods } from "@/data/mods";

const entries = sitemap();
const urls = entries.map((e) => e.url);

describe("Sitemap", () => {
  describe("static routes", () => {
    it("includes homepage", () => {
      expect(urls).toContain(SITE.url);
    });

    it.each(["/projects", "/skills", "/about", "/contact"])("includes %s", (path) => {
      expect(urls).toContain(`${SITE.url}${path}`);
    });
  });

  describe("dynamic project routes", () => {
    it("includes all software projects", () => {
      const softwareProjects = projects.filter((p) => p.projectType === "software");

      for (const project of softwareProjects) {
        expect(urls).toContain(`${SITE.url}/projects/software/${project.slug}`);
      }
    });

    it("includes all game projects", () => {
      const gameProjects = projects.filter((p) => p.projectType === "game");

      for (const project of gameProjects) {
        expect(urls).toContain(`${SITE.url}/projects/games/${project.slug}`);
      }
    });

    it("includes all mod projects", () => {
      for (const mod of mods) {
        expect(urls).toContain(`${SITE.url}/projects/mods/${mod.slug}`);
      }
    });
  });

  describe("excluded routes", () => {
    it("does not include any /dev/ routes", () => {
      const devUrls = urls.filter((u) => u.includes("/dev/"));
      expect(devUrls).toEqual([]);
    });

    it("does not include any /api/ routes", () => {
      const apiUrls = urls.filter((u) => u.includes("/api/"));
      expect(apiUrls).toEqual([]);
    });
  });

  describe("metadata fields", () => {
    it("sets homepage as highest priority", () => {
      const home = entries.find((e) => e.url === SITE.url);
      expect(home?.priority).toBe(1);
    });

    it("sets changeFrequency on all entries", () => {
      for (const entry of entries) {
        expect(entry.changeFrequency).toBeDefined();
      }
    });
  });
});
