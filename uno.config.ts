// uno.config.ts
import { defineConfig, presetWind, transformerDirectives, transformerVariantGroup } from "unocss";
import presetIcons from "@unocss/preset-icons";
import { globSync } from "fast-glob";
import fs from "node:fs";
import { basename } from "node:path";

// Optional: load all local SVGs in ./icons as a custom icon collection
const iconPaths = globSync("./icons/*.svg");
const customIcons: Record<string, string> = {};
for (const p of iconPaths) {
  customIcons[basename(p).replace(/\.svg$/, "")] = fs.readFileSync(p, "utf8");
}

export default defineConfig({
  presets: [
    presetWind(),
    presetIcons({
      collections: {
        bolt: customIcons, // use like: i-bolt:icon-name
      },
    }),
  ],
  transformers: [
    transformerDirectives(),       // supports @apply, @screen, etc.
    transformerVariantGroup(),     // supports hover:(bg-red text-white) style grouping
  ],
});
