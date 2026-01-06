/**
 * Behavior tests for ProjectTabs component
 *
 * Tests tab switching functionality, query parameter handling, and active state management.
 */

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createNavigationMock, mockNavigation } from "@tests/mocks/next-navigation";
import ProjectTabs from "../ProjectTabs";

// Apply shared navigation mock
vi.mock("next/navigation", () => createNavigationMock());

describe("ProjectTabs - Behavior Tests", () => {
  beforeEach(() => {
    mockNavigation.reset();
    mockNavigation.setPathname("/projects");
  });

  describe("Tab Rendering", () => {
    it("renders both Software and Mods tabs", () => {
      render(<ProjectTabs />);

      expect(screen.getByRole("tab", { name: /software/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /mods/i })).toBeInTheDocument();
    });

    it("renders tabs in a tab list with proper ARIA roles", () => {
      render(<ProjectTabs />);

      const tablist = screen.getByRole("tablist");
      expect(tablist).toBeInTheDocument();

      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(2);
    });
  });

  describe("Active State", () => {
    it("marks Software tab as active by default (no query param)", () => {
      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      const modsTab = screen.getByRole("tab", { name: /mods/i });

      expect(softwareTab).toHaveAttribute("aria-selected", "true");
      expect(modsTab).toHaveAttribute("aria-selected", "false");
    });

    it("marks Mods tab as active when query param is 'mods'", () => {
      mockNavigation.setSearchParams({ tab: "mods" });

      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      const modsTab = screen.getByRole("tab", { name: /mods/i });

      expect(softwareTab).toHaveAttribute("aria-selected", "false");
      expect(modsTab).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Tab Switching", () => {
    it("updates URL with query param when switching to Mods tab", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const modsTab = screen.getByRole("tab", { name: /mods/i });
      await user.click(modsTab);

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=mods");
    });

    it("updates URL with query param when switching to Software tab", async () => {
      const user = userEvent.setup();
      mockNavigation.setSearchParams({ tab: "mods" });

      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      await user.click(softwareTab);

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=software");
    });

    it("handles keyboard navigation (Enter key)", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const modsTab = screen.getByRole("tab", { name: /mods/i });
      modsTab.focus();
      await user.keyboard("{Enter}");

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=mods");
    });

    it("handles keyboard navigation (Space key)", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const modsTab = screen.getByRole("tab", { name: /mods/i });
      modsTab.focus();
      await user.keyboard(" ");

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=mods");
    });

    it("handles ArrowRight to move to next tab", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      softwareTab.focus();
      await user.keyboard("{ArrowRight}");

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=mods");
    });

    it("handles ArrowLeft to move to previous tab (wraps)", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      softwareTab.focus();
      await user.keyboard("{ArrowLeft}");

      // Wraps from first to last
      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=mods");
    });

    it("handles Home key to move to first tab", async () => {
      const user = userEvent.setup();
      mockNavigation.setSearchParams({ tab: "mods" });
      render(<ProjectTabs />);

      const modsTab = screen.getByRole("tab", { name: /mods/i });
      modsTab.focus();
      await user.keyboard("{Home}");

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=software");
    });

    it("handles End key to move to last tab", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      softwareTab.focus();
      await user.keyboard("{End}");

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=mods");
    });
  });

  describe("Query Parameter Handling", () => {
    it("defaults to Software tab when query param is missing", () => {
      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      expect(softwareTab).toHaveAttribute("aria-selected", "true");
    });

    it("defaults to Software tab when query param is invalid", () => {
      mockNavigation.setSearchParams({ tab: "invalid" });

      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      expect(softwareTab).toHaveAttribute("aria-selected", "true");
    });

    it("recognizes 'software' as valid query param value", () => {
      mockNavigation.setSearchParams({ tab: "software" });

      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      expect(softwareTab).toHaveAttribute("aria-selected", "true");
    });

    it("recognizes 'mods' as valid query param value", () => {
      mockNavigation.setSearchParams({ tab: "mods" });

      render(<ProjectTabs />);

      const modsTab = screen.getByRole("tab", { name: /mods/i });
      expect(modsTab).toHaveAttribute("aria-selected", "true");
    });
  });
});
