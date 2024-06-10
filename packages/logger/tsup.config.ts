import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts"],
  clean: false,
  dts: true,
  format: ["cjs"],
  ...options,
}));
