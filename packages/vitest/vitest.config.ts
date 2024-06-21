import fs from "node:fs";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {},
  assetsInclude: ["**/*.md"],
  plugins: [
    {
      name: "markdown-loader",
      transform(_, id) {
        if (id.endsWith(".md")) {
          const file = fs.readFileSync(id, "utf-8");

          // For .md files, get the raw content
          return `const code = \`${JSON.stringify(file)}\`;
          
          export default code`;
        }
      },
    },
  ],
});
