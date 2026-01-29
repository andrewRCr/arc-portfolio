/**
 * Behavior tests for Projects page skill filtering
 *
 * Tests filtered state triggered by skills query param, UI transitions
 * between normal and filtered states, and filter result display.
 */

import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@tests/test-utils";
import { mockNavigation } from "@tests/mocks/next-navigation";
import ProjectsPage from "../page";

// next/navigation is mocked globally in setup.ts using the shared mockNavigation object

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

      // ResponsiveSwitch renders both mobile and desktop filter buttons
      const filterButtons = screen.getAllByRole("button", { name: /filter/i });
      expect(filterButtons.length).toBeGreaterThan(0);
    });

    it("filter button shows no count when no skills selected", () => {
      render(<ProjectsPage />);

      // ResponsiveSwitch renders both filter buttons - both should show no count
      const filterButtons = screen.getAllByRole("button", { name: /filter/i });
      expect(filterButtons[0]).toHaveTextContent("Filter");
      expect(filterButtons[0]).not.toHaveTextContent("(");
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

      // ResponsiveSwitch renders both mobile and desktop filter buttons
      const filterButtons = screen.getAllByRole("button", { name: /^filter/i });
      expect(filterButtons.length).toBeGreaterThan(0);
    });

    it("filter button shows count when skills selected", () => {
      mockNavigation.setSearchParams({ skills: "React,TypeScript" });
      render(<ProjectsPage />);

      // ResponsiveSwitch renders both filter buttons - both should show count
      const filterButtons = screen.getAllByRole("button", { name: /^filter/i });
      expect(filterButtons[0]).toHaveTextContent("Filter (2)");
    });
  });

  describe("Filtered Results", () => {
    it("shows projects matching the skill filter", () => {
      mockNavigation.setSearchParams({ skills: "React" });
      render(<ProjectsPage />);

      // Should show project cards that match the filter
      const projectCards = screen.getAllByTestId("project-card");
      expect(projectCards.length).toBeGreaterThan(0);
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

      // ResponsiveSwitch renders both mobile and desktop variants - get the desktop one (second)
      const filterButtons = screen.getAllByRole("button", { name: /filter/i });
      await user.click(filterButtons[1]); // Desktop popover trigger

      // Popover should show search and skill options
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it("removes skill when badge clicked on filter indicator", async () => {
      const user = userEvent.setup();
      mockNavigation.setSearchParams({ skills: "React,TypeScript" });
      render(<ProjectsPage />);

      // Click the React badge directly (badge itself is now dismissible)
      await user.click(screen.getByRole("button", { name: /remove react/i }));

      // Should update URL to remove React
      expect(mockNavigation.push).toHaveBeenCalledWith(expect.stringContaining("skills=TypeScript"));
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
