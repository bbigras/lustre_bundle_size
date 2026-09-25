import { resolve } from "path";
import zlib from "node:zlib";
import { defineConfig } from "vite";

// plugins
import gleam from "vite-plugin-gleam";
import { compression, defineAlgorithm } from "vite-plugin-compression2";

export default defineConfig({
  plugins: [
    gleam(undefined),
    // tailwind()
    compression({
      algorithms: [
        defineAlgorithm("gzip", { level: 9 }),
        defineAlgorithm("brotliCompress", {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        }),
        // @ts-expect-error — `level` is accepted by vite-plugin-compression2 but not in Node's ZstdOptions type
        defineAlgorithm("zstd", { level: 22 }),
      ],
      threshold: 1024,
    }),
  ],
  resolve: {
    alias: {
      "@gleam": resolve(__dirname, "./build/dev/javascript"),
    },
  },
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            {
              name: "vendor-gleam",
              test: /\/build\/dev\/javascript\/(?!lustre_grid\/)/,
            },
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "@gleam/lustre/lustre.mjs",
      "@gleam/gleam_stdlib/gleam/list.mjs",
      "@gleam/gleam_stdlib/gleam/dict.mjs",
    ],
  },
});
