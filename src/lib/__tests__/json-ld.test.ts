import { describe, it, expect } from "vitest";
import { personJsonLd, breadcrumbJsonLd } from "../json-ld";
import { SITE, SOCIAL_LINKS } from "@/config/site";

describe("personJsonLd", () => {
  const schema = personJsonLd();

  it("uses Person type with schema.org context", () => {
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Person");
  });

  it("contains name, jobTitle, and url from SITE config", () => {
    expect(schema.name).toBe(SITE.name);
    expect(schema.jobTitle).toBe(SITE.jobTitle);
    expect(schema.url).toBe(SITE.url);
  });

  it("contains sameAs with all social link URLs", () => {
    const expectedUrls = SOCIAL_LINKS.map((link) => link.url);
    expect(schema.sameAs).toEqual(expectedUrls);
    expect(schema.sameAs.length).toBeGreaterThan(0);
  });
});

describe("breadcrumbJsonLd", () => {
  const schema = breadcrumbJsonLd("Software", "CineXplorer");

  it("uses BreadcrumbList type with schema.org context", () => {
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("BreadcrumbList");
  });

  it("contains 4-level hierarchy: Home → Projects → Category → Project", () => {
    const items = schema.itemListElement;
    expect(items).toHaveLength(4);
    expect(items[0]).toMatchObject({ position: 1, name: "Home" });
    expect(items[1]).toMatchObject({ position: 2, name: "Projects" });
    expect(items[2]).toMatchObject({ position: 3, name: "Software" });
    expect(items[3]).toMatchObject({ position: 4, name: "CineXplorer" });
  });

  it("includes URLs for all items except the last (current page)", () => {
    const items = schema.itemListElement;
    expect(items[0].item).toBe(SITE.url);
    expect(items[1].item).toBe(`${SITE.url}/projects`);
    expect(items[2].item).toBe(`${SITE.url}/projects`);
    expect(items[3]).not.toHaveProperty("item");
  });

  it("uses the provided category and project title", () => {
    const modsSchema = breadcrumbJsonLd("Mods", "Guard Parry");
    expect(modsSchema.itemListElement[2].name).toBe("Mods");
    expect(modsSchema.itemListElement[3].name).toBe("Guard Parry");
  });
});
