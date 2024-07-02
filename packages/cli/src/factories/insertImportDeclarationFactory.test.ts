import { describe, it, expect } from "vitest";

import { transformSourceFile } from "../helpers/transformSourceFile";

import { insertImportDeclarationFactory } from "./insertImportDeclarationFactory";

describe("insertImportDeclarationFactory", () => {
  it("should insert 'vitest' import into the file", () => {
    const sourceCodeText = ``;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertImportDeclarationFactory("vitest"),
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import "vitest";
      "
    `);
  });

  it("should not double insert 'vitest' import if it's already present", () => {
    const sourceCodeText = `import "vitest";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertImportDeclarationFactory("vitest"),
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import "vitest";
      "
    `);
  });

  it("should not mangle the import if it has named imports", () => {
    const sourceCodeText = `import { defineConfig } from "vitest";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertImportDeclarationFactory("vitest"),
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { defineConfig } from "vitest";
      "
    `);
  });

  it("should not mangle the import if it has a default import", () => {
    const sourceCodeText = `import test from "vitest";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertImportDeclarationFactory("vitest"),
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import test from "vitest";
      "
    `);
  });

  it("should not mangle the import if it has both a default import and named imports", () => {
    const sourceCodeText = `import test, { defineConfig } from "vitest";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertImportDeclarationFactory("vitest"),
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import test, { defineConfig } from "vitest";
      "
    `);
  });
});
