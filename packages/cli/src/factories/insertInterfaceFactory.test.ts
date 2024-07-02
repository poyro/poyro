import { describe, it, expect } from "vitest";

import { transformSourceFile } from "../helpers/transformSourceFile";

import { insertInterfaceFactory } from "./insertInterfaceFactory";

describe("insertInterfaceFactory", () => {
  it("should insert 'Assertion' named type import into the 'vitest' import", () => {
    const sourceCodeText = `import "vitest";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertInterfaceFactory("Assertion", "vitest"),
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import type { Assertion } from "vitest";
      "
    `);
  });

  it("should not double insert 'Assertion' type import if it's already present", () => {
    const sourceCodeText = `import type { Assertion } from "vitest";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertInterfaceFactory("Assertion", "vitest"),
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import type { Assertion } from "vitest";
      "
    `);
  });

  it("should correctly insert a second type import", () => {
    const sourceCodeText = `import type { Assertion } from "vitest";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertInterfaceFactory("AsymmetricMatchersContaining", "vitest"),
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import type { Assertion, AsymmetricMatchersContaining } from "vitest";
      "
    `);
  });

  it("should not mangle the import if it has a default import", () => {
    const sourceCodeText = `import test from "vitest";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertInterfaceFactory("Assertion", "vitest"),
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import test, { Assertion } from "vitest";
      "
    `);
  });

  it("should not break if there's no import of 'vitest'", () => {
    const sourceCodeText = `import { foo } from "bar";`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertInterfaceFactory("Assertion", "vitest"),
    ]);

    expect(source).toMatchInlineSnapshot(`
      "import { foo } from "bar";
      "
    `);
  });
});
