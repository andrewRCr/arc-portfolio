/**
 * Generate Mobile Wallpaper Variants
 *
 * Creates 1280px-wide WebP variants from 1920w source wallpapers.
 * Mobile devices (up to 430px × 3x DPR = 1290px) get appropriately-sized
 * images instead of downloading the full 1920w versions (~150-200KB savings).
 *
 * Output: public/wallpaper/optimized-mobile/
 *
 * Usage: npx tsx scripts/generate-wallpaper-mobile.ts
 *        npm run generate:wallpaper-mobile
 */

import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

const SOURCE_DIR = path.join(__dirname, "../public/wallpaper/optimized-1080");
const OUTPUT_DIR = path.join(__dirname, "../public/wallpaper/optimized-mobile");

/** Target width for mobile variants (covers 430px × 3x DPR = 1290px) */
const MOBILE_WIDTH = 1280;

/** WebP quality (balancing size vs quality for full-screen display) */
const WEBP_QUALITY = 80;

async function main(): Promise<void> {
  console.log("Generating mobile wallpaper variants...\n");

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

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let successCount = 0;
  let failCount = 0;
  let totalSourceBytes = 0;
  let totalOutputBytes = 0;

  for (const wallpaper of wallpapers) {
    const inputPath = path.join(SOURCE_DIR, wallpaper);
    const outputPath = path.join(OUTPUT_DIR, wallpaper);

    try {
      const sourceStats = fs.statSync(inputPath);
      const sourceKB = Math.round(sourceStats.size / 1024);

      await sharp(inputPath).resize(MOBILE_WIDTH).webp({ quality: WEBP_QUALITY }).toFile(outputPath);

      const outputStats = fs.statSync(outputPath);
      const outputKB = Math.round(outputStats.size / 1024);
      const savings = sourceKB - outputKB;

      totalSourceBytes += sourceStats.size;
      totalOutputBytes += outputStats.size;
      successCount++;

      console.log(`  ✓ ${wallpaper}: ${sourceKB}KB → ${outputKB}KB (−${savings}KB)`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.log(`  ✗ ${wallpaper} → FAILED: ${message}`);
      failCount++;
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log(`Generated: ${successCount}/${wallpapers.length} mobile variants`);

  if (successCount > 0) {
    const totalSourceKB = Math.round(totalSourceBytes / 1024);
    const totalOutputKB = Math.round(totalOutputBytes / 1024);
    const totalSavingsKB = totalSourceKB - totalOutputKB;
    const avgOutputKB = Math.round(totalOutputBytes / successCount / 1024);

    console.log(`Total: ${totalSourceKB}KB → ${totalOutputKB}KB (−${totalSavingsKB}KB saved)`);
    console.log(`Average: ${avgOutputKB}KB per mobile variant`);
    console.log(`Output: ${OUTPUT_DIR}`);
  }

  if (failCount > 0) {
    console.log(`\nWarning: ${failCount} variant(s) failed to generate`);
    process.exit(1);
  }

  console.log("\nDone!");
}

main();
