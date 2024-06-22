import path from "node:path";

import findCacheDirectory from "find-cache-dir";

import constants from "../../constants.json";

import { makeLogMessage } from "./makeLogMessage";

export const getModelPath = (): {
  cacheDir: string;
  dirPath: string;
  filename: string;
} => {
  // get the cache directory
  const cacheDir = findCacheDirectory({ name: "@poyro/vitest" });

  // Throw an error if the cache directory could not be identified
  if (!cacheDir) {
    throw new Error(makeLogMessage(`Could not identify cache directory`));
  }

  // Put together the directory path for the models
  const dirPath = path.join(cacheDir, "models");

  // Put together the file path
  return { cacheDir, dirPath, filename: constants.model.filename };
};
