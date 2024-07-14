import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts", "src/config.ts", "src/functions.ts"],
  format: ["esm"],
  clean: false,
  dts: true,
  loader: {
    ...options.loader,
    ".md": "text",
  },
  ...options,
}));
