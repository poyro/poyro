import * as ts from "typescript";

/**
 * Function to insert the ImportClause node
 *
 * @param context - The transformation context
 * @returns The transformation function
 */
export const insertModuleDeclarationFactory: ts.TransformerFactory<
  ts.SourceFile
> = (context) => {
  return (rootNode) => {
    let hasModuleDeclaration = false;

    ts.forEachChild(rootNode, (node) => {
      if (
        ts.isModuleDeclaration(node) &&
        ts.isIdentifier(node.name) &&
        node.name.text === "vitest"
      ) {
        hasModuleDeclaration = true;
      }
    });

    if (hasModuleDeclaration) {
      return rootNode;
    }

    // Create a new ImportDeclaration node
    const exportAssignment = context.factory.createModuleDeclaration(
      [context.factory.createModifier(ts.SyntaxKind.DeclareKeyword)],
      context.factory.createIdentifier("vitest"),
      context.factory.createModuleBlock([])
    );

    const updates = context.factory.createNodeArray([
      ...rootNode.statements,
      exportAssignment,
    ]);

    return context.factory.updateSourceFile(rootNode, updates);
  };
};
