import * as ts from "typescript";

import { encodeEmptyLines } from "./encodeEmptyLines";
import { decodeEmptyLines } from "./decodeEmptyLines";

/**
 * Function to transform the SourceFile AST
 *
 * @param fileName - The file name
 * @param sourceText - The source code text
 * @param transformers - The transformation functions
 * @returns The transformed source code
 */
export const transformSourceFile = (
  fileName: string,
  sourceText: string,
  transformers: ts.TransformerFactory<ts.SourceFile>[]
): string => {
  // Create a SourceFile from the source code
  const sourceFile = ts.createSourceFile(
    fileName, // file name
    encodeEmptyLines(sourceText), // source code text
    ts.ScriptTarget.Latest // TypeScript version target
  );

  // Initialize transformation with the initial context
  const transformedSourceFile = ts.transform(sourceFile, transformers);

  // Create a printer to print the transformed AST
  const printer = ts.createPrinter();

  // if no changes were made, don't write to the file
  if (transformedSourceFile.transformed.every((f) => f === undefined)) {
    return sourceText;
  }

  // Generate code from AST
  const [[, source]] = transformedSourceFile.transformed.map((f) => [
    f.fileName,
    printer.printNode(ts.EmitHint.Unspecified, f, undefined as any),
  ]);

  // Return the transformed source code
  return decodeEmptyLines(source);
};
