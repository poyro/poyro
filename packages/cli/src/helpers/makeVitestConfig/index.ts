import fs from "fs";
import path from "path";

import chalk from "chalk";
import fg from "fast-glob";

import { insertImportDeclarationFactory } from "../../factories";

import { insertImportClauseFactory } from "./insertImportClauseFactory";
import { insertExportAssignmentFactory } from "./insertExportAssignmentFactory";
import { insertTestObjectFactory } from "./insertTestObjectFactory";
import { insertSetupFilesArrayFactory } from "./insertSetupFilesArrayFactory";
import { insertVitestSetupFactory } from "./insertVitestSetupFactory";
import { makeLogMessage } from "../makeLogMessage";
import { transformSourceFile } from "../transformSourceFile";

export const makeVitestConfig = async (): Promise<void> => {
  // Get the current working directory
  const cwd = process.cwd();

  // Get the vitest config file
  const files = await fg.glob(["**/vitest.config.*"], {
    ignore: ["**/node_modules/**"],
    cwd,
  });

  // Check if multiple vitest config files exist
  if (files.length > 1) {
    throw new Error(
      makeLogMessage(
        `Multiple 'vitest.config.js/ts' files found. Please keep only one and try this command again.`
      )
    );
  }

  // If the vitest config file doesn't exist, create it
  if (files.length === 0) {
    // Create the vitest config file
    console.log(
      makeLogMessage(
        `No 'vitest.config.js/ts' file found. Creating ${chalk.blueBright("vitest.config.js")}...`
      )
    );

    // Get the vitest config file path
    const vitestSetupPath = path.join(cwd, "vitest.config.js");

    // Create the vitest config file
    await fs.writeFileSync(
      vitestSetupPath,
      `import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["vitest.setup.js"],
  },
});\n`
    );

    // Log the success message
    return console.log(
      makeLogMessage(
        `${chalk.blueBright("vitest.config.js")} created successfully.`
      )
    );
  }

  // Get the vitest config file path
  const filename = files.pop() as string;

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
