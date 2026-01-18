/**
 * Tests for NexusMods utility functions
 */

import { describe, it, expect } from "vitest";
import { parseNexusModsUrl, formatStatNumber, buildNexusModsUrl } from "../nexusmods";

describe("parseNexusModsUrl", () => {
  it("parses a standard NexusMods URL", () => {
    const result = parseNexusModsUrl("https://www.nexusmods.com/liesofp/mods/304");
    expect(result).toEqual({ game: "liesofp", modId: 304 });
  });

  it("parses URL without www prefix", () => {
    const result = parseNexusModsUrl("https://nexusmods.com/eldenring/mods/5128");
    expect(result).toEqual({ game: "eldenring", modId: 5128 });
  });

  it("parses URL with trailing slash", () => {
    const result = parseNexusModsUrl("https://www.nexusmods.com/silenthill2/mods/199/");
    expect(result).toEqual({ game: "silenthill2", modId: 199 });
  });

  it("parses URL with query parameters", () => {
    const result = parseNexusModsUrl("https://www.nexusmods.com/doom/mods/59?tab=files");
    expect(result).toEqual({ game: "doom", modId: 59 });
  });

  it("parses game domains with numbers", () => {
    const result = parseNexusModsUrl("https://www.nexusmods.com/residentevil42023/mods/3016");
    expect(result).toEqual({ game: "residentevil42023", modId: 3016 });
  });

  it("returns null for non-NexusMods URLs", () => {
    const result = parseNexusModsUrl("https://github.com/user/repo");
    expect(result).toBeNull();
  });

  it("returns null for invalid mod path format", () => {
    const result = parseNexusModsUrl("https://www.nexusmods.com/liesofp/files/304");
    expect(result).toBeNull();
  });

  it("returns null for non-numeric mod ID", () => {
    const result = parseNexusModsUrl("https://www.nexusmods.com/liesofp/mods/abc");
    expect(result).toBeNull();
  });

  it("returns null for malformed URLs", () => {
    const result = parseNexusModsUrl("not-a-valid-url");
    expect(result).toBeNull();
  });

  it("returns null for empty string", () => {
    const result = parseNexusModsUrl("");
    expect(result).toBeNull();
  });

  it("handles next.nexusmods.com subdomain", () => {
    const result = parseNexusModsUrl("https://next.nexusmods.com/liesofp/mods/304");
    expect(result).toEqual({ game: "liesofp", modId: 304 });
  });
});

describe("formatStatNumber", () => {
  describe("numbers under 1000", () => {
    it("returns number as-is for small values", () => {
      expect(formatStatNumber(0)).toBe("0");
      expect(formatStatNumber(1)).toBe("1");
      expect(formatStatNumber(999)).toBe("999");
    });
  });

  describe("thousands (K)", () => {
    it("formats exactly 1000 as 1K", () => {
      expect(formatStatNumber(1000)).toBe("1K");
    });

    it("formats with one decimal place by default", () => {
      expect(formatStatNumber(1234)).toBe("1.2K");
      expect(formatStatNumber(1500)).toBe("1.5K");
      expect(formatStatNumber(15300)).toBe("15.3K");
    });

    it("removes trailing .0", () => {
      expect(formatStatNumber(2000)).toBe("2K");
      expect(formatStatNumber(10000)).toBe("10K");
    });

    it("handles edge case near million", () => {
      expect(formatStatNumber(999000)).toBe("999K");
      expect(formatStatNumber(999999)).toBe("1000K");
    });
  });

  describe("millions (M)", () => {
    it("formats exactly 1 million as 1M", () => {
      expect(formatStatNumber(1_000_000)).toBe("1M");
    });

    it("formats with one decimal place", () => {
      expect(formatStatNumber(1_500_000)).toBe("1.5M");
      expect(formatStatNumber(2_300_000)).toBe("2.3M");
    });

    it("removes trailing .0", () => {
      expect(formatStatNumber(2_000_000)).toBe("2M");
      expect(formatStatNumber(10_000_000)).toBe("10M");
    });
  });

  describe("custom decimal places", () => {
    it("respects custom decimal parameter", () => {
      expect(formatStatNumber(1234, 2)).toBe("1.23K");
      expect(formatStatNumber(1500000, 2)).toBe("1.5M");
    });

    it("handles zero decimals", () => {
      expect(formatStatNumber(1500, 0)).toBe("2K");
      expect(formatStatNumber(1400, 0)).toBe("1K");
    });
  });
});

describe("buildNexusModsUrl", () => {
  it("builds a standard NexusMods URL", () => {
    const result = buildNexusModsUrl("liesofp", 304);
    expect(result).toBe("https://www.nexusmods.com/liesofp/mods/304");
  });

  it("handles game domains with numbers", () => {
    const result = buildNexusModsUrl("residentevil42023", 3016);
    expect(result).toBe("https://www.nexusmods.com/residentevil42023/mods/3016");
  });

  it("handles large mod IDs", () => {
    const result = buildNexusModsUrl("eldenring", 5128);
    expect(result).toBe("https://www.nexusmods.com/eldenring/mods/5128");
  });
});
