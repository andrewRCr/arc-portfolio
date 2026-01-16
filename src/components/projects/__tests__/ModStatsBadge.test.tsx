/**
 * Tests for ModStatsBadge component
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ModStatsBadge, ModStatsGroup } from "../ModStatsBadge";

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

    it("uses secondary variant", () => {
      const { container } = render(<ModStatsBadge type="downloads" value={100} />);
      const badge = container.firstChild;
      expect(badge).toHaveClass("bg-secondary");
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

  it("renders stats in correct order (uniqueDownloads, endorsements, downloads)", () => {
    const { container } = render(<ModStatsGroup downloads={1000} uniqueDownloads={500} endorsements={50} />);
    const badges = container.querySelectorAll("[data-slot='badge']");
    expect(badges).toHaveLength(3);
    // Order: uniqueDownloads first, then endorsements, then downloads
    expect(badges[0]).toHaveTextContent("500");
    expect(badges[1]).toHaveTextContent("50");
    expect(badges[2]).toHaveTextContent("1K");
  });

  it("accepts custom className", () => {
    const { container } = render(<ModStatsGroup endorsements={100} className="custom-container" />);
    expect(container.firstChild).toHaveClass("custom-container");
  });
});
