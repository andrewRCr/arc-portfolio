/**
 * Generate favicon.ico and apple-icon.png from the SVG icon source.
 *
 * Usage: node scripts/generate-favicons.mjs
 *
 * Requires: sharp (project dependency), ImageMagick (system)
 */
import sharp from "sharp";
import { execSync } from "child_process";
import { mkdirSync, rmSync } from "fs";
import { join } from "path";

const APP_DIR = join(import.meta.dirname, "../src/app");
const TMP_DIR = join(import.meta.dirname, "../.favicon-tmp");

// Static SVG source — navy bg, white arch, rounded corners
// Used for .ico and apple-icon (no CSS media query — static single variant)
const staticSvg = (size, rx) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 536 536" width="${size}" height="${size}">
  <rect width="536" height="536" rx="${rx}" fill="#0B1F3A"/>
  <path fill="#ffffff" d="M465 421L268 421L268 332L378 332L378 298A110 100 0 0 0 158 298L158 421L71 421L71 296A197 182 0 0 1 465 296Z"/>
</svg>`;

async function main() {
  mkdirSync(TMP_DIR, { recursive: true });

  // Generate PNGs for .ico (16x16, 32x32, 48x48)
  const icoSizes = [16, 32, 48];
  const icoPaths = [];

  for (const size of icoSizes) {
    const outPath = join(TMP_DIR, `icon-${size}.png`);
    await sharp(Buffer.from(staticSvg(size, 60)))
      .resize(size, size)
      .png()
      .toFile(outPath);
    icoPaths.push(outPath);
    console.log(`  Created ${size}x${size} PNG`);
  }

  // Combine into .ico using ImageMagick
  const icoPath = join(APP_DIR, "favicon.ico");
  execSync(`convert ${icoPaths.join(" ")} ${icoPath}`);
  console.log(`  Created favicon.ico`);

  // Generate apple-icon.png (180x180, no rounded corners — iOS clips automatically)
  const applePath = join(APP_DIR, "apple-icon.png");
  await sharp(Buffer.from(staticSvg(180, 0)))
    .resize(180, 180)
    .png()
    .toFile(applePath);
  console.log(`  Created apple-icon.png (180x180)`);

  // Clean up temp files
  rmSync(TMP_DIR, { recursive: true });
  console.log("\nDone! Generated:\n  src/app/favicon.ico\n  src/app/apple-icon.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
