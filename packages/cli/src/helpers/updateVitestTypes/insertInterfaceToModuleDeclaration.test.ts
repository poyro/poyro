import { describe, it, expect } from "vitest";

import { transformSourceFile } from "../transformSourceFile";

import { insertInterfaceToModuleDeclaration } from "./insertInterfaceToModuleDeclaration";

describe("insertInterfaceToModuleDeclaration", () => {
  it("should insert 'Assertion' interface extending 'VitestPoyroMatchers' to 'vitest' module declaration", () => {
    const sourceCodeText = `declare module vitest { }`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertInterfaceToModuleDeclaration(
        "Assertion",
        "VitestPoyroMatchers",
        true
      ),
    ]);

    expect(source).toMatchInlineSnapshot(`
      "declare module vitest {
          interface Assertion<T = any> extends VitestPoyroMatchers<T> {
          }
      }
      "
    `);
  });

  it("should insert two interfaces extending 'VitestPoyroMatchers' to 'vitest' module declaration", () => {
    const sourceCodeText = `declare module vitest { }`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertInterfaceToModuleDeclaration(
        "Assertion",
        "VitestPoyroMatchers",
        true
      ),
      insertInterfaceToModuleDeclaration(
        "AsymmetricMatchersContaining",
        "VitestPoyroMatchers"
      ),
    ]);

    expect(source).toMatchInlineSnapshot(`
      "declare module vitest {
          interface Assertion<T = any> extends VitestPoyroMatchers<T> {
          }
          interface AsymmetricMatchersContaining extends VitestPoyroMatchers {
          }
      }
      "
    `);
  });

  it("should not double insert a default export of 'defineConfig' if it's already present", () => {
    const sourceCodeText = `declare module vitest {
      interface Assertion<T = any> extends VitestPoyroMatchers<T> {}
    }`;

    const source = transformSourceFile("filename.ts", sourceCodeText, [
      insertInterfaceToModuleDeclaration(
        "Assertion",
        "VitestPoyroMatchers",
        true
      ),
    ]);

    expect(source).toMatchInlineSnapshot(`
      "declare module vitest {
          interface Assertion<T = any> extends VitestPoyroMatchers<T> {
          }
      }
      "
    `);
  });
});
