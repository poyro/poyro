import * as ts from "typescript";

/**
 * Function to insert the ParallelismKey node
 *
 * @param context - The transformation context
 * @returns The transformation function
 */
export const insertReporterVerboseKeyFactory: ts.TransformerFactory<
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

          // Update the PropertyAssignment node
          return context.factory.updatePropertyAssignment(
            node,
            node.name,
            context.factory.createObjectLiteralExpression([
              ...objectLiteral.properties.filter(
                prop => {
                  return ts.isPropertyAssignment(prop) &&
                    ts.isIdentifier(prop.name) &&
                    prop.name.text !== "reporter"
                }
              ),
              context.factory.createPropertyAssignment(
                context.factory.createIdentifier("reporter"),
                context.factory.createStringLiteral("verbose")
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
