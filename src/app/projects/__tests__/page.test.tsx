/**
 * Behavior tests for Projects page
 *
 * Tests tab content filtering and Games tab functionality.
 * Requires 3-tab structure: Software, Games, Mods
 */

import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createNavigationMock, mockNavigation } from "@tests/mocks/next-navigation";
import ProjectsPage from "../page";

// Apply shared navigation mock
vi.mock("next/navigation", () => createNavigationMock());

// Mock AnimationContext (PageHeader uses useAnimationContext)
vi.mock("@/contexts/AnimationContext", () => ({
  AnimationProvider: ({ children }: { children: React.ReactNode }) => children,
  useAnimationContext: () => ({
    loadMode: "refresh",
    animationMode: "refresh",
    intro: { phase: "complete", isActive: false, wasSkipped: false, replayCount: 0, triggerReplay: vi.fn() },
    route: { isAnimating: false },
    visibility: { isHiddenUntilMorph: false, isHiddenUntilExpand: false, windowVisible: true, contentVisible: true },
    reducedMotion: false,
    isInitialized: true,
  }),
  useAnimationDispatch: () => vi.fn(),
  markIntroSeen: vi.fn(),
  clearIntroCookie: vi.fn(),
}));

describe("Projects Page - Games Tab", () => {
  beforeEach(() => {
    mockNavigation.reset();
    mockNavigation.setPathname("/projects");
  });

  describe("Games Tab Content", () => {
    it("shows game projects when Games tab is active", () => {
      mockNavigation.setSearchParams({ tab: "games" });
      render(<ProjectsPage />);

      // Games tab should show game projects
      expect(screen.getByText("Action RPG Project")).toBeInTheDocument();
      expect(screen.getByText("Survival Horror Project")).toBeInTheDocument();
      expect(screen.getByText("Pong Clone")).toBeInTheDocument();
    });

    it("does not show software projects in Games tab", () => {
      mockNavigation.setSearchParams({ tab: "games" });
      render(<ProjectsPage />);

      // Software projects should not appear
      expect(screen.queryByText("CineXplorer")).not.toBeInTheDocument();
      expect(screen.queryByText("TaskFocus")).not.toBeInTheDocument();
      expect(screen.queryByText("PetResort")).not.toBeInTheDocument();
    });

    it("renders Games panel with correct ARIA attributes", () => {
      mockNavigation.setSearchParams({ tab: "games" });
      render(<ProjectsPage />);

      const gamesPanel = screen.getByRole("tabpanel");
      expect(gamesPanel).toHaveAttribute("id", "panel-games");
      expect(gamesPanel).toHaveAttribute("aria-labelledby", "tab-games");
    });

    it("shows exactly 3 game projects", () => {
      mockNavigation.setSearchParams({ tab: "games" });
      render(<ProjectsPage />);

      const gamesPanel = screen.getByRole("tabpanel");
      const projectLinks = within(gamesPanel).getAllByRole("link");

      // Should have 3 game project cards
      expect(projectLinks).toHaveLength(3);
    });
  });

  describe("Game Project Card Links", () => {
    it("links Action RPG Project to correct detail page", () => {
      mockNavigation.setSearchParams({ tab: "games" });
      render(<ProjectsPage />);

      const link = screen.getByRole("link", { name: /action rpg project/i });
      expect(link).toHaveAttribute("href", "/projects/games/action-rpg-project");
    });

    it("links Survival Horror Project to correct detail page", () => {
      mockNavigation.setSearchParams({ tab: "games" });
      render(<ProjectsPage />);

      const link = screen.getByRole("link", { name: /survival horror project/i });
      expect(link).toHaveAttribute("href", "/projects/games/survival-horror-project");
    });

    it("links Pong Clone to correct detail page", () => {
      mockNavigation.setSearchParams({ tab: "games" });
      render(<ProjectsPage />);

      const link = screen.getByRole("link", { name: /pong clone/i });
      expect(link).toHaveAttribute("href", "/projects/games/pong-clone");
    });
  });

  describe("Software Tab Excludes Games", () => {
    it("does not show game projects in Software tab", () => {
      mockNavigation.setSearchParams({ tab: "software" });
      render(<ProjectsPage />);

      // Game projects should not appear in Software tab
      expect(screen.queryByText("Action RPG Project")).not.toBeInTheDocument();
      expect(screen.queryByText("Survival Horror Project")).not.toBeInTheDocument();
      expect(screen.queryByText("Pong Clone")).not.toBeInTheDocument();
    });

    it("shows only non-game software projects", () => {
      mockNavigation.setSearchParams({ tab: "software" });
      render(<ProjectsPage />);

      // Software projects should appear
      expect(screen.getByText("CineXplorer")).toBeInTheDocument();
      expect(screen.getByText("TaskFocus")).toBeInTheDocument();
      expect(screen.getByText("PetResort")).toBeInTheDocument();
    });
  });

  describe("Default Tab Behavior", () => {
    it("defaults to Software tab when no query param", () => {
      render(<ProjectsPage />);

      // Should show software projects by default
      expect(screen.getByText("CineXplorer")).toBeInTheDocument();

      // Should not show game projects
      expect(screen.queryByText("Action RPG Project")).not.toBeInTheDocument();
    });
  });
});
