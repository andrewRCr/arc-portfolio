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

// Log endpoint
app.post("/log", (req, res) => {
  const { type, args, timestamp } = req.body;

  // Format log entry
  const time = new Date(timestamp).toISOString();
  const message = args
    .map((arg) => {
      if (typeof arg === "object") return JSON.stringify(arg);
      return String(arg);
    })
    .join(" ");

  const logLine = `[${time}] ${type.toUpperCase()}: ${message}\n`;

  // Respond immediately, write async (fire-and-forget)
  res.sendStatus(200);

  // Write to file asynchronously
  fs.promises.appendFile(LOG_FILE, logLine).catch((err) => {
    console.error("Failed to write log:", err.message);
  });
});

// Clear logs endpoint (optional - for programmatic clearing)
app.post("/clear-logs", (req, res) => {
  try {
    fs.writeFileSync(LOG_FILE, "");
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
