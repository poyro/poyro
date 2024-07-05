import { describe, it, expect } from "vitest";

import { transformSourceFile } from "../transformSourceFile";

import { insertForkKeyFactory } from "./insertForkKeyFactory";

describe("insertForkKeyFactory", () => {
  it("should insert 'pool' 'forks' into the test object", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ test: {} });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertForkKeyFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { pool: "forks" } });
      "
    `);
  });

  it("should overwrite 'pool' 'forks' into the test object", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ test: { pool: "threads"} });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertForkKeyFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { pool: "forks" } });
      "
    `);
  });

  it("should not mangle test object if it has other properties", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({ test: { foo: "bar" } });`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertForkKeyFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({ test: { foo: "bar", pool: "forks" } });
      "
    `);
  });

  it('should not break if there is no "test" object', () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";

    export default defineConfig({});`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertForkKeyFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";

      export default defineConfig({});
      "
    `);
  });
});