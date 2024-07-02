import * as ts from "typescript";

/**
 * Function to insert the ImportClause node
 *
 * @param context - The transformation context
 * @returns The transformation function
 */
export const insertInterfaceToModuleDeclaration =
  (
    interfaceName: string,
    extendsName: string,
    genericized = false
  ): ts.TransformerFactory<ts.SourceFile> =>
  (context) => {
    return (rootNode) => {
      const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
        // Get PropertyAssignment nodes
        if (
          ts.isModuleDeclaration(node) &&
          ts.isIdentifier(node.name) &&
          node.name.text === "vitest"
        ) {
          // Check if the PropertyAssignment node has an ArrayLiteralExpression
          if (node.body && ts.isModuleBlock(node.body)) {
            if (
              node.body.statements.find(
                (statement) =>
                  ts.isInterfaceDeclaration(statement) &&
                  ts.isIdentifier(statement.name) &&
                  statement.name.text === interfaceName &&
                  statement.heritageClauses &&
                  statement.heritageClauses.find((clause) =>
                    clause.types.find(
                      (type) =>
                        ts.isExpressionWithTypeArguments(type) &&
                        ts.isIdentifier(type.expression) &&
                        type.expression.text === extendsName
                    )
                  )
              )
            ) {
              return node;
            }

            // Update the PropertyAssignment node
            return context.factory.updateModuleDeclaration(
              node,
              node.modifiers,
              node.name,
              context.factory.updateModuleBlock(node.body, [
                ...node.body.statements,
                context.factory.createInterfaceDeclaration(
                  undefined,
                  context.factory.createIdentifier(interfaceName),
                  genericized
                    ? [
                        context.factory.createTypeParameterDeclaration(
                          undefined,
                          context.factory.createIdentifier("T"),
                          undefined,
                          context.factory.createKeywordTypeNode(
                            ts.SyntaxKind.AnyKeyword
                          )
                        ),
                      ]
                    : [],
                  [
                    context.factory.createHeritageClause(
                      ts.SyntaxKind.ExtendsKeyword,
                      [
                        context.factory.createExpressionWithTypeArguments(
                          context.factory.createIdentifier(extendsName),
                          genericized
                            ? [context.factory.createTypeReferenceNode("T")]
                            : []
                        ),
                      ]
                    ),
                  ],
                  []
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
