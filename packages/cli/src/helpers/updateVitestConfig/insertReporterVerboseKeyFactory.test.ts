import { describe, it, expect } from "vitest";

import { transformSourceFile } from "../transformSourceFile";

import { insertReporterVerboseKeyFactory } from "./insertReporterVerboseKeyFactory";

describe("insertReporterVerboseKeyFactory", () => {
  it("should insert 'reporter' 'verbose' into the test object", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ test: {} });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
        insertReporterVerboseKeyFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { reporter: "verbose" } });
      "
    `);
  });

  it("should overwrite 'reporter' 'verbose' into the test object", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ test: { reporter: "basic"} });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertReporterVerboseKeyFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { reporter: "verbose" } });
      "
    `);
  });

  it("should not mangle test object if it has other properties", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ test: { foo: "bar" } });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertReporterVerboseKeyFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { foo: "bar", reporter: "verbose" } });
      "
    `);
  });

  it('should not break if there is no "test" object', () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({});`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertReporterVerboseKeyFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({});
      "
    `);
  });
});
