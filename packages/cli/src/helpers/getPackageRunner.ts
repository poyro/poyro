import path from "node:path";
import fs from "node:fs";
import { makeLogMessage } from "./makeLogMessage";

export const getPackageRunner = (): "npm" | "yarn" | "pnpm" => {
  // Get the current working directory
  const cwd = process.cwd();

  // Check if 'package-lock.json' exists
  if (fs.existsSync(path.join(cwd, "package-lock.json"))) {
    return "npm";
  }

  // Check if 'yarn.lock' exists
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
    return "yarn";
  }

  // Check if 'pnpm-lock.yaml' exists
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  console.log(makeLogMessage("No lock file found, defaulting to npm."));

  return "npm";
};
