import { describe, it, expect } from "vitest";

import { transformSourceFile } from "../transformSourceFile";

import { insertExportAssignmentFactory } from "./insertExportAssignmentFactory";

describe("insertExportAssignmentFactory", () => {
  it("should insert 'vitest.setup.js' into the setupFiles array", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertExportAssignmentFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";
      export default defineConfig({});
      "
    `);
  });

  it("should not double insert a default export of 'defineConfig' if it's already present", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { setupFiles: ["vitest.setup.js"] } });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertExportAssignmentFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { setupFiles: ["vitest.setup.js"] } });
      "
    `);
  });
});
