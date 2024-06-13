import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts"],
  format: ["cjs", "esm"],
  clean: false,
  dts: true,
  ...options,
}));
