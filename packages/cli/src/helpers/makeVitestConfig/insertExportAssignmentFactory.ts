import chalk from "chalk";
import * as ts from "typescript";

import { makeLogMessage } from "../makeLogMessage";

/**
 * Function to insert the ImportClause node
 *
 * @param context - The transformation context
 * @returns The transformation function
 */
export const insertExportAssignmentFactory: ts.TransformerFactory<
  ts.SourceFile
> = (context) => {
  return (rootNode) => {
    let hasExportDefault = false;

    ts.forEachChild(rootNode, (node) => {
      if (
        ts.isExportAssignment(node) &&
        ts.isCallExpression(node.expression) &&
        ts.isIdentifier(node.expression.expression)
      ) {
        if (node.expression.expression.text === "defineConfig") {
          hasExportDefault = true;
        } else {
          throw new Error(
            makeLogMessage(
              `Exporting a non-defineConfig expression is not supported in ${chalk.blueBright("vitest.config.js")}.`
            )
          );
        }
      }
    });

    if (hasExportDefault) {
      return rootNode;
    }

    // Create a new ImportDeclaration node
    const exportAssignment = context.factory.createExportAssignment(
      undefined,
      undefined,
      context.factory.createCallExpression(
        context.factory.createIdentifier("defineConfig"),
        undefined,
        [context.factory.createObjectLiteralExpression([])]
      )
    );

    const updates = context.factory.createNodeArray([
      ...rootNode.statements,
      exportAssignment,
    ]);

    return context.factory.updateSourceFile(rootNode, updates);
  };
};
