import { describe, it, expect } from "vitest";

import { transformSourceFile } from "../transformSourceFile";

import { insertSetupFilesArrayFactory } from "./insertSetupFilesArrayFactory";

describe("insertSetupFilesArrayFactory", () => {
  it("should insert 'setupFiles' array into the test object", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ test: {} });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertSetupFilesArrayFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { setupFiles: [] } });
      "
    `);
  });

  it("should not double insert 'setupFiles' array if it's already present", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";
    
        export default defineConfig({ test: { setupFiles: [] } });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertSetupFilesArrayFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { setupFiles: [] } });
      "
    `);
  });

  it("should not mangle test object if it has other properties", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ test: { foo: "bar" } });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertSetupFilesArrayFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { foo: "bar", setupFiles: [] } });
      "
    `);
  });

  it('should not break if there is no "test" object', () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({});`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertSetupFilesArrayFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({});
      "
    `);
  });
});
