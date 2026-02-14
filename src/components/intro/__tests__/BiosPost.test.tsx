import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BiosPost } from "../BiosPost";
import {
  BIOS_POST_HEADER_FOCUS,
  BIOS_POST_INITIAL_PAUSE,
  BIOS_POST_CHECK_STAGGER,
  BIOS_POST_FINAL_HOLD,
  BIOS_POST_FADE_DURATION,
} from "@/lib/animation-timing";

/** Helper: get the background div (first child of container) */
function getBgDiv(container: HTMLElement) {
  return container.children[0] as HTMLElement;
}

/** Helper: get the content div (second child of container) */
function getContentDiv(container: HTMLElement) {
  return container.children[1] as HTMLElement;
}

describe("BiosPost", () => {
  describe("Content Rendering", () => {
    it("renders POST check lines", () => {
      const { container } = render(<BiosPost />);

      const text = container.textContent;
      expect(text).toContain("CPU");
      expect(text).toContain("Memory");
      expect(text).toContain("640K OK");
      expect(text).toContain("Display");
    });

    it("renders final 'Starting window manager...' line", () => {
      const { container } = render(<BiosPost />);

      expect(container.textContent).toContain("Starting window manager...");
    });

    it("renders ARC BIOS header text", () => {
      const { container } = render(<BiosPost />);

      expect(container.textContent).toContain("ARC BIOS v1.0");
      expect(container.textContent).toContain("(C) 2026 andrewRCr");
    });

    it("renders ARC logo SVG", () => {
      const { container } = render(<BiosPost />);

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass("bios-header");
    });

    it("marks both main elements as aria-hidden", () => {
      const { container } = render(<BiosPost />);

      const bgDiv = getBgDiv(container);
      const contentDiv = getContentDiv(container);
      expect(bgDiv).toHaveAttribute("aria-hidden", "true");
      expect(contentDiv).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Production Mode (default)", () => {
    it("has data-lcp-anchor attribute on content div", () => {
      const { container } = render(<BiosPost />);

      expect(container.querySelector("[data-lcp-anchor]")).toBeInTheDocument();
    });

    it("uses fixed positioning", () => {
      const { container } = render(<BiosPost />);

      expect(getBgDiv(container).style.position).toBe("fixed");
      expect(getContentDiv(container).style.position).toBe("fixed");
    });

    it("sets z-index for layering (bg: 101, content: 102)", () => {
      const { container } = render(<BiosPost />);

      expect(getBgDiv(container).style.zIndex).toBe("101");
      expect(getContentDiv(container).style.zIndex).toBe("102");
    });

    it("applies bios-bg class to background div", () => {
      const { container } = render(<BiosPost />);

      expect(getBgDiv(container)).toHaveClass("bios-bg");
    });

    it("applies bios-post class to content div", () => {
      const { container } = render(<BiosPost />);

      expect(getContentDiv(container)).toHaveClass("bios-post");
    });

    it("sets fade CSS custom properties on both divs", () => {
      const { container } = render(<BiosPost />);

      const expectedFadeStart =
        BIOS_POST_HEADER_FOCUS + BIOS_POST_INITIAL_PAUSE + 3 * BIOS_POST_CHECK_STAGGER + BIOS_POST_FINAL_HOLD;

      for (const div of [getBgDiv(container), getContentDiv(container)]) {
        expect(div.style.getPropertyValue("--bios-fade-delay")).toBe(`${expectedFadeStart}s`);
        expect(div.style.getPropertyValue("--bios-fade-duration")).toBe(`${BIOS_POST_FADE_DURATION}s`);
      }
    });
  });

  describe("Preview Mode", () => {
    it("does not have data-lcp-anchor attribute", () => {
      const { container } = render(<BiosPost preview />);

      expect(container.querySelector("[data-lcp-anchor]")).not.toBeInTheDocument();
    });

    it("uses absolute positioning", () => {
      const { container } = render(<BiosPost preview />);

      expect(getBgDiv(container).style.position).toBe("absolute");
      expect(getContentDiv(container).style.position).toBe("absolute");
    });

    it("does not set z-index", () => {
      const { container } = render(<BiosPost preview />);

      expect(getBgDiv(container).style.zIndex).toBe("");
      expect(getContentDiv(container).style.zIndex).toBe("");
    });

    it("does not apply bios-bg or bios-post classes", () => {
      const { container } = render(<BiosPost preview />);

      expect(getBgDiv(container)).not.toHaveClass("bios-bg");
      expect(getContentDiv(container)).not.toHaveClass("bios-post");
    });

    it("does not set fade CSS custom properties", () => {
      const { container } = render(<BiosPost preview />);

      for (const div of [getBgDiv(container), getContentDiv(container)]) {
        expect(div.style.getPropertyValue("--bios-fade-delay")).toBe("");
        expect(div.style.getPropertyValue("--bios-fade-duration")).toBe("");
      }
    });

    it("centers content with translate(-50%, -50%)", () => {
      const { container } = render(<BiosPost preview />);

      const contentDiv = getContentDiv(container);
      expect(contentDiv.style.top).toBe("50%");
      expect(contentDiv.style.transform).toBe("translate(-50%, -50%)");
    });
  });

  describe("Timing Derivation", () => {
    it("staggers check line animation delays from timing constants", () => {
      const { container } = render(<BiosPost />);

      const checkLines = container.querySelectorAll(".bios-line");
      // 3 check lines + 1 final line
      expect(checkLines).toHaveLength(4);

      const base = BIOS_POST_HEADER_FOCUS + BIOS_POST_INITIAL_PAUSE;
      expect(checkLines[0]).toHaveStyle({ animationDelay: `${base}s` });
      expect(checkLines[1]).toHaveStyle({ animationDelay: `${base + BIOS_POST_CHECK_STAGGER}s` });
      expect(checkLines[2]).toHaveStyle({ animationDelay: `${base + 2 * BIOS_POST_CHECK_STAGGER}s` });
    });

    it("derives final line delay from all check lines completing", () => {
      const { container } = render(<BiosPost />);

      const checkLines = container.querySelectorAll(".bios-line");
      const finalLine = checkLines[3];

      const expectedFinalDelay = BIOS_POST_HEADER_FOCUS + BIOS_POST_INITIAL_PAUSE + 3 * BIOS_POST_CHECK_STAGGER;
      expect(finalLine).toHaveStyle({ animationDelay: `${expectedFinalDelay}s` });
    });

    it("syncs final cursor delay with final line", () => {
      const { container } = render(<BiosPost />);

      const finalCursor = container.querySelector(".bios-cursor-final") as HTMLElement;
      const expectedDelay = BIOS_POST_HEADER_FOCUS + BIOS_POST_INITIAL_PAUSE + 3 * BIOS_POST_CHECK_STAGGER;
      expect(finalCursor).toHaveStyle({ animationDelay: `${expectedDelay}s` });
    });

    it("starts initial cursor blink after header focus completes", () => {
      const { container } = render(<BiosPost />);

      const initialCursor = container.querySelector(".bios-cursor") as HTMLElement;
      expect(initialCursor.style.animationDelay).toBe(`${BIOS_POST_HEADER_FOCUS}s`);
    });
  });
});
