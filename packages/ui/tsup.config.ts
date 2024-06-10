import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["./src/index.tsx"],
  format: ["cjs", "esm"],
  clean: false,
  dts: true,
  external: ["react"],
  banner: {
    js: "'use client'",
  },
  ...options,
}));
