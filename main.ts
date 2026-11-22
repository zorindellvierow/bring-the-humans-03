// Entry program for make.fun's "Bring the humans with a TikTok ad" bounty.
// The entry IS the TikTok video: this program only hands its address over.
// It copies VIDEO.json from the repository root into the output directory
// the grader points at with MAKEFUN_OUTPUT_DIR. The house then reads the
// video itself through its TikTok reader; nothing written here about the
// video (views, caption, counts) reaches the score.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";

// Fail fast on a placeholder or broken VIDEO.json instead of shipping it.
const video = JSON.parse(readFileSync("VIDEO.json", "utf8"));
if (typeof video?.url !== "string" || !video.url.startsWith("https://www.tiktok.com/")) {
  throw new Error("VIDEO.json must name a TikTok video URL");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
mkdirSync(outDir, { recursive: true });
copyFileSync("VIDEO.json", `${outDir}/VIDEO.json`);
