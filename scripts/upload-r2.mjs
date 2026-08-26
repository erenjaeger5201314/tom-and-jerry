#!/usr/bin/env node
/**
 * Upload encoded/epNNN.mp4 to Cloudflare R2.
 *
 *   npx wrangler login
 *   node scripts/upload-r2.mjs ./encoded
 *
 * Env (optional): R2_BUCKET  (default tom-jerry-films)
 *
 * Without wrangler, upload the same filenames in the Cloudflare dashboard:
 *   R2 → bucket → Upload → ep001.mp4 … ep114.mp4
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const srcDir = process.argv[2] || "encoded";
const bucket = process.env.R2_BUCKET || "tom-jerry-films";

if (!existsSync(srcDir)) {
  console.error(`Missing folder: ${srcDir}`);
  process.exit(1);
}

const files = readdirSync(srcDir)
  .filter((f) => /^ep\d{3}\.mp4$/i.test(f))
  .sort();

if (files.length === 0) {
  console.error(`No epNNN.mp4 files in ${srcDir}`);
  process.exit(1);
}

const probe = spawnSync("npx", ["wrangler", "--version"], {
  encoding: "utf8",
  shell: process.platform === "win32",
});
if (probe.error || (probe.status !== 0 && probe.status !== null)) {
  console.log(`Found ${files.length} files. wrangler not available.`);
  console.log("Upload them in the Cloudflare dashboard to bucket:", bucket);
  console.log(files.map((f) => `  ${f}`).join("\n"));
  process.exit(0);
}

for (const file of files) {
  const key = file.toLowerCase();
  const local = join(srcDir, file);
  console.log(`put ${bucket}/${key}`);
  const result = spawnSync(
    "npx",
    [
      "wrangler",
      "r2",
      "object",
      "put",
      `${bucket}/${key}`,
      "--file",
      local,
      "--content-type",
      "video/mp4",
      "--remote",
    ],
    { stdio: "inherit", shell: process.platform === "win32" },
  );
  if (result.status !== 0) {
    console.error(`upload failed: ${file}`);
    process.exit(result.status ?? 1);
  }
}

console.log(`\nUploaded ${files.length} objects to ${bucket}.`);
console.log("Enable public access on the bucket, then put the public base URL");
console.log("into src/data/video-cdn.json → baseUrl  (no trailing slash).");
