#!/usr/bin/env npx tsx
/**
 * Generate Wallpaper Thumbnails
 *
 * Creates 200×150 WebP thumbnails from full-resolution wallpapers.
 * Uses ImageMagick for image processing with center-crop to fill dimensions.
 *
 * Output: public/wallpaper/thumbnails/
 * Target size: ~10-15KB per thumbnail
 *
 * Usage: npx tsx scripts/generate-wallpaper-thumbnails.ts
 *        npm run generate:thumbnails
 */

import { execFileSync, execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const SOURCE_DIR = path.join(__dirname, "../public/wallpaper/optimized");
const OUTPUT_DIR = path.join(__dirname, "../public/wallpaper/thumbnails");

// Thumbnail dimensions (4:3 aspect ratio for picker preview)
const THUMB_WIDTH = 200;
const THUMB_HEIGHT = 150;

// WebP quality setting (lower = smaller file, target 10-15KB)
const WEBP_QUALITY = 75;

/**
 * Ensure output directory exists.
 */
function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }
}

/**
 * Generate a thumbnail for a single wallpaper using ImageMagick.
 *
 * Uses center-crop strategy:
 * 1. Resize to fill target dimensions (maintaining aspect ratio)
 * 2. Crop from center to exact dimensions
 *
 * @param inputFile - Source wallpaper filename
 * @returns Object with success status and file size
 */
function generateThumbnail(inputFile: string): { success: boolean; sizeKB?: number; error?: string } {
  const inputPath = path.join(SOURCE_DIR, inputFile);
  const outputFile = inputFile; // Keep same filename
  const outputPath = path.join(OUTPUT_DIR, outputFile);

  try {
    // ImageMagick convert with center-crop strategy
    execFileSync(
      "convert",
      [
        inputPath,
        "-resize",
        `${THUMB_WIDTH}x${THUMB_HEIGHT}^`,
        "-gravity",
        "center",
        "-extent",
        `${THUMB_WIDTH}x${THUMB_HEIGHT}`,
        "-quality",
        String(WEBP_QUALITY),
        outputPath,
      ],
      { stdio: "pipe" }
    );

    // Get file size
    const stats = fs.statSync(outputPath);
    const sizeKB = Math.round(stats.size / 1024);

    return { success: true, sizeKB };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMessage };
  }
}

/**
 * Main execution: generate thumbnails for all wallpapers.
 */
function main(): void {
  console.log("Generating wallpaper thumbnails...\n");

  // Verify ImageMagick is available
  try {
    execSync("convert --version", { stdio: "pipe" });
  } catch {
    console.error("Error: ImageMagick is required but not found.");
    console.error("Install with: brew install imagemagick (macOS) or apt install imagemagick (Linux)");
    process.exit(1);
  }

  // Verify source directory exists
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Error: Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  // Get all WebP files
  const wallpapers = fs.readdirSync(SOURCE_DIR).filter((file) => file.endsWith(".webp"));

  if (wallpapers.length === 0) {
    console.error("Error: No WebP files found in source directory");
    process.exit(1);
  }

  console.log(`Found ${wallpapers.length} wallpapers to process\n`);

  ensureOutputDir();

  let successCount = 0;
  let failCount = 0;
  let totalSizeKB = 0;

  for (const wallpaper of wallpapers) {
    const result = generateThumbnail(wallpaper);

    if (result.success && result.sizeKB !== undefined) {
      const sizeIndicator = result.sizeKB > 15 ? " (large)" : result.sizeKB < 10 ? " (small)" : "";
      console.log(`  ✓ ${wallpaper} → ${result.sizeKB}KB${sizeIndicator}`);
      successCount++;
      totalSizeKB += result.sizeKB;
    } else {
      console.log(`  ✗ ${wallpaper} → FAILED: ${result.error}`);
      failCount++;
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log(`Generated: ${successCount}/${wallpapers.length} thumbnails`);

  if (successCount > 0) {
    const avgSizeKB = Math.round(totalSizeKB / successCount);
    console.log(`Total size: ${totalSizeKB}KB (avg: ${avgSizeKB}KB per thumbnail)`);
    console.log(`Output: ${OUTPUT_DIR}`);
  }

  if (failCount > 0) {
    console.log(`\nWarning: ${failCount} thumbnail(s) failed to generate`);
    process.exit(1);
  }

  console.log("\nDone!");
}

main();
