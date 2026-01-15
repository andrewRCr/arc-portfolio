import { describe, it, expect } from "vitest";
import { buildLinkItems, buildIconLinkItems } from "../buildLinkItems";
import { Github, Globe, Download } from "lucide-react";
import { NexusModsIcon } from "@/components/icons/NexusModsIcon";
import type { ProjectLinks } from "@/types/project";

describe("buildLinkItems", () => {
  describe("buildLinkItems()", () => {
    it("returns empty array when links is undefined", () => {
      expect(buildLinkItems(undefined)).toEqual([]);
    });

    it("returns empty array when links object has no valid links", () => {
      const links: ProjectLinks = {};
      expect(buildLinkItems(links)).toEqual([]);
    });

    it("builds link item for github", () => {
      const links: ProjectLinks = { github: "https://github.com/test/repo" };
      expect(buildLinkItems(links)).toEqual([{ href: "https://github.com/test/repo", label: "GitHub" }]);
    });

    it("builds link item for liveDemo with full label", () => {
      const links: ProjectLinks = { liveDemo: "https://example.com" };
      expect(buildLinkItems(links)).toEqual([{ href: "https://example.com", label: "Live Demo" }]);
    });

    it("builds link item for liveDemo with compact label", () => {
      const links: ProjectLinks = { liveDemo: "https://example.com" };
      expect(buildLinkItems(links, true)).toEqual([{ href: "https://example.com", label: "Demo" }]);
    });

    it("builds link item for download", () => {
      const links: ProjectLinks = { download: "https://example.com/download" };
      expect(buildLinkItems(links)).toEqual([{ href: "https://example.com/download", label: "Download" }]);
    });

    it("builds link item for external (NexusMods)", () => {
      const links: ProjectLinks = { external: "https://nexusmods.com/test" };
      expect(buildLinkItems(links)).toEqual([{ href: "https://nexusmods.com/test", label: "NexusMods" }]);
    });

    it("builds multiple link items in correct order", () => {
      const links: ProjectLinks = {
        github: "https://github.com/test",
        liveDemo: "https://demo.com",
        download: "https://download.com",
        external: "https://nexusmods.com",
      };
      const result = buildLinkItems(links);
      expect(result).toHaveLength(4);
      expect(result[0].label).toBe("GitHub");
      expect(result[1].label).toBe("Live Demo");
      expect(result[2].label).toBe("Download");
      expect(result[3].label).toBe("NexusMods");
    });

    it("filters out undefined links", () => {
      const links: ProjectLinks = {
        github: "https://github.com/test",
        liveDemo: undefined,
        download: "https://download.com",
      };
      const result = buildLinkItems(links);
      expect(result).toHaveLength(2);
      expect(result.map((l) => l.label)).toEqual(["GitHub", "Download"]);
    });
  });

  describe("buildIconLinkItems()", () => {
    it("returns empty array when links is undefined", () => {
      expect(buildIconLinkItems(undefined)).toEqual([]);
    });

    it("returns empty array when links object has no valid links", () => {
      const links: ProjectLinks = {};
      expect(buildIconLinkItems(links)).toEqual([]);
    });

    it("builds icon link for github", () => {
      const links: ProjectLinks = { github: "https://github.com/test" };
      const result = buildIconLinkItems(links);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        href: "https://github.com/test",
        label: "GitHub",
        icon: Github,
        ariaLabel: "View on GitHub",
      });
    });

    it("builds icon link for liveDemo", () => {
      const links: ProjectLinks = { liveDemo: "https://demo.com" };
      const result = buildIconLinkItems(links);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        href: "https://demo.com",
        label: "Demo",
        icon: Globe,
        ariaLabel: "View live demo",
      });
    });

    it("builds icon link for download", () => {
      const links: ProjectLinks = { download: "https://download.com/app" };
      const result = buildIconLinkItems(links);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        href: "https://download.com/app",
        label: "Download",
        icon: Download,
        ariaLabel: "Download app",
      });
    });

    it("builds icon link for external (NexusMods)", () => {
      const links: ProjectLinks = { external: "https://nexusmods.com/mod" };
      const result = buildIconLinkItems(links);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        href: "https://nexusmods.com/mod",
        label: "NexusMods",
        icon: NexusModsIcon,
        ariaLabel: "View on NexusMods",
      });
    });

    it("builds multiple icon links in correct order", () => {
      const links: ProjectLinks = {
        github: "https://github.com/test",
        liveDemo: "https://demo.com",
        download: "https://download.com",
        external: "https://nexusmods.com",
      };
      const result = buildIconLinkItems(links);
      expect(result).toHaveLength(4);
      expect(result.map((l) => l.label)).toEqual(["GitHub", "Demo", "Download", "NexusMods"]);
    });

    it("only includes links that are defined", () => {
      const links: ProjectLinks = {
        github: "https://github.com/test",
        external: "https://nexusmods.com",
      };
      const result = buildIconLinkItems(links);
      expect(result).toHaveLength(2);
      expect(result.map((l) => l.label)).toEqual(["GitHub", "NexusMods"]);
    });
  });
});
