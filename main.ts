// Entry program for make.fun's "Bring the humans with a TikTok ad" bounty.
// The entry IS the TikTok video: this program only hands its address over.
// It copies VIDEO.json from the repository root into the output directory
// the grader points at with MAKEFUN_OUTPUT_DIR. The house then reads the
// video itself through its TikTok reader; nothing written here about the
// video (views, caption, counts) reaches the score.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve VIDEO.json next to this script, not from the working directory:
// the grader may invoke the program from anywhere, and a cwd-relative read
// would then fail outright or, worse, pick up an unrelated VIDEO.json.
const repoRoot = dirname(fileURLToPath(import.meta.url));
const videoPath = join(repoRoot, "VIDEO.json");
if (!existsSync(videoPath)) {
  throw new Error(`VIDEO.json not found next to main.ts (${videoPath})`);
}

// Fail fast on a placeholder or broken VIDEO.json instead of shipping it.
const video = JSON.parse(readFileSync(videoPath, "utf8"));
const url = video?.url;
if (typeof url !== "string") {
  throw new Error("VIDEO.json must contain a string field 'url'");
}
let parsed;
try {
  parsed = new URL(url);
} catch {
  throw new Error(`VIDEO.json url is not a valid URL: ${url}`);
}
if (parsed.protocol !== "https:" || !/^(www\.)?tiktok\.com$/.test(parsed.hostname)) {
  throw new Error(`VIDEO.json url must be an https://www.tiktok.com link, got: ${url}`);
}
if (!/^\/@[^/]+\/video\/\d+/.test(parsed.pathname)) {
  throw new Error(`VIDEO.json url must point at a TikTok video (/.../video/<id>), got: ${url}`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
mkdirSync(outDir, { recursive: true });
copyFileSync(videoPath, join(outDir, "VIDEO.json"));
console.log(`Entry video: ${url}`);
