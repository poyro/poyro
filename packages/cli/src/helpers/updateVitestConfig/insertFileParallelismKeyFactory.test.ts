import { describe, it, expect } from "vitest";

import { transformSourceFile } from "../transformSourceFile";

import { insertFileParallelismKeyFactory } from "./insertFileParallelismKeyFactory";

describe("insertReporterVerboseKeyFactory", () => {
  it("should insert 'fileParallelism' false into the test object", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ test: {} });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
        insertFileParallelismKeyFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { fileParallelism: false } });
      "
    `);
  });

  it("should overwrite 'fileParallelism' false into the test object", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ test: { fileParallelism: true} });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
        insertFileParallelismKeyFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { fileParallelism: false } });
      "
    `);
  });

  it("should not mangle test object if it has other properties", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ test: { foo: "bar" } });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
        insertFileParallelismKeyFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { foo: "bar", fileParallelism: false } });
      "
    `);
  });

  it('should not break if there is no "test" object', () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({});`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
        insertFileParallelismKeyFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({});
      "
    `);
  });
});