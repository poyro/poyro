import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts"],
  external: ["typescript"],
  format: ["esm"],
  clean: false,
  dts: true,
  ...options,
}));
