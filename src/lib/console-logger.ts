/**
 * Browser Console Logger
 *
 * Intercepts browser console methods (log, error, warn, info, debug)
 * and sends them to the log server for AI debugging.
 *
 * Only active in development mode.
 * Gracefully degrades if log server is not running.
 */

const LOG_SERVER_URL = "http://localhost:3001/log";

/**
 * Initialize console logging to file.
 * Call this once at app startup (in root layout).
 */
export function initConsoleLogger() {
  // Only run in development
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  // Only run in browser
  if (typeof window === "undefined") {
    return;
  }

  // Methods to intercept
  const methods: Array<"log" | "error" | "warn" | "info" | "debug"> = ["log", "error", "warn", "info", "debug"];

  methods.forEach((method) => {
    const original = console[method];

    // Override console method
    console[method] = (...args: unknown[]) => {
      // Call original console method (still shows in browser DevTools)
      original.apply(console, args);

      // Send to log server (async, non-blocking)
      sendToLogServer(method, args);
    };
  });

  console.log("[Console Logger] Initialized - logs being sent to .console-logs.txt");
}

/**
 * Send console message to log server
 */
function sendToLogServer(type: string, args: unknown[]) {
  // Serialize arguments (handle objects, errors, etc.)
  const serializedArgs = args.map((arg) => {
    if (arg instanceof Error) {
      return {
        message: arg.message,
        stack: arg.stack,
        name: arg.name,
      };
    }
    if (typeof arg === "object" && arg !== null) {
      try {
        return JSON.parse(JSON.stringify(arg)); // Deep clone and serialize
      } catch {
        return String(arg); // Fallback for circular references
      }
    }
    return arg;
  });

  // Send to server (fire-and-forget)
  fetch(LOG_SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type,
      args: serializedArgs,
      timestamp: Date.now(),
    }),
  }).catch(() => {
    // Silent fail if log server not running
    // Don't pollute console with logging errors
  });
}
