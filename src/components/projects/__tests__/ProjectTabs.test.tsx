/**
 * Behavior tests for ProjectTabs component
 *
 * Tests tab switching functionality, query parameter handling, and active state management.
 * Updated for 3-tab structure: Software, Games, Mods
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
    it("renders all three tabs: Software, Games, and Mods", () => {
      render(<ProjectTabs />);

      expect(screen.getByRole("tab", { name: /software/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /games/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /mods/i })).toBeInTheDocument();
    });

    it("renders tabs in a tab list with proper ARIA roles", () => {
      render(<ProjectTabs />);

      const tablist = screen.getByRole("tablist");
      expect(tablist).toBeInTheDocument();

      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(3);
    });

    it("renders tabs in correct order: Software, Games, Mods", () => {
      render(<ProjectTabs />);

      const tabs = screen.getAllByRole("tab");
      expect(tabs[0]).toHaveTextContent(/software/i);
      expect(tabs[1]).toHaveTextContent(/games/i);
      expect(tabs[2]).toHaveTextContent(/mods/i);
    });
  });

  describe("Active State", () => {
    it("marks Software tab as active by default (no query param)", () => {
      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      const gamesTab = screen.getByRole("tab", { name: /games/i });
      const modsTab = screen.getByRole("tab", { name: /mods/i });

      expect(softwareTab).toHaveAttribute("aria-selected", "true");
      expect(gamesTab).toHaveAttribute("aria-selected", "false");
      expect(modsTab).toHaveAttribute("aria-selected", "false");
    });

    it("marks Games tab as active when query param is 'games'", () => {
      mockNavigation.setSearchParams({ tab: "games" });

      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      const gamesTab = screen.getByRole("tab", { name: /games/i });
      const modsTab = screen.getByRole("tab", { name: /mods/i });

      expect(softwareTab).toHaveAttribute("aria-selected", "false");
      expect(gamesTab).toHaveAttribute("aria-selected", "true");
      expect(modsTab).toHaveAttribute("aria-selected", "false");
    });

    it("marks Mods tab as active when query param is 'mods'", () => {
      mockNavigation.setSearchParams({ tab: "mods" });

      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      const gamesTab = screen.getByRole("tab", { name: /games/i });
      const modsTab = screen.getByRole("tab", { name: /mods/i });

      expect(softwareTab).toHaveAttribute("aria-selected", "false");
      expect(gamesTab).toHaveAttribute("aria-selected", "false");
      expect(modsTab).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Tab Switching", () => {
    it("updates URL when switching to Games tab", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const gamesTab = screen.getByRole("tab", { name: /games/i });
      await user.click(gamesTab);

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=games");
    });

    it("updates URL when switching to Mods tab", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const modsTab = screen.getByRole("tab", { name: /mods/i });
      await user.click(modsTab);

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=mods");
    });

    it("updates URL when switching to Software tab from Games", async () => {
      const user = userEvent.setup();
      mockNavigation.setSearchParams({ tab: "games" });

      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      await user.click(softwareTab);

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=software");
    });

    it("handles keyboard navigation (Enter key) on Games tab", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const gamesTab = screen.getByRole("tab", { name: /games/i });
      gamesTab.focus();
      await user.keyboard("{Enter}");

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=games");
    });

    it("handles keyboard navigation (Space key) on Games tab", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const gamesTab = screen.getByRole("tab", { name: /games/i });
      gamesTab.focus();
      await user.keyboard(" ");

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=games");
    });

    it("handles ArrowRight from Software to Games", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      softwareTab.focus();
      await user.keyboard("{ArrowRight}");

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=games");
    });

    it("handles ArrowRight from Games to Mods", async () => {
      const user = userEvent.setup();
      mockNavigation.setSearchParams({ tab: "games" });
      render(<ProjectTabs />);

      const gamesTab = screen.getByRole("tab", { name: /games/i });
      gamesTab.focus();
      await user.keyboard("{ArrowRight}");

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=mods");
    });

    it("handles ArrowRight from Mods wraps to Software", async () => {
      const user = userEvent.setup();
      mockNavigation.setSearchParams({ tab: "mods" });
      render(<ProjectTabs />);

      const modsTab = screen.getByRole("tab", { name: /mods/i });
      modsTab.focus();
      await user.keyboard("{ArrowRight}");

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=software");
    });

    it("handles ArrowLeft from Software wraps to Mods", async () => {
      const user = userEvent.setup();
      render(<ProjectTabs />);

      const softwareTab = screen.getByRole("tab", { name: /software/i });
      softwareTab.focus();
      await user.keyboard("{ArrowLeft}");

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=mods");
    });

    it("handles ArrowLeft from Games to Software", async () => {
      const user = userEvent.setup();
      mockNavigation.setSearchParams({ tab: "games" });
      render(<ProjectTabs />);

      const gamesTab = screen.getByRole("tab", { name: /games/i });
      gamesTab.focus();
      await user.keyboard("{ArrowLeft}");

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=software");
    });

    it("handles ArrowLeft from Mods to Games", async () => {
      const user = userEvent.setup();
      mockNavigation.setSearchParams({ tab: "mods" });
      render(<ProjectTabs />);

      const modsTab = screen.getByRole("tab", { name: /mods/i });
      modsTab.focus();
      await user.keyboard("{ArrowLeft}");

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=games");
    });

    it("handles Home key to move to first tab (Software)", async () => {
      const user = userEvent.setup();
      mockNavigation.setSearchParams({ tab: "mods" });
      render(<ProjectTabs />);

      const modsTab = screen.getByRole("tab", { name: /mods/i });
      modsTab.focus();
      await user.keyboard("{Home}");

      expect(mockNavigation.push).toHaveBeenCalledWith("/projects?tab=software");
    });

    it("handles End key to move to last tab (Mods)", async () => {
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

    it("recognizes 'games' as valid query param value", () => {
      mockNavigation.setSearchParams({ tab: "games" });

      render(<ProjectTabs />);

      const gamesTab = screen.getByRole("tab", { name: /games/i });
      expect(gamesTab).toHaveAttribute("aria-selected", "true");
    });

    it("recognizes 'mods' as valid query param value", () => {
      mockNavigation.setSearchParams({ tab: "mods" });

      render(<ProjectTabs />);

      const modsTab = screen.getByRole("tab", { name: /mods/i });
      expect(modsTab).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("ARIA Attributes", () => {
    it("has correct aria-controls attributes for all tabs", () => {
      render(<ProjectTabs />);

      expect(screen.getByRole("tab", { name: /software/i })).toHaveAttribute("aria-controls", "panel-software");
      expect(screen.getByRole("tab", { name: /games/i })).toHaveAttribute("aria-controls", "panel-games");
      expect(screen.getByRole("tab", { name: /mods/i })).toHaveAttribute("aria-controls", "panel-mods");
    });

    it("has correct tabindex for active/inactive tabs", () => {
      mockNavigation.setSearchParams({ tab: "games" });
      render(<ProjectTabs />);

      expect(screen.getByRole("tab", { name: /software/i })).toHaveAttribute("tabIndex", "-1");
      expect(screen.getByRole("tab", { name: /games/i })).toHaveAttribute("tabIndex", "0");
      expect(screen.getByRole("tab", { name: /mods/i })).toHaveAttribute("tabIndex", "-1");
    });
  });
});
