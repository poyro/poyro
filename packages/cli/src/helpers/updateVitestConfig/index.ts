import fs from "fs";
import chalk from "chalk";

import { insertImportDeclarationFactory } from "../../factories";

import { insertImportClauseFactory } from "./insertImportClauseFactory";
import { insertExportAssignmentFactory } from "./insertExportAssignmentFactory";
import { insertTestObjectFactory } from "./insertTestObjectFactory";
import { insertSetupFilesArrayFactory } from "./insertSetupFilesArrayFactory";
import { insertVitestSetupFactory } from "./insertVitestSetupFactory";
import { makeLogMessage } from "../makeLogMessage";
import { transformSourceFile } from "../transformSourceFile";

export const updateVitestConfig = async (filename: string): Promise<void> => {
  // Read the source code from the file
  const sourceCodeText = fs.readFileSync(filename, "utf8");

  // Transform the SourceFile AST
  const source = transformSourceFile(filename, sourceCodeText, [
    // 1. Insert 'vitest/config' import if it's missing
    insertImportDeclarationFactory("vitest/config"),
    // 2. Insert 'defineConfig' import if it's missing
    insertImportClauseFactory,
    // 3. Check for 'defineConfig' call + export default
    insertExportAssignmentFactory,
    // 4. Check for 'test' object in 'defineConfig'
    insertTestObjectFactory,
    // 5. Check for 'setupFiles' array in 'test' object and add if missing
    insertSetupFilesArrayFactory,
    // 6. Check for 'vitest.setup.js' in 'setupFiles' array and add if missing
    insertVitestSetupFactory,
  ]);

  // Write the transformed code to the file
  fs.writeFileSync(filename, source);

  // Log the success message
  console.log(
    makeLogMessage(
      `${chalk.blueBright(
        filename
      )} updated successfully to use ${chalk.blueBright("vitest.setup.js")}.`
    )
  );
};
