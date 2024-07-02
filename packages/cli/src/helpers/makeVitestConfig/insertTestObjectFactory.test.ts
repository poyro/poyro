import { describe, it, expect } from "vitest";

import { transformSourceFile } from "../transformSourceFile";

import { insertTestObjectFactory } from "./insertTestObjectFactory";

describe("insertTestObjectFactory", () => {
  it("should insert 'test' object into the defineConfig call", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({});`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertTestObjectFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: {} });
      "
    `);
  });

  it("should not double insert 'test' object if it's already present", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";
    
            export default defineConfig({ test: {} });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertTestObjectFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: {} });
      "
    `);
  });

  it("should not mangle defineConfig call if it has other properties", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ foo: "bar" });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertTestObjectFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ foo: "bar", test: {} });
      "
    `);
  });

  it('should not break if there is no "defineConfig" call', () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertTestObjectFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
        "import { defineConfig } from "vitest/config";
        "
      `);
  });
});
