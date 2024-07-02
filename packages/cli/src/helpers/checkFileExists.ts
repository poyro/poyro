import path from "node:path";
import fs from "node:fs";

/**
 * Check if a file exists
 *
 * @param relPath - The relative path to the file from the current working directory
 * @returns Boolean indicating if the file exists
 */
export const checkFileExists = (
  relPath: string
): [exists: boolean, absPath: string] => {
  // Get the current working directory
  const cwd = process.cwd();

  // Get the package.json file
  const realPath = path.join(cwd, relPath);

  return [fs.existsSync(realPath), realPath];
};
