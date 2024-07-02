import * as ts from "typescript";

/**
 * Function to insert the ImportClause node
 *
 * @param context - The transformation context
 * @returns The transformation function
 */
export const insertTestObjectFactory: ts.TransformerFactory<ts.SourceFile> = (
  context
) => {
  return (rootNode) => {
    const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
      // Get ExportAssignment nodes
      if (ts.isExportAssignment(node)) {
        // Check if the ExportAssignment node is a CallExpression
        if (
          ts.isCallExpression(node.expression) &&
          ts.isIdentifier(node.expression.expression) &&
          node.expression.expression.text === "defineConfig"
        ) {
          // Check if the CallExpression node has an ObjectLiteralExpression
          if (ts.isObjectLiteralExpression(node.expression.arguments[0])) {
            // Get the ObjectLiteralExpression node
            const objectLiteral = node.expression.arguments[0];

            // Check if the ObjectLiteralExpression node includes "test"
            if (
              objectLiteral.properties.find(
                (prop) =>
                  ts.isPropertyAssignment(prop) &&
                  ts.isIdentifier(prop.name) &&
                  prop.name.text === "test"
              )
            ) {
              return node;
            }

            // Create a new PropertyAssignment node
            const propertyAssignment = context.factory.createPropertyAssignment(
              context.factory.createIdentifier("test"),
              context.factory.createObjectLiteralExpression([])
            );

            // Return the new ObjectLiteralExpression node
            // after the last PropertyAssignment node
            return context.factory.updateExportAssignment(
              node,
              node.modifiers,
              context.factory.updateCallExpression(
                node.expression,
                node.expression.expression,
                node.expression.typeArguments,
                [
                  context.factory.createObjectLiteralExpression([
                    ...objectLiteral.properties,
                    propertyAssignment,
                  ]),
                ]
              )
            );
          }
        }
      }

      return ts.visitEachChild(node, visit, context);
    };

    const updates = ts.visitNode(rootNode, visit) as ts.SourceFile;

    return context.factory.updateSourceFile(updates, [...updates.statements]);
  };
};
