import fs from "node:fs";

import { makeLogMessage } from "./makeLogMessage";
import { checkFileExists } from "./checkFileExists";

export interface PackageJson {
  name: string;
  type?: string;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export const getPackageJson = (): PackageJson => {
  // Get the current working directory
  const cwd = process.cwd();

  // Check if the package.json file exists
  const [packageJsonExists, packageJsonPath] = checkFileExists("package.json");

  // Throw
  if (!packageJsonExists) {
    throw new Error(makeLogMessage(`package.json not found in '${cwd}'`));
  }

  // Read the package.json file
  const packageJsonStr = fs.readFileSync(packageJsonPath, {
    encoding: "utf8",
  });

  try {
    return JSON.parse(packageJsonStr) as PackageJson;
  } catch (err) {
    throw new Error(`Error parsing package.json: ${err}`);
  }
};
