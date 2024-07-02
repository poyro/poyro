import { describe, it, expect } from "vitest";

import { transformSourceFile } from "../transformSourceFile";

import { insertImportClauseFactory } from "./insertImportClauseFactory";

describe("insertImportClauseFactory", () => {
  it("should insert 'defineConfig' named import into the 'vitest/config' import", () => {
    const sourceCodeText = `import "vitest/config";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertImportClauseFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";
      "
    `);
  });

  it("should not double insert 'defineConfig' import if it's already present", () => {
    const sourceCodeText = `import { defineConfig } from "vitest/config";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertImportClauseFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest/config";
      "
    `);
  });

  it("should not mangle the import if it has a default import", () => {
    const sourceCodeText = `import test from "vitest/config";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertImportClauseFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import test, { defineConfig } from "vitest/config";
      "
    `);
  });

  it("should not break if there's no import of 'vitest/config'", () => {
    const sourceCodeText = `import { foo } from "bar";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertImportClauseFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { foo } from "bar";
      "
    `);
  });
});
