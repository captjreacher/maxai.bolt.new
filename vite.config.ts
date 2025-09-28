import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import UnoCSS from "unocss/vite";
import { vitePlugin as remixVitePlugin } from "@remix-run/dev";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ mode }) => ({
  build: { target: "esnext" },
  resolve: {
    alias: {
      path: "path-browserify",
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    include: ["buffer", "path-browserify"],
  },
  plugins: [
    tsconfigPaths(),
    UnoCSS(),
    nodePolyfills({
      protocolImports: true,        // handles `node:...` if any sneak back in
      include: ["buffer", "path"],  // polyfill these
      globals: { Buffer: true, process: true }, // make global Buffer/process available
    }),
    remixVitePlugin({
      buildDirectory: "build",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
  ],
}));


