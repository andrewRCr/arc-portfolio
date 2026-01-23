/**
 * Tests for intro animation cookie utilities
 *
 * These utilities track whether a user has seen the TWM startup animation
 * within the past hour, enabling skip on repeat visits and replay on demand.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearIntroCookie, hasSeenIntro, INTRO_COOKIE_EXPIRY, INTRO_COOKIE_NAME, markIntroSeen } from "../intro";

describe("intro cookie utilities", () => {
  // Store original document.cookie descriptor
  let originalCookieDescriptor: PropertyDescriptor | undefined;
  let cookieStore: Record<string, string>;

  beforeEach(() => {
    // Reset cookie store
    cookieStore = {};

    // Save original descriptor
    originalCookieDescriptor = Object.getOwnPropertyDescriptor(document, "cookie");

    // Mock document.cookie with getter/setter
    Object.defineProperty(document, "cookie", {
      configurable: true,
      get: () => {
        return Object.entries(cookieStore)
          .map(([key, value]) => `${key}=${value}`)
          .join("; ");
      },
      set: (cookieString: string) => {
        const [nameValue] = cookieString.split(";");
        const [name, value] = nameValue.split("=");

        if (value === "" || cookieString.includes("expires=Thu, 01 Jan 1970")) {
          // Cookie deletion
          delete cookieStore[name];
        } else {
          cookieStore[name] = value;
        }
      },
    });
  });

  afterEach(() => {
    // Restore original document.cookie
    if (originalCookieDescriptor) {
      Object.defineProperty(document, "cookie", originalCookieDescriptor);
    }
    vi.restoreAllMocks();
  });

  describe("constants", () => {
    it("exports correct cookie name", () => {
      expect(INTRO_COOKIE_NAME).toBe("arc-intro-seen");
    });

    it("exports correct expiry time (1 hour in seconds)", () => {
      expect(INTRO_COOKIE_EXPIRY).toBe(3600);
    });
  });

  describe("hasSeenIntro", () => {
    it("returns false when no cookie exists", () => {
      expect(hasSeenIntro()).toBe(false);
    });

    it("returns true when valid cookie exists", () => {
      cookieStore[INTRO_COOKIE_NAME] = "1";
      expect(hasSeenIntro()).toBe(true);
    });

    it("returns true regardless of cookie value (existence check)", () => {
      cookieStore[INTRO_COOKIE_NAME] = "any-value";
      expect(hasSeenIntro()).toBe(true);
    });

    it("returns false when other cookies exist but not intro cookie", () => {
      cookieStore["other-cookie"] = "value";
      expect(hasSeenIntro()).toBe(false);
    });
  });

  describe("markIntroSeen", () => {
    it("sets the intro cookie", () => {
      markIntroSeen();
      expect(cookieStore[INTRO_COOKIE_NAME]).toBeDefined();
    });

    it("sets cookie value to '1'", () => {
      markIntroSeen();
      expect(cookieStore[INTRO_COOKIE_NAME]).toBe("1");
    });

    it("makes hasSeenIntro return true after calling", () => {
      expect(hasSeenIntro()).toBe(false);
      markIntroSeen();
      expect(hasSeenIntro()).toBe(true);
    });
  });

  describe("clearIntroCookie", () => {
    it("removes the intro cookie", () => {
      cookieStore[INTRO_COOKIE_NAME] = "1";
      expect(hasSeenIntro()).toBe(true);

      clearIntroCookie();
      expect(hasSeenIntro()).toBe(false);
    });

    it("does not throw when cookie does not exist", () => {
      expect(() => clearIntroCookie()).not.toThrow();
    });

    it("does not affect other cookies", () => {
      cookieStore["other-cookie"] = "value";
      cookieStore[INTRO_COOKIE_NAME] = "1";

      clearIntroCookie();

      expect(cookieStore["other-cookie"]).toBe("value");
      expect(cookieStore[INTRO_COOKIE_NAME]).toBeUndefined();
    });
  });

  describe("cookie expiry", () => {
    it("markIntroSeen sets cookie with max-age for expiry", () => {
      // Spy on document.cookie setter to capture the full cookie string
      let capturedCookieString = "";
      Object.defineProperty(document, "cookie", {
        configurable: true,
        get: () => "",
        set: (value: string) => {
          capturedCookieString = value;
        },
      });

      markIntroSeen();

      expect(capturedCookieString).toContain(`max-age=${INTRO_COOKIE_EXPIRY}`);
      expect(capturedCookieString).toContain("path=/");
    });
  });
});
