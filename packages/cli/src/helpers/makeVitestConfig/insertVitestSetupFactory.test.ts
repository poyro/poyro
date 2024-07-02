import { describe, it, expect } from "vitest";

import { transformSourceFile } from "../transformSourceFile";

import { insertVitestSetupFactory } from "./insertVitestSetupFactory";

describe("insertVitestSetupFactory", () => {
  it("should insert 'vitest.setup.js' into the setupFiles array", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ test: { setupFiles: [] } });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertVitestSetupFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { setupFiles: ["vitest.setup.js"] } });
      "
    `);
  });

  it("should not double insert 'vitest.setup.js' into the setupFiles array if it's already present", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ test: { setupFiles: ["vitest.setup.js"] } });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertVitestSetupFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { setupFiles: ["vitest.setup.js"] } });
      "
    `);
  });

  it("should not break if the setupFiles array is not present", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ test: {} });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertVitestSetupFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: {} });
      "
    `);
  });
});
