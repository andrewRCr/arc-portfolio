/**
 * Behavior tests for Projects page skill filtering
 *
 * Tests filtered state triggered by skills query param, UI transitions
 * between normal and filtered states, and filter result display.
 */

import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createNavigationMock, mockNavigation } from "@tests/mocks/next-navigation";
import ProjectsPage from "../page";

// Apply shared navigation mock
vi.mock("next/navigation", () => createNavigationMock());

describe("Projects Page - Skill Filtering", () => {
  beforeEach(() => {
    mockNavigation.reset();
    mockNavigation.setPathname("/projects");
  });

  describe("Query Parameter Handling", () => {
    it("shows filtered mode when skills query param is present", () => {
      mockNavigation.setSearchParams({ skills: "React" });
      render(<ProjectsPage />);

      // Filter indicator should be visible
      expect(screen.getByText("Filtering by:")).toBeInTheDocument();
      // React badge in filter indicator (not tech badges in cards)
      const filterIndicator = screen.getByText("Filtering by:").parentElement;
      expect(within(filterIndicator as HTMLElement).getByText("React")).toBeInTheDocument();
    });

    it("supports multiple skills in query param (comma-separated)", () => {
      mockNavigation.setSearchParams({ skills: "React,TypeScript" });
      render(<ProjectsPage />);

      expect(screen.getByText("Filtering by:")).toBeInTheDocument();
      const filterIndicator = screen.getByText("Filtering by:").parentElement;
      expect(within(filterIndicator as HTMLElement).getByText("React")).toBeInTheDocument();
      expect(within(filterIndicator as HTMLElement).getByText("TypeScript")).toBeInTheDocument();
    });

    it("shows normal mode when no skills query param", () => {
      render(<ProjectsPage />);

      // Tabs should be visible, filter indicator should not
      expect(screen.getByRole("tablist")).toBeInTheDocument();
      expect(screen.queryByText("Filtering by:")).not.toBeInTheDocument();
    });
  });

  describe("Header Layout - Normal State", () => {
    it("shows tabs on the left", () => {
      render(<ProjectsPage />);

      const tablist = screen.getByRole("tablist");
      expect(tablist).toBeInTheDocument();
    });

    it("shows filter button on the right", () => {
      render(<ProjectsPage />);

      const filterButton = screen.getByRole("button", { name: /filter/i });
      expect(filterButton).toBeInTheDocument();
    });

    it("filter button shows no count when no skills selected", () => {
      render(<ProjectsPage />);

      const filterButton = screen.getByRole("button", { name: /filter/i });
      expect(filterButton).toHaveTextContent("Filter");
      expect(filterButton).not.toHaveTextContent("(");
    });
  });

  describe("Header Layout - Filtered State", () => {
    it("hides tabs when filtered", () => {
      mockNavigation.setSearchParams({ skills: "React" });
      render(<ProjectsPage />);

      // Tabs should not be visible (could be in DOM but hidden via opacity)
      const tablist = screen.queryByRole("tablist");
      if (tablist) {
        // If in DOM, should have opacity-0 via Crossfade
        const wrapper = tablist.closest("[aria-hidden]");
        expect(wrapper).toHaveAttribute("aria-hidden", "true");
      }
    });

    it("shows filter indicator on the left when filtered", () => {
      mockNavigation.setSearchParams({ skills: "React" });
      render(<ProjectsPage />);

      expect(screen.getByText("Filtering by:")).toBeInTheDocument();
    });

    it("shows filter button on the right when filtered", () => {
      mockNavigation.setSearchParams({ skills: "React" });
      render(<ProjectsPage />);

      // Filter trigger button (starts with "Filter", not "Remove ... filter")
      const filterButton = screen.getByRole("button", { name: /^filter/i });
      expect(filterButton).toBeInTheDocument();
    });

    it("filter button shows count when skills selected", () => {
      mockNavigation.setSearchParams({ skills: "React,TypeScript" });
      render(<ProjectsPage />);

      // Filter trigger button (not the remove filter buttons)
      const filterButton = screen.getByRole("button", { name: /^filter/i });
      expect(filterButton).toHaveTextContent("Filter (2)");
    });
  });

  describe("Filtered Results", () => {
    it("shows projects matching the skill filter", () => {
      mockNavigation.setSearchParams({ skills: "React" });
      render(<ProjectsPage />);

      // CineXplorer uses React
      expect(screen.getByText("CineXplorer")).toBeInTheDocument();
    });

    it("filters across all project types (software, games, mods)", () => {
      // Filter by a skill that appears in multiple project types
      mockNavigation.setSearchParams({ skills: "C#" });
      render(<ProjectsPage />);

      // Should show results from software and games that use C#
      // (actual projects depend on data, but filtered results should appear)
      const projectCards = screen.getAllByRole("link");
      expect(projectCards.length).toBeGreaterThan(0);
    });

    it("shows no tab panels when filtered", () => {
      mockNavigation.setSearchParams({ skills: "React" });
      render(<ProjectsPage />);

      // Should not show tabpanel role - showing flat filtered list instead
      expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
    });
  });

  describe("ARIA Live Region", () => {
    it("announces result count for screen readers", () => {
      mockNavigation.setSearchParams({ skills: "React" });
      render(<ProjectsPage />);

      // Should have an ARIA live region with result count
      const liveRegion = screen.getByRole("status");
      expect(liveRegion).toHaveTextContent(/showing \d+ project/i);
    });
  });

  describe("Filter Interactions", () => {
    it("opens filter popover when filter button clicked", async () => {
      const user = userEvent.setup();
      render(<ProjectsPage />);

      await user.click(screen.getByRole("button", { name: /filter/i }));

      // Popover should show search and skill options
      expect(screen.getByPlaceholderText(/search skills/i)).toBeInTheDocument();
    });

    it("removes skill when dismiss button clicked on filter indicator", async () => {
      const user = userEvent.setup();
      mockNavigation.setSearchParams({ skills: "React,TypeScript" });
      render(<ProjectsPage />);

      // Click dismiss on React badge in filter indicator
      const filterIndicator = screen.getByText("Filtering by:").parentElement;
      const reactBadge = within(filterIndicator as HTMLElement)
        .getByText("React")
        .closest("[data-slot='badge']");
      const dismissButton = within(reactBadge as HTMLElement).getByRole("button");
      await user.click(dismissButton);

      // Should update URL to remove React
      expect(mockNavigation.push).toHaveBeenCalledWith(
        expect.stringContaining("skills=TypeScript")
      );
    });

    it("clears all filters and returns to normal mode", async () => {
      const user = userEvent.setup();
      mockNavigation.setSearchParams({ skills: "React,TypeScript" });
      render(<ProjectsPage />);

      // Click clear all
      await user.click(screen.getByRole("button", { name: /clear all/i }));

      // Should navigate to /projects without skills param
      expect(mockNavigation.push).toHaveBeenCalledWith("/projects");
    });
  });
});
