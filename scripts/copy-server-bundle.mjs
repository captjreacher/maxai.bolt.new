// scripts/copy-server-bundle.mjs
import { rm, mkdir, cp } from "node:fs/promises";
import { resolve } from "node:path";

const srcDir = resolve("build/server");
const dstDir = resolve("functions/_server");

// Clean destination, then copy whole dir (index.js + assets + manifest)
await rm(dstDir, { recursive: true, force: true });
await mkdir(dstDir, { recursive: true });
await cp(srcDir, dstDir, { recursive: true });

console.log(`[postbuild] Copied ${srcDir} -> ${dstDir}`);
