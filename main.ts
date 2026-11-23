// The World Today — 23 November 2026
// make.fun bounty news-image-20261123
//
// This script is the entry's runner. It takes the poster image that sits
// next to it (entry.png), checks that it really is one whole 1024x1024 PNG
// inside the size limit, and hands an exact copy to the harness through
// $MAKEFUN_OUTPUT_DIR. Nothing about the picture is changed along the way:
// the copy the harness receives is byte-for-byte the file in this folder.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576;
const WANTED_WIDTH = 1024;
const WANTED_HEIGHT = 1024;

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const IEND_TAIL = Buffer.from([
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function sha256Hex(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

// Standard CRC-32 (IEEE 802.3), the checksum PNG uses for every chunk.
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) {
    c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const sourcePath = join(here, "entry.png");

  if (!existsSync(sourcePath)) {
    fail(`entry.png not found next to main.ts (${sourcePath})`);
  }

  const image = readFileSync(sourcePath);

  if (image.length > MAX_BYTES) {
    fail(
      `entry.png is ${image.length} bytes, over the ${MAX_BYTES} byte limit`,
    );
  }

  // 1. The eight-byte PNG signature must be intact.
  if (image.length < 8 || !image.subarray(0, 8).equals(PNG_MAGIC)) {
    fail("entry.png does not start with the PNG signature");
  }

  // 2. The first chunk must be a 13-byte IHDR chunk.
  if (image.length < 33) {
    fail("entry.png is too short to hold a PNG header");
  }
  const firstLength = image.readUInt32BE(8);
  const firstType = image.subarray(12, 16).toString("latin1");
  if (firstLength !== 13 || firstType !== "IHDR") {
    fail(`first chunk is ${firstType} (${firstLength} bytes), expected IHDR (13)`);
  }

  // 3. The IHDR dimensions must be exactly 1024x1024.
  const width = image.readUInt32BE(16);
  const height = image.readUInt32BE(20);
  if (width !== WANTED_WIDTH || height !== WANTED_HEIGHT) {
    fail(`image is ${width}x${height}, expected 1024x1024`);
  }

  // 3b. The IHDR chunk's stored CRC must match the data it covers, so a
  // header that was edited or truncated by hand cannot slip through.
  const storedCrc = image.readUInt32BE(29);
  const computedCrc = crc32(image.subarray(12, 29));
  if (storedCrc !== computedCrc) {
    fail(
      `IHDR CRC mismatch (stored ${storedCrc.toString(16)}, computed ${computedCrc.toString(16)})`,
    );
  }

  // 4. The file must end with a proper IEND chunk.
  if (!image.subarray(image.length - 12).equals(IEND_TAIL)) {
    fail("entry.png does not end with a valid IEND chunk");
  }

  const digest = sha256Hex(image);
  console.log(`entry.png: ${image.length} bytes`);
  console.log(`sha256: ${digest}`);

  // 5. Copy byte-for-byte into the harness output directory.
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.png");
  writeFileSync(outPath, image);

  // 6. Read the copy back and demand an exact match.
  const copy = readFileSync(outPath);
  if (!copy.equals(image)) {
    fail("copied entry.png differs from the source — refusing to continue");
  }

  console.log(`wrote ${outPath} (${copy.length} bytes, sha256 matches)`);
}

main();
