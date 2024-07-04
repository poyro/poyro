import * as ts from "typescript";

/**
 * Function to insert the ImportClause node
 *
 * @param context - The transformation context
 * @returns The transformation function
 */
export const insertVitestSetupFactory: ts.TransformerFactory<ts.SourceFile> = (
  context
) => {
  return (rootNode) => {
    const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
      // Get PropertyAssignment nodes
      if (
        ts.isPropertyAssignment(node) &&
        ts.isIdentifier(node.name) &&
        node.name.text === "setupFiles"
      ) {
        // Check if the PropertyAssignment node has an ArrayLiteralExpression
        if (ts.isArrayLiteralExpression(node.initializer)) {
          // Get the ArrayLiteralExpression node
          const arrayLiteral = node.initializer;

          // Check if the ArrayLiteralExpression node includes "vitest.setup.js"
          if (
            arrayLiteral.elements.find(
              (element) =>
                ts.isStringLiteral(element) &&
                element.text === "vitest.setup.js"
            )
          ) {
            return node;
          }

          // Update the PropertyAssignment node
          return context.factory.updatePropertyAssignment(
            node,
            node.name,
            context.factory.createArrayLiteralExpression([
              ...arrayLiteral.elements,
              context.factory.createStringLiteral("vitest.setup.js"),
            ])
          );
        }
      }

      return ts.visitEachChild(node, visit, context);
    };

    const updates = ts.visitNode(rootNode, visit) as ts.SourceFile;

    return context.factory.updateSourceFile(updates, [...updates.statements]);
  };
};
