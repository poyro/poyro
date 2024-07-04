import * as ts from "typescript";

/**
 * Function to update the ImportDeclaration node
 *
 * @param context - The transformation context
 * @param node - The ImportDeclaration node
 * @param existingNamedImports - The existing NamedImports node
 * @returns The updated ImportDeclaration node
 */
const updateImportDeclaration = (
  context: ts.TransformationContext,
  node: ts.Node,
  existingNamedImports: ts.ImportSpecifier[] = []
) => {
  if (!ts.isImportDeclaration(node)) {
    return node;
  }

  // Create a new ImportSpecifier node
  const importSpecifier = context.factory.createImportSpecifier(
    false,
    undefined,
    context.factory.createIdentifier("defineConfig")
  );

  // Create a new NamedImports node
  const newNamedImports = context.factory.createNamedImports([
    ...existingNamedImports,
    importSpecifier,
  ]);

  // Update the ImportClause node if it exists, otherwise create a new one
  const newImportClause = node.importClause
    ? context.factory.updateImportClause(
        node.importClause,
        node.importClause?.isTypeOnly,
        node.importClause?.name,
        newNamedImports
      )
    : context.factory.createImportClause(false, undefined, newNamedImports);

  // Update the ImportDeclaration node
  return context.factory.updateImportDeclaration(
    node,
    node.modifiers,
    newImportClause,
    node.moduleSpecifier,
    node.attributes
  );
};

/**
 * Function to insert the ImportClause node
 *
 * @param context - The transformation context
 * @returns The transformation function
 */
export const insertImportClauseFactory: ts.TransformerFactory<ts.SourceFile> = (
  context
) => {
  return (rootNode) => {
    const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
      // Get ImportDeclaration nodes whose moduleSpecifier is "vitest/config"
      if (
        ts.isImportDeclaration(node) &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        node.moduleSpecifier.text === "vitest/config"
      ) {
        // Check if the ImportDeclaration node has an ImportClause
        if (node.importClause && ts.isImportClause(node.importClause)) {
          // Check if the ImportClause node has NamedImports
          if (
            node.importClause.namedBindings &&
            ts.isNamedImports(node.importClause.namedBindings)
          ) {
            // Get the NamedImports node
            const namedImports = node.importClause.namedBindings;

            // Check if the NamedImports node includes "defineConfig"
            if (
              namedImports.elements.find(
                (element) => element.name.text === "defineConfig"
              )
            ) {
              return node;
            }

            return updateImportDeclaration(
              context,
              node,
              Array.from(namedImports.elements)
            );
          }
        }

        return updateImportDeclaration(context, node);
      }

      return ts.visitEachChild(node, visit, context);
    };

    const updates = ts.visitNode(rootNode, visit) as ts.SourceFile;

    return context.factory.updateSourceFile(updates, [...updates.statements]);
  };
};
