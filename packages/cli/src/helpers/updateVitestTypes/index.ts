import chalk from "chalk";
import fs from "fs";

import { checkFileExists } from "../checkFileExists";
import { makeLogMessage } from "../makeLogMessage";
import { transformSourceFile } from "../transformSourceFile";
import {
  insertImportDeclarationFactory,
  insertInterfaceFactory,
} from "../../factories";

import { insertModuleDeclarationFactory } from "./insertModuleDeclarationFactory";
import { insertInterfaceToModuleDeclaration } from "./insertInterfaceToModuleDeclaration";

export const updateVitestTypes = async () => {
  // Check if the tsconfig.json file exists
  const [tsconfigExists] = checkFileExists("tsconfig.json");

  // If the tsconfig.json file does not exist,
  // bail since there are no types to update
  if (!tsconfigExists) {
    return;
  }

  // Check if the vitest.d.ts file exists
  const [typeFileExists, filename] = checkFileExists("vitest.d.ts");

  if (!typeFileExists) {
    // Create the vitest config file
    await fs.writeFileSync(
      filename,
      `import type { Assertion, AsymmetricMatchersContaining } from "vitest";
import { VitestPoyroMatchers } from "@poyro/vitest";

declare module "vitest" {
  interface Assertion<T = any> extends VitestPoyroMatchers<T> {}
  interface AsymmetricMatchersContaining extends VitestPoyroMatchers {}
}\n`
    );

    // Log the success message
    return console.log(
      makeLogMessage(`${chalk.blueBright("vitest.d.ts")} created successfully.`)
    );
  }

  // Read the source code from the file
  const sourceCodeText = fs.readFileSync(filename, "utf8");

  // Transform the SourceFile AST
  const source = transformSourceFile(filename, sourceCodeText, [
    // 1. Insert 'vitest' import declaration
    insertImportDeclarationFactory("vitest"),
    // 2. Insert 'Assertion' interface type named import
    insertInterfaceFactory("Assertion", "vitest"),
    // 3. Insert 'AsymmetricMatchersContaining' interface type named import
    insertInterfaceFactory("AsymmetricMatchersContaining", "vitest"),
    // 3. Insert '@poyro/vitest' import declaration
    insertImportDeclarationFactory("@poyro/vitest"),
    // 4. Insert 'VitestPoyroMatchers' type named import
    insertInterfaceFactory("VitestPoyroMatchers", "@poyro/vitest"),
    // 5. Insert 'vitest' module declaration
    insertModuleDeclarationFactory,
    // 6. Insert 'Assertion' interface type extensions
    insertInterfaceToModuleDeclaration(
      "Assertion",
      "VitestPoyroMatchers",
      true
    ),
    // 7. Insert 'AsymmetricMatchersContaining' interface type extensions
    insertInterfaceToModuleDeclaration(
      "AsymmetricMatchersContaining",
      "VitestPoyroMatchers"
    ),
  ]);

  // Write the transformed code to the file
  fs.writeFileSync(filename, source);

  // Log the success message
  console.log(
    makeLogMessage(
      `${chalk.blueBright(
        "vitest.d.ts"
      )} updated successfully to reference ${chalk.blueBright("@poyro/vitest")} types.`
    )
  );
};
