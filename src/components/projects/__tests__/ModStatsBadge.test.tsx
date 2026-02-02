/**
 * Tests for ModStatsBadge component
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ModStatsBadge, ModStatsGroup } from "../ModStatsBadge";

// Mock useIsPhone hook
vi.mock("@/hooks/useMediaQuery", () => ({
  useIsPhone: vi.fn(() => false), // Default to desktop
}));

import { useIsPhone } from "@/hooks/useMediaQuery";

describe("ModStatsBadge", () => {
  describe("renders correct icon and value", () => {
    it("renders downloads badge", () => {
      render(<ModStatsBadge type="downloads" value={1500} />);
      expect(screen.getByText("1.5K")).toBeInTheDocument();
      expect(screen.getByLabelText("1,500 total downloads")).toBeInTheDocument();
    });

    it("renders uniqueDownloads badge", () => {
      render(<ModStatsBadge type="uniqueDownloads" value={5951} />);
      expect(screen.getByText("6K")).toBeInTheDocument();
      expect(screen.getByLabelText("5,951 unique downloads")).toBeInTheDocument();
    });

    it("renders endorsements badge", () => {
      render(<ModStatsBadge type="endorsements" value={212} />);
      expect(screen.getByText("212")).toBeInTheDocument();
      expect(screen.getByLabelText("212 endorsements")).toBeInTheDocument();
    });
  });

  describe("number formatting", () => {
    it("formats thousands with K suffix", () => {
      render(<ModStatsBadge type="uniqueDownloads" value={15300} />);
      expect(screen.getByText("15.3K")).toBeInTheDocument();
    });

    it("formats millions with M suffix", () => {
      render(<ModStatsBadge type="downloads" value={1500000} />);
      expect(screen.getByText("1.5M")).toBeInTheDocument();
    });

    it("shows raw number when showRaw is true", () => {
      render(<ModStatsBadge type="uniqueDownloads" value={5951} showRaw />);
      expect(screen.getByText("5,951")).toBeInTheDocument();
    });

    it("shows small numbers without formatting", () => {
      render(<ModStatsBadge type="endorsements" value={42} />);
      expect(screen.getByText("42")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has appropriate aria-label for screen readers", () => {
      render(<ModStatsBadge type="uniqueDownloads" value={5951} />);
      const badge = screen.getByLabelText("5,951 unique downloads");
      expect(badge).toBeInTheDocument();
    });

    it("marks icon as aria-hidden", () => {
      const { container } = render(<ModStatsBadge type="endorsements" value={100} />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("styling", () => {
    it("accepts custom className", () => {
      const { container } = render(<ModStatsBadge type="downloads" value={100} className="custom-class" />);
      const badge = container.firstChild;
      expect(badge).toHaveClass("custom-class");
    });

    it("uses muted background with border", () => {
      const { container } = render(<ModStatsBadge type="downloads" value={100} />);
      const badge = container.firstChild;
      expect(badge).toHaveClass("bg-muted");
      expect(badge).toHaveClass("border-border");
    });
  });
});

describe("ModStatsGroup", () => {
  it("renders multiple badges", () => {
    render(<ModStatsGroup uniqueDownloads={5951} endorsements={212} />);
    expect(screen.getByText("6K")).toBeInTheDocument();
    expect(screen.getByText("212")).toBeInTheDocument();
  });

  it("renders only provided stats", () => {
    render(<ModStatsGroup endorsements={100} />);
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.queryByLabelText(/downloads/)).not.toBeInTheDocument();
  });

  it("returns null when no stats provided", () => {
    const { container } = render(<ModStatsGroup />);
    expect(container.firstChild).toBeNull();
  });

  it("renders stats in correct order (endorsements, uniqueDownloads, downloads)", () => {
    render(<ModStatsGroup downloads={1000} uniqueDownloads={500} endorsements={50} />);
    // Query by aria-label (more semantic than data-slot which gets overwritten by Tooltip)
    const endorsements = screen.getByLabelText("50 endorsements");
    const uniqueDownloads = screen.getByLabelText("500 unique downloads");
    const downloads = screen.getByLabelText("1,000 total downloads");

    // Verify all three badges exist
    expect(endorsements).toBeInTheDocument();
    expect(uniqueDownloads).toBeInTheDocument();
    expect(downloads).toBeInTheDocument();

    // Verify order by checking DOM position (endorsements should come first)
    const parent = endorsements.parentElement;
    const children = Array.from(parent?.children || []);
    const endorsementsIndex = children.indexOf(endorsements);
    const uniqueDownloadsIndex = children.indexOf(uniqueDownloads);
    const downloadsIndex = children.indexOf(downloads);

    expect(endorsementsIndex).toBeLessThan(uniqueDownloadsIndex);
    expect(uniqueDownloadsIndex).toBeLessThan(downloadsIndex);
  });

  it("accepts custom className", () => {
    const { container } = render(<ModStatsGroup endorsements={100} className="custom-container" />);
    expect(container.firstChild).toHaveClass("custom-container");
  });

  describe("phone viewport (compact badge)", () => {
    beforeEach(() => {
      vi.mocked(useIsPhone).mockReturnValue(true);
    });

    afterEach(() => {
      // Restore to desktop default (mockReset would return undefined, not false)
      vi.mocked(useIsPhone).mockReturnValue(false);
    });

    it("renders single compact badge on phone", () => {
      render(<ModStatsGroup uniqueDownloads={5951} endorsements={212} />);
      // On phone, all stats combined in one badge with dot separators
      const badge = screen.getByLabelText(/212 endorsements, 5,951 unique downloads/);
      expect(badge).toBeInTheDocument();
    });

    it("renders all stats in compact format with gap spacing", () => {
      const { container } = render(<ModStatsGroup downloads={1000} uniqueDownloads={500} endorsements={50} />);
      // Stats are displayed with gap spacing (no dot separators)
      // Verify all three values are present
      expect(screen.getByText("50")).toBeInTheDocument();
      expect(screen.getByText("500")).toBeInTheDocument();
      expect(screen.getByText("1K")).toBeInTheDocument();
      // Badge should have gap class for spacing
      const badge = container.firstChild;
      expect(badge).toHaveClass("gap-2.5");
    });

    it("shows stats in correct order in compact badge", () => {
      render(<ModStatsGroup downloads={9000} uniqueDownloads={6000} endorsements={200} />);
      const badge = screen.getByLabelText(/200 endorsements, 6,000 unique downloads, 9,000 total downloads/);
      expect(badge).toBeInTheDocument();
    });

    it("formats numbers in compact badge", () => {
      render(<ModStatsGroup uniqueDownloads={5951} />);
      expect(screen.getByText("6K")).toBeInTheDocument();
    });

    it("returns null when no stats provided on phone", () => {
      const { container } = render(<ModStatsGroup />);
      expect(container.firstChild).toBeNull();
    });

    it("accepts custom className on phone", () => {
      const { container } = render(<ModStatsGroup endorsements={100} className="phone-class" />);
      expect(container.firstChild).toHaveClass("phone-class");
    });
  });
});
