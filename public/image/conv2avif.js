/**
 * ==========================================
 * AVIF Converter (conv2avif.js)
 * ==========================================
 *
 * Purpose
 * - A script to convert PNG, JPG, and JPEG images to AVIF format
 *   in order to optimize web performance.
 * - AVIF is a next-generation image format that provides high compression
 *   efficiency and excellent visual quality.
 *
 * How it works
 * - Accepts either a single image file or a directory containing images.
 * - Processes files with .png, .jpg, or .jpeg extensions and converts them to .avif.
 * - Uses the "sharp" library for image processing and format conversion.
 * - Allows quality control via the --quality option (range: 1 to 100, default: 75).
 *
 * Usage
 * node conv2avif.js <path> [--quality=number]
 *
 * Examples
 * - Convert a single image:
 *     node conv2avif.js ./logo.png --quality=80
 *
 * - Convert all supported images in a directory:
 *     node conv2avif.js ./images/ --quality=60
 *
 * Supported Formats
 * - Input: .png, .jpg, .jpeg
 * - Output: .avif
 *
 * Dependencies
 * - sharp: https://github.com/lovell/sharp
 *
 * Notes
 * - AVIF is not supported by all browsers. It is recommended to provide
 *   fallback images (e.g., webp, png) for compatibility.
**/

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SUPPORTED_EXTENSIONS = [".png", ".jpg", ".jpeg"];

async function convertToAvif(filePath, quality = 75) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    console.log(`Unsupported extension: ${ext} - Skipping`);
    return;
  }

  const outputPath = filePath.replace(ext, ".avif");

  try {
    await sharp(filePath)
      .avif({ quality })
      .toFile(outputPath);

    console.log(`Converted: ${filePath} -> ${outputPath} (quality=${quality})`);
  } catch (err) {
    console.error(`Failed to convert ${filePath}: ${err.message}`);
  }
}

async function processDirectory(dirPath, quality) {
  const files = fs.readdirSync(dirPath).filter(file =>
    SUPPORTED_EXTENSIONS.includes(path.extname(file).toLowerCase())
  );

  if (files.length === 0) {
    console.log("No supported image files found in the directory.");
    return;
  }

  process.stdout.write(`${files.length} files will be converted to AVIF. Proceed? [Y/n] `);
  process.stdin.once("data", async (input) => {
    const answer = input.toString().trim().toLowerCase();
    if (answer && answer !== "y" && answer !== "yes") {
      console.log("Operation cancelled.");
      return;
    }

    for (const file of files) {
      await convertToAvif(path.join(dirPath, file), quality);
    }
    process.exit();
  });
}

async function main() {
  const args = process.argv.slice(2);
  const targetPath = args[0];
  const qualityArg = args.find(arg => arg.startsWith("--quality="));
  const quality = qualityArg ? parseInt(qualityArg.split("=")[1]) : 75;

  if (!targetPath || !fs.existsSync(targetPath)) {
    console.error("Invalid or missing path.");
    return;
  }

  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    await processDirectory(targetPath, quality);
  } else if (stat.isFile()) {
    await convertToAvif(targetPath, quality);
  } else {
    console.error("Path must be a file or directory.");
  }
}

main();