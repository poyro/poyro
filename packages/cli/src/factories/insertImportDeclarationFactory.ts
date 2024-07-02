import * as ts from "typescript";

/**
 * Function to insert the ImportClause node
 *
 * @param context - The transformation context
 * @returns The transformation function
 */
export const insertImportDeclarationFactory =
  (moduleName: string): ts.TransformerFactory<ts.SourceFile> =>
  (context) => {
    return (rootNode) => {
      let hasImportDeclaration = false;

      ts.forEachChild(rootNode, (node) => {
        if (
          ts.isImportDeclaration(node) &&
          ts.isStringLiteral(node.moduleSpecifier) &&
          node.moduleSpecifier.text === moduleName
        ) {
          hasImportDeclaration = true;
        }
      });

      if (hasImportDeclaration) {
        return rootNode;
      }

      // Create a new ImportDeclaration node
      const importDeclaration = context.factory.createImportDeclaration(
        undefined,
        undefined,
        context.factory.createStringLiteral(moduleName)
      );

      const updates = context.factory.createNodeArray([
        importDeclaration,
        ...rootNode.statements,
      ]);

      return context.factory.updateSourceFile(rootNode, updates);
    };
  };
