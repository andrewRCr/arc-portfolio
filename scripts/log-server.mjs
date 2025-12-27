#!/usr/bin/env node

/**
 * Browser Console Log Server
 *
 * Simple Express server that receives browser console logs via HTTP POST
 * and writes them to .console-logs.txt for AI debugging.
 *
 * Usage:
 *   node scripts/log-server.js
 *   - or -
 *   npm run dev:with-logs (starts both Next.js and log server)
 */

import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3001;
const LOG_FILE = path.join(process.cwd(), ".console-logs.txt");

// Middleware
app.use(express.json());

// CORS for localhost
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Validation limits
const MAX_ARGS = 50;
const MAX_ARG_SIZE = 1000; // bytes per serialized arg
const MAX_TOTAL_SIZE = 10000; // bytes total

// Log endpoint
app.post("/log", (req, res) => {
  const { type, args, timestamp } = req.body;

  // Validate type
  if (typeof type !== "string" || type.length === 0 || type.length > 20) {
    return res.status(400).send("Invalid type");
  }

  // Validate args
  if (!Array.isArray(args)) {
    return res.status(400).send("args must be an array");
  }
  if (args.length > MAX_ARGS) {
    return res.status(400).send(`Too many args (max ${MAX_ARGS})`);
  }

  // Validate timestamp
  const time = timestamp ? new Date(timestamp) : new Date();
  if (isNaN(time.getTime())) {
    return res.status(400).send("Invalid timestamp");
  }

  // Serialize args with size limits
  let totalSize = 0;
  const serializedArgs = [];
  for (const arg of args) {
    const str = typeof arg === "object" ? JSON.stringify(arg) : String(arg);
    const size = Buffer.byteLength(str, "utf8");
    if (size > MAX_ARG_SIZE) {
      const truncated = str.slice(0, 200) + "...[truncated]";
      totalSize += Buffer.byteLength(truncated, "utf8");
      serializedArgs.push(truncated);
    } else {
      serializedArgs.push(str);
      totalSize += size;
    }
    if (totalSize > MAX_TOTAL_SIZE) {
      return res.status(400).send(`Payload too large (max ${MAX_TOTAL_SIZE} bytes)`);
    }
  }

  const message = serializedArgs.join(" ");
  const logLine = `[${time.toISOString()}] ${type.toUpperCase()}: ${message}\n`;

  // Respond immediately, write async (fire-and-forget)
  res.sendStatus(200);

  // Write to file asynchronously
  fs.promises.appendFile(LOG_FILE, logLine).catch((err) => {
    console.error("Failed to write log:", err.message);
  });
});

// Clear logs endpoint (optional - for programmatic clearing)
app.post("/clear-logs", async (req, res) => {
  try {
    await fs.promises.writeFile(LOG_FILE, "");
    console.log("Logs cleared");
    res.sendStatus(200);
  } catch (err) {
    console.error("Failed to clear logs:", err.message);
    res.status(500).send("Failed to clear logs");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Browser console log server running on http://localhost:${PORT}`);
  console.log(`✓ Logs writing to: ${LOG_FILE}`);
  console.log(`✓ Clear logs with: rm ${LOG_FILE}`);
  console.log("");
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\nShutting down log server...");
  process.exit(0);
});
