import fs from "fs";
import path from "path";

import chalk from "chalk";
import fg from "fast-glob";
import * as ts from "typescript";

import { makeLogMessage } from "./makeLogMessage";
import { decodeEmptyLines } from "./decodeEmptyLines";
import { encodeEmptyLines } from "./encodeEmptyLines";

export const makeVitestSetup = async (): Promise<void> => {
  // Get the current working directory
  const cwd = process.cwd();

  // Get the vitest setup file
  const files = await fg.glob(["**/vitest.setup.*"], {
    ignore: ["**/node_modules/**"],
    cwd,
  });

  // Check if multiple vitest setup files exist
  if (files.length > 1) {
    throw new Error(
      makeLogMessage(
        `Multiple 'vitest.setup.js/ts' files found. Please keep only one and try this command again.`
      )
    );
  }

  // If the vitest setup file doesn't exist, create it
  if (files.length === 0) {
    // Create the vitest setup file
    console.log(
      makeLogMessage(
        `No 'vitest.setup.js/ts' file found. Creating ${chalk.blueBright("vitest.setup.js")}...`
      )
    );

    // Get the vitest setup file path
    const vitestSetupPath = path.join(cwd, "vitest.setup.js");

    // Create the vitest setup file
    await fs.writeFileSync(vitestSetupPath, `import "@poyro/vitest";\n`);

    // Log the success message
    return console.log(
      makeLogMessage(
        `${chalk.blueBright("vitest.setup.js")} created successfully.`
      )
    );
  }

  // Get the vitest setup file path
  const filename = files.pop() as string;

  // Read the source code from the file
  const sourceCodeText = fs.readFileSync(filename, "utf8");

  // Create a SourceFile from the source code
  const sourceFile = ts.createSourceFile(
    filename, // file name
    encodeEmptyLines(sourceCodeText), // source code text
    ts.ScriptTarget.Latest // TypeScript version target
  );

  // Traverse the AST to check if the import is already present
  let hasImport = false;
  ts.forEachChild(sourceFile, (node) => {
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text === "@poyro/vitest"
    ) {
      hasImport = true;
    }
  });

  if (hasImport) {
    return console.log(
      makeLogMessage(
        `${chalk.blueBright("@poyro/vitest")} is already imported in ${chalk.blueBright(
          filename
        )}.`
      )
    );
  }

  // Get all import declaration nodes
  const extImportDeclarations = sourceFile.statements.filter(
    (node) =>
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      !node.moduleSpecifier.text.startsWith(".")
  );

  // Get last import declaration node
  const lastExtImportDeclaration =
    extImportDeclarations[extImportDeclarations.length - 1];

  // Function to transform the AST
  const insertPoyroFactory: ts.TransformerFactory<ts.SourceFile> = (
    context
  ) => {
    return (rootNode) => {
      const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
        // Get only ImportDeclaration nodes
        if (ts.isImportDeclaration(node) && node === lastExtImportDeclaration) {
          // Create a new ImportDeclaration node
          const importDeclaration = context.factory.createImportDeclaration(
            undefined,
            undefined,
            context.factory.createStringLiteral("@poyro/vitest")
          );

          // Return the new ImportDeclaration node after the last ImportDeclaration node
          return [node, importDeclaration];
        }

        return ts.visitEachChild(node, visit, context);
      };

      const updates = ts.visitNode(rootNode, visit) as ts.SourceFile;

      return context.factory.updateSourceFile(updates, [...updates.statements]);
    };
  };

  // Initialize transformation with the initial context
  const transformedSourceFile = ts.transform(sourceFile, [insertPoyroFactory]);

  // Create a printer to print the transformed AST
  const printer = ts.createPrinter();

  // if no changes were made, don't write to the file
  if (transformedSourceFile.transformed.every((f) => f === undefined)) {
    return;
  }

  // Generate code from AST
  const [[, source]] = transformedSourceFile.transformed.map((f) => [
    f.fileName,
    printer.printNode(ts.EmitHint.Unspecified, f, undefined as any),
  ]);

  // Write the transformed code to the file
  fs.writeFileSync(filename, decodeEmptyLines(source));

  // Log the success message
  console.log(
    makeLogMessage(
      `${chalk.blueBright(
        filename
      )} updated successfully with ${chalk.blueBright("@poyro/vitest")} import.`
    )
  );
};
