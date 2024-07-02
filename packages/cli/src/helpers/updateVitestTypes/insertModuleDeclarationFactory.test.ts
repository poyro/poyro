import { describe, it, expect } from "vitest";

import { transformSourceFile } from "../transformSourceFile";

import { insertModuleDeclarationFactory } from "./insertModuleDeclarationFactory";

describe("insertModuleDeclarationFactory", () => {
  it("should insert 'vitest' module declaration", () => {
    const sourceCodeText = ``;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertModuleDeclarationFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "declare module vitest { }
      "
    `);
  });

  it("should not double insert a default export of 'defineConfig' if it's already present", () => {
    const sourceCodeText = `declare module vitest { }`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertModuleDeclarationFactory,
    ]);

    expect(source).toMatchInlineSnapshot(`
      "declare module vitest { }
      "
    `);
  });
});
