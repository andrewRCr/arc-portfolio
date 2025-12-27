"use client";

import { useEffect } from "react";
import { initConsoleLogger } from "@/lib/console-logger";

/**
 * ConsoleLoggerInit
 *
 * Client component that initializes browser console logging.
 * Only runs in development mode.
 * Must be mounted once at app root.
 */
export function ConsoleLoggerInit() {
  useEffect(() => {
    initConsoleLogger();
  }, []);

  return null;
}
