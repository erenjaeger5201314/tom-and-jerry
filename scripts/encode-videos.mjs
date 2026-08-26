#!/usr/bin/env node
/**
 * Local H.264 encode for browser playback. Do not transcode in the cloud.
 *
 *   node scripts/encode-videos.mjs ./originals ./encoded
 *
 * Input names it understands: ep001.mp4, 001.mkv, "Tom and Jerry - 001 - ….mp4"
 * Output: encoded/ep001.mp4  (H.264 yuv420p + AAC + faststart, max 720px)
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";

const srcDir = process.argv[2] || "originals";
const outDir = process.argv[3] || "encoded";
const VIDEO_EXT = new Set([".mp4", ".mkv", ".mov", ".avi", ".webm", ".m4v"]);

function episodeId(name) {
  const ep = name.match(/ep\s*(\d{1,3})/i);
  if (ep) return Number(ep[1]);
  const dashed = name.match(/[-_ ](\d{3})[-_ ]/);
  if (dashed) return Number(dashed[1]);
  const start = name.match(/^(\d{1,3})\./);
  if (start) return Number(start[1]);
  return null;
}

const ff = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
if (ff.error || ff.status !== 0) {
  console.error("ffmpeg not found. Install ffmpeg and retry.");
  process.exit(1);
}

if (!existsSync(srcDir)) {
  console.error(`Missing input folder: ${srcDir}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const files = readdirSync(srcDir).filter((f) =>
  VIDEO_EXT.has(extname(f).toLowerCase()),
);
if (files.length === 0) {
  console.error(`No video files in ${srcDir}`);
  process.exit(1);
}

let ok = 0;
let skip = 0;
for (const file of files) {
  const id = episodeId(file);
  if (!id || id < 1 || id > 114) {
    console.warn(`skip (no episode number): ${file}`);
    skip += 1;
    continue;
  }
  const out = join(outDir, `ep${String(id).padStart(3, "0")}.mp4`);
  console.log(`\n[${id}] ${file} → ${out}`);
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      join(srcDir, file),
      "-map",
      "0:v:0",
      "-map",
      "0:a:0?",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-profile:v",
      "high",
      "-level",
      "4.0",
      "-vf",
      "scale='min(720,iw)':-2",
      "-crf",
      "26",
      "-preset",
      "medium",
      "-movflags",
      "+faststart",
      "-c:a",
      "aac",
      "-b:a",
      "96k",
      "-ac",
      "2",
      out,
    ],
    { stdio: "inherit" },
  );
  if (result.status !== 0) {
    console.error(`ffmpeg failed: ${file}`);
    process.exit(result.status ?? 1);
  }
  ok += 1;
}

console.log(`\nDone. encoded=${ok} skipped=${skip} → ${outDir}`);
console.log("Next: node scripts/upload-r2.mjs ./encoded");
