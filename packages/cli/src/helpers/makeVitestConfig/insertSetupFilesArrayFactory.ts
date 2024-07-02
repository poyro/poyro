import * as ts from "typescript";

/**
 * Function to insert the ImportClause node
 *
 * @param context - The transformation context
 * @returns The transformation function
 */
export const insertSetupFilesArrayFactory: ts.TransformerFactory<
  ts.SourceFile
> = (context) => {
  return (rootNode) => {
    const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
      // Get PropertyAssignment nodes
      if (
        ts.isPropertyAssignment(node) &&
        ts.isIdentifier(node.name) &&
        node.name.text === "test"
      ) {
        // Check if the PropertyAssignment node has an ObjectLiteralExpression
        if (ts.isObjectLiteralExpression(node.initializer)) {
          // Get the ObjectLiteralExpression node
          const objectLiteral = node.initializer;

          // Check if the ObjectLiteralExpression node includes "setupFiles"
          if (
            objectLiteral.properties.find(
              (prop) =>
                ts.isPropertyAssignment(prop) &&
                ts.isIdentifier(prop.name) &&
                prop.name.text === "setupFiles"
            )
          ) {
            return node;
          }

          // Update the PropertyAssignment node
          return context.factory.updatePropertyAssignment(
            node,
            node.name,
            context.factory.createObjectLiteralExpression([
              ...objectLiteral.properties,
              context.factory.createPropertyAssignment(
                context.factory.createIdentifier("setupFiles"),
                context.factory.createArrayLiteralExpression([])
              ),
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
